package com.parking.management.service;

import com.parking.management.dto.ParkingSlotDTO;
import com.parking.management.exception.SlotUnavailableException;
import com.parking.management.model.*;
import com.parking.management.repository.ParkingActivityLogRepository;
import com.parking.management.repository.ParkingSessionRepository;
import com.parking.management.repository.ParkingSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SlotService {

    private final ParkingSlotRepository slotRepository;
    private final ParkingSessionRepository sessionRepository;
    private final ParkingActivityLogRepository activityLogRepository;

    @Autowired
    public SlotService(ParkingSlotRepository slotRepository,
                       ParkingSessionRepository sessionRepository,
                       ParkingActivityLogRepository activityLogRepository) {
        this.slotRepository = slotRepository;
        this.sessionRepository = sessionRepository;
        this.activityLogRepository = activityLogRepository;
    }

    public List<ParkingSlotDTO> getAllSlotsWithDetails() {
        List<ParkingSlot> slots = slotRepository.findAllByOrderByFloorAscSlotNumberAsc();
        List<ParkingSlotDTO> dtos = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (ParkingSlot s : slots) {
            ParkingSlotDTO dto = new ParkingSlotDTO();
            dto.setSlotId(s.getSlotId());
            dto.setSlotNumber(s.getSlotNumber());
            dto.setSlotType(s.getSlotType().name());
            dto.setFloor(s.getFloor());
            dto.setStatus(s.getStatus().name());

            if (s.getStatus() == SlotStatus.OCCUPIED) {
                Optional<ParkingSession> activeSessionOpt = sessionRepository.findBySlot_SlotIdAndStatus(
                        s.getSlotId(), SessionStatus.ACTIVE);
                if (activeSessionOpt.isPresent()) {
                    ParkingSession sess = activeSessionOpt.get();
                    Vehicle v = sess.getVehicle();
                    dto.setCurrentVehicleNumber(v.getVehicleNumber());
                    dto.setCurrentOwnerName(v.getOwnerName());
                    dto.setCurrentVehicleType(v.getVehicleType());
                    dto.setCurrentEntryTime(sess.getEntryTime());

                    long duration = sess.calculateDurationHours(now);
                    dto.setCurrentDurationHours(duration);
                    // Polymorphic fee preview:
                    dto.setCurrentEstimatedFee(v.calculateParkingFee(duration));
                }
            }
            dtos.add(dto);
        }
        return dtos;
    }

    public List<ParkingSlot> getRawSlots() {
        return slotRepository.findAllByOrderByFloorAscSlotNumberAsc();
    }

    public ParkingSlot getSlotById(Long id) {
        return slotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Slot not found with ID: " + id));
    }

    @Transactional
    public ParkingSlot createSlot(String slotNumber, String slotTypeStr, int floor) {
        if (slotNumber == null || slotNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Slot number is required");
        }
        String cleanNum = slotNumber.trim().toUpperCase();
        if (slotRepository.findBySlotNumber(cleanNum).isPresent()) {
            throw new IllegalArgumentException("Slot number already exists: " + cleanNum);
        }

        SlotType type = SlotType.fromString(slotTypeStr);
        ParkingSlot newSlot = new ParkingSlot(cleanNum, type, floor > 0 ? floor : 1);
        ParkingSlot saved = slotRepository.save(newSlot);

        activityLogRepository.save(new ParkingActivityLog("SLOT_ADDED",
                "New parking slot " + saved.getSlotNumber() + " (" + saved.getSlotType() + ") added on floor " + saved.getFloor()));

        return saved;
    }

    @Transactional
    public void deleteSlot(Long slotId) throws SlotUnavailableException {
        ParkingSlot slot = getSlotById(slotId);
        // Business Rule: Cannot delete an occupied slot
        if (slot.getStatus() == SlotStatus.OCCUPIED) {
            throw new SlotUnavailableException("Cannot delete slot " + slot.getSlotNumber() + " because it is currently OCCUPIED!");
        }

        slotRepository.delete(slot);
        activityLogRepository.save(new ParkingActivityLog("SLOT_DELETED",
                "Parking slot " + slot.getSlotNumber() + " deleted by administrator."));
    }

    @Transactional
    public ParkingSlot updateSlotStatus(Long slotId, SlotStatus newStatus) throws SlotUnavailableException {
        ParkingSlot slot = getSlotById(slotId);
        if (slot.getStatus() == SlotStatus.OCCUPIED && newStatus == SlotStatus.AVAILABLE) {
            Optional<ParkingSession> activeSess = sessionRepository.findBySlot_SlotIdAndStatus(slotId, SessionStatus.ACTIVE);
            if (activeSess.isPresent()) {
                throw new SlotUnavailableException("Cannot mark slot as AVAILABLE while an active session exists. Please checkout vehicle first.");
            }
        }
        slot.setStatus(newStatus);
        return slotRepository.save(slot);
    }
}
