package com.parking.management.service;

import com.parking.management.dto.VehicleDTO;
import com.parking.management.exception.InvalidVehicleException;
import com.parking.management.exception.VehicleNotFoundException;
import com.parking.management.model.*;
import com.parking.management.repository.ParkingSessionRepository;
import com.parking.management.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final ParkingSessionRepository sessionRepository;

    @Autowired
    public VehicleService(VehicleRepository vehicleRepository, ParkingSessionRepository sessionRepository) {
        this.vehicleRepository = vehicleRepository;
        this.sessionRepository = sessionRepository;
    }

    /**
     * Factory method instantiating the correct concrete Vehicle subclass
     * based on vehicle type (Bike, Car, Truck) demonstrating Runtime Polymorphism.
     */
    @Transactional
    public Vehicle findOrCreateVehicle(String vehicleNumber, String ownerName, String vehicleTypeStr, String phoneNumber) {
        if (vehicleNumber == null || vehicleNumber.trim().isEmpty()) {
            throw new InvalidVehicleException("Vehicle number cannot be empty");
        }
        String cleanNumber = vehicleNumber.trim().toUpperCase();

        Optional<Vehicle> existingOpt = vehicleRepository.findByVehicleNumber(cleanNumber);
        if (existingOpt.isPresent()) {
            Vehicle existing = existingOpt.get();
            // Update owner and phone if changed
            if (ownerName != null && !ownerName.trim().isEmpty()) {
                existing.setOwnerName(ownerName.trim());
            }
            if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
                existing.setPhoneNumber(phoneNumber.trim());
            }
            return vehicleRepository.save(existing);
        }

        // Switch statement demonstrating control flow
        Vehicle newVehicle;
        VehicleType type = VehicleType.fromString(vehicleTypeStr);
        switch (type) {
            case BIKE:
                newVehicle = new Bike(cleanNumber, ownerName, phoneNumber);
                break;
            case TRUCK:
                newVehicle = new Truck(cleanNumber, ownerName, phoneNumber);
                break;
            case CAR:
            default:
                newVehicle = new Car(cleanNumber, ownerName, phoneNumber);
                break;
        }

        return vehicleRepository.save(newVehicle);
    }

    public List<VehicleDTO> getAllVehicles() {
        List<Vehicle> list = vehicleRepository.findAll();
        List<VehicleDTO> dtos = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (Vehicle v : list) {
            dtos.add(mapToDTO(v, now));
        }
        return dtos;
    }

    public List<VehicleDTO> searchVehicles(String query) {
        List<Vehicle> list;
        if (query == null || query.trim().isEmpty()) {
            list = vehicleRepository.findAll();
        } else {
            list = vehicleRepository.searchVehicles(query.trim());
        }

        List<VehicleDTO> dtos = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (Vehicle v : list) {
            dtos.add(mapToDTO(v, now));
        }
        return dtos;
    }

    public VehicleDTO getVehicleById(Long id) {
        Vehicle v = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found with ID: " + id));
        return mapToDTO(v, LocalDateTime.now());
    }

    public List<ParkingSession> getVehicleSessions(Long vehicleId) {
        return sessionRepository.findByVehicle_VehicleIdOrderByEntryTimeDesc(vehicleId);
    }

    private VehicleDTO mapToDTO(Vehicle v, LocalDateTime now) {
        VehicleDTO dto = new VehicleDTO();
        dto.setVehicleId(v.getVehicleId());
        dto.setVehicleNumber(v.getVehicleNumber());
        dto.setOwnerName(v.getOwnerName());
        dto.setVehicleType(v.getVehicleType());
        dto.setPhoneNumber(v.getPhoneNumber());
        dto.setCreatedAt(v.getCreatedAt());

        Optional<ParkingSession> activeSessionOpt = sessionRepository.findByVehicle_VehicleNumberAndStatus(
                v.getVehicleNumber(), SessionStatus.ACTIVE);

        if (activeSessionOpt.isPresent()) {
            ParkingSession sess = activeSessionOpt.get();
            dto.setCurrentlyParked(true);
            dto.setCurrentSessionId(sess.getSessionId());
            dto.setCurrentSlotNumber(sess.getSlot().getSlotNumber());
            dto.setCurrentEntryTime(sess.getEntryTime());

            long duration = sess.calculateDurationHours(now);
            dto.setCurrentDurationHours(duration);
            dto.setCurrentEstimatedFee(v.calculateParkingFee(duration));
        } else {
            dto.setCurrentlyParked(false);
        }
        return dto;
    }
}
