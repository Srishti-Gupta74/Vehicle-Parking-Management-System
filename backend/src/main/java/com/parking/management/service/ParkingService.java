package com.parking.management.service;

import com.parking.management.dto.*;
import com.parking.management.exception.*;
import com.parking.management.model.*;
import com.parking.management.repository.*;
import com.parking.management.threads.ParkingRequestQueue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Core Parking Management Service.
 *
 * Demonstrates:
 * 1. Synchronized parking slot assignment preventing race conditions (CSC2104 Syllabus)
 * 2. Runtime Polymorphism for vehicle-type specific fee calculation
 * 3. Composition (ParkingSession HAS-A Vehicle and HAS-A ParkingSlot)
 * 4. Inter-Thread Communication notification via ParkingRequestQueue
 * 5. Custom Exception handling (ParkingLotFullException, VehicleAlreadyParkedException, etc.)
 */
@Service
public class ParkingService {

    private static final Logger logger = LoggerFactory.getLogger(ParkingService.class);

    private final VehicleService vehicleService;
    private final ParkingSlotRepository slotRepository;
    private final ParkingSessionRepository sessionRepository;
    private final PaymentRepository paymentRepository;
    private final ParkingActivityLogRepository activityLogRepository;
    private final ParkingRequestQueue parkingRequestQueue;

    // Monitor object for thread synchronization
    private final Object slotAllocationLock = new Object();

    @Autowired
    public ParkingService(VehicleService vehicleService,
                          ParkingSlotRepository slotRepository,
                          ParkingSessionRepository sessionRepository,
                          PaymentRepository paymentRepository,
                          ParkingActivityLogRepository activityLogRepository,
                          ParkingRequestQueue parkingRequestQueue) {
        this.vehicleService = vehicleService;
        this.slotRepository = slotRepository;
        this.sessionRepository = sessionRepository;
        this.paymentRepository = paymentRepository;
        this.activityLogRepository = activityLogRepository;
        this.parkingRequestQueue = parkingRequestQueue;
    }

    /**
     * Synchronized method allocating a parking slot and creating a session.
     * Prevents race conditions when two concurrent requests try to grab the same slot.
     */
    @Transactional
    public ParkVehicleResponse parkVehicle(ParkVehicleRequest request) throws ParkingLotFullException {
        if (request == null) {
            throw new InvalidVehicleException("Park request cannot be null");
        }

        String vehicleNum = request.getVehicleNumber().trim().toUpperCase();

        // 1. Check if vehicle is already actively parked
        Optional<ParkingSession> activeOpt = sessionRepository.findByVehicle_VehicleNumberAndStatus(
                vehicleNum, SessionStatus.ACTIVE);
        if (activeOpt.isPresent()) {
            throw new VehicleAlreadyParkedException(
                    "Vehicle " + vehicleNum + " is already parked in slot " +
                    activeOpt.get().getSlot().getSlotNumber());
        }

        // 2. Register or fetch vehicle (polymorphic factory)
        Vehicle vehicle = vehicleService.findOrCreateVehicle(
                vehicleNum, request.getOwnerName(), request.getVehicleType(), request.getPhoneNumber());

        SlotType requiredSlotType;
        try {
            requiredSlotType = SlotType.fromString(request.getVehicleType());
        } catch (IllegalArgumentException e) {
            throw new InvalidVehicleException("Invalid vehicle type: " + request.getVehicleType());
        }

        ParkingSlot assignedSlot;

        // 3. SYNCHRONIZED CRITICAL SECTION: Assign slot atomically
        synchronized (slotAllocationLock) {
            List<ParkingSlot> availableSlots = slotRepository.findBySlotTypeAndStatus(
                    requiredSlotType, SlotStatus.AVAILABLE);

            if (availableSlots.isEmpty()) {
                logger.warn("No available slot found for vehicle {} ({})", vehicleNum, requiredSlotType);
                throw new ParkingLotFullException(
                        "Parking Lot is full! No available " + requiredSlotType + " slot found.");
            }

            // Pick the first available compatible slot
            assignedSlot = availableSlots.get(0);
            assignedSlot.occupy();
            slotRepository.save(assignedSlot);
        }

        // 4. Create parking session
        LocalDateTime entryTime = LocalDateTime.now();
        ParkingSession session = new ParkingSession(vehicle, assignedSlot, entryTime);
        ParkingSession savedSession = sessionRepository.save(session);

        // 5. Generate ticket
        ParkingTicket ticket = new ParkingTicket(savedSession.getSessionId(), vehicle, assignedSlot, entryTime);

        // 6. Record audit log
        activityLogRepository.save(new ParkingActivityLog("PARK",
                String.format("Vehicle %s (%s) parked at slot %s (Floor %d).",
                        vehicle.getVehicleNumber(), vehicle.getVehicleType(),
                        assignedSlot.getSlotNumber(), assignedSlot.getFloor())));

        logger.info("Vehicle {} successfully parked in slot {}", vehicleNum, assignedSlot.getSlotNumber());

        return new ParkVehicleResponse(
                savedSession.getSessionId(),
                ticket.getTicketNumber(),
                vehicle.getVehicleNumber(),
                vehicle.getVehicleType(),
                vehicle.getOwnerName(),
                assignedSlot.getSlotNumber(),
                assignedSlot.getFloor(),
                entryTime,
                "Vehicle parked successfully in slot " + assignedSlot.getSlotNumber()
        );
    }

    /**
     * Checks out an actively parked vehicle, calculates fee polymorphically,
     * records payment, and vacates the slot.
     */
    @Transactional
    public CheckoutResponse checkoutVehicle(CheckoutRequest request) throws SlotUnavailableException {
        if (request == null || request.getVehicleNumber() == null) {
            throw new IllegalArgumentException("Checkout request requires vehicle number");
        }

        String vehicleNum = request.getVehicleNumber().trim().toUpperCase();

        // 1. Locate active parking session
        ParkingSession session = sessionRepository.findByVehicle_VehicleNumberAndStatus(
                vehicleNum, SessionStatus.ACTIVE)
                .orElseThrow(() -> new VehicleNotFoundException(
                        "No active parking session found for vehicle number: " + vehicleNum));

        Vehicle vehicle = session.getVehicle();
        ParkingSlot slot = session.getSlot();

        LocalDateTime exitTime = LocalDateTime.now();
        long durationHours = session.calculateDurationHours(exitTime);

        // 2. RUNTIME POLYMORPHISM: Fee calculation executes the overridden method
        // in Bike, Car, or Truck depending on actual runtime object type!
        double parkingFee = vehicle.calculateParkingFee(durationHours);

        // 3. Process payment method
        PaymentMethod method;
        try {
            method = PaymentMethod.fromString(request.getPaymentMethod());
        } catch (IllegalArgumentException e) {
            method = PaymentMethod.CASH;
        }

        // Complete session
        session.complete(exitTime, parkingFee);
        sessionRepository.save(session);

        // Save Payment record
        Payment payment = new Payment(session, parkingFee, method, PaymentStatus.PAID);
        paymentRepository.save(payment);

        // 4. Vacate parking slot
        slot.vacate();
        slotRepository.save(slot);

        // 5. INTER-THREAD COMMUNICATION: Notify any waiting threads that a slot is free!
        parkingRequestQueue.notifySlotFreed(slot.getSlotNumber(), slot.getSlotType().name());

        // 6. Record audit log
        activityLogRepository.save(new ParkingActivityLog("CHECKOUT",
                String.format("Vehicle %s checked out from slot %s. Duration: %d hr(s), Fee: ₹%.2f via %s.",
                        vehicleNum, slot.getSlotNumber(), durationHours, parkingFee, method)));

        // 7. Generate receipt details
        ParkingReceipt receipt = new ParkingReceipt(
                session.getSessionId(),
                vehicle,
                slot,
                session.getEntryTime(),
                exitTime,
                durationHours,
                parkingFee,
                method.name(),
                "PAID"
        );

        CheckoutResponse resp = new CheckoutResponse();
        resp.setReceiptNumber(receipt.getReceiptNumber());
        resp.setSessionId(session.getSessionId());
        resp.setVehicleNumber(vehicle.getVehicleNumber());
        resp.setVehicleType(vehicle.getVehicleType());
        resp.setOwnerName(vehicle.getOwnerName());
        resp.setSlotNumber(slot.getSlotNumber());
        resp.setFloor(slot.getFloor());
        resp.setEntryTime(session.getEntryTime());
        resp.setExitTime(exitTime);
        resp.setDurationHours(durationHours);
        resp.setParkingFee(parkingFee);
        resp.setPaymentMethod(method.name());
        resp.setPaymentStatus("PAID");
        resp.setMessage("Vehicle checked out successfully. Total fee: ₹" + String.format("%.2f", parkingFee));

        return resp;
    }

    /**
     * Estimates checkout fee for a parked vehicle without finalizing checkout.
     */
    public CheckoutResponse estimateCheckout(String vehicleNumber) {
        String vehicleNum = vehicleNumber.trim().toUpperCase();
        ParkingSession session = sessionRepository.findByVehicle_VehicleNumberAndStatus(
                vehicleNum, SessionStatus.ACTIVE)
                .orElseThrow(() -> new VehicleNotFoundException(
                        "No active parking session found for vehicle: " + vehicleNum));

        Vehicle vehicle = session.getVehicle();
        ParkingSlot slot = session.getSlot();
        LocalDateTime now = LocalDateTime.now();
        long duration = session.calculateDurationHours(now);
        double estimatedFee = vehicle.calculateParkingFee(duration);

        CheckoutResponse resp = new CheckoutResponse();
        resp.setSessionId(session.getSessionId());
        resp.setVehicleNumber(vehicle.getVehicleNumber());
        resp.setVehicleType(vehicle.getVehicleType());
        resp.setOwnerName(vehicle.getOwnerName());
        resp.setSlotNumber(slot.getSlotNumber());
        resp.setFloor(slot.getFloor());
        resp.setEntryTime(session.getEntryTime());
        resp.setExitTime(now);
        resp.setDurationHours(duration);
        resp.setParkingFee(estimatedFee);
        resp.setPaymentMethod("PENDING");
        resp.setPaymentStatus("PENDING");
        return resp;
    }

    public List<ParkingSession> getActiveSessions() {
        return sessionRepository.findActiveSessions();
    }

    public List<ParkingSession> getAllHistory(String search, String statusStr, String vehicleType) {
        SessionStatus status = null;
        if (statusStr != null && !statusStr.trim().isEmpty() && !statusStr.equalsIgnoreCase("ALL")) {
            try {
                status = SessionStatus.valueOf(statusStr.trim().toUpperCase());
            } catch (Exception ignored) {}
        }

        List<ParkingSession> list = sessionRepository.findAllSessionsOrdered();
        return list.stream().filter(s -> {
            if (search != null && !search.trim().isEmpty()) {
                String q = search.trim().toLowerCase();
                boolean matchNum = s.getVehicle().getVehicleNumber().toLowerCase().contains(q);
                boolean matchOwner = s.getVehicle().getOwnerName().toLowerCase().contains(q);
                boolean matchSlot = s.getSlot().getSlotNumber().toLowerCase().contains(q);
                if (!matchNum && !matchOwner && !matchSlot) return false;
            }
            if (statusStr != null && !statusStr.equalsIgnoreCase("ALL")) {
                if (!s.getStatus().name().equalsIgnoreCase(statusStr)) return false;
            }
            if (vehicleType != null && !vehicleType.equalsIgnoreCase("ALL")) {
                if (!s.getVehicle().getVehicleType().equalsIgnoreCase(vehicleType)) return false;
            }
            return true;
        }).toList();
    }

    public ParkingTicket getTicketBySessionId(Long sessionId) {
        ParkingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));
        return new ParkingTicket(session.getSessionId(), session.getVehicle(), session.getSlot(), session.getEntryTime());
    }

    public ParkingReceipt getReceiptBySessionId(Long sessionId) {
        ParkingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        Optional<Payment> paymentOpt = paymentRepository.findBySession_SessionId(sessionId);
        String paymentMethod = paymentOpt.map(p -> p.getPaymentMethod().name()).orElse("CASH");
        String paymentStatus = paymentOpt.map(p -> p.getPaymentStatus().name()).orElse("PAID");

        long duration = session.getDuration() != null ? session.getDuration() : session.calculateDurationHours(session.getExitTime() != null ? session.getExitTime() : LocalDateTime.now());
        double fee = session.getParkingFee() != null ? session.getParkingFee() : session.getVehicle().calculateParkingFee(duration);

        return new ParkingReceipt(
                session.getSessionId(),
                session.getVehicle(),
                session.getSlot(),
                session.getEntryTime(),
                session.getExitTime() != null ? session.getExitTime() : LocalDateTime.now(),
                duration,
                fee,
                paymentMethod,
                paymentStatus
        );
    }
}
