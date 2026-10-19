package com.parking.management.controller;

import com.parking.management.dto.ParkingSlotDTO;
import com.parking.management.exception.SlotUnavailableException;
import com.parking.management.model.ParkingSlot;
import com.parking.management.model.SlotStatus;
import com.parking.management.service.SlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = "*")
public class SlotController {

    private final SlotService slotService;

    @Autowired
    public SlotController(SlotService slotService) {
        this.slotService = slotService;
    }

    @GetMapping
    public ResponseEntity<List<ParkingSlotDTO>> getAllSlots() {
        return ResponseEntity.ok(slotService.getAllSlotsWithDetails());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingSlot> getSlotById(@PathVariable Long id) {
        return ResponseEntity.ok(slotService.getSlotById(id));
    }

    @PostMapping
    public ResponseEntity<ParkingSlot> createSlot(@RequestBody Map<String, Object> payload) {
        String slotNumber = (String) payload.get("slotNumber");
        String slotType = (String) payload.get("slotType");
        int floor = payload.get("floor") != null ? Integer.parseInt(payload.get("floor").toString()) : 1;

        ParkingSlot created = slotService.createSlot(slotNumber, slotType, floor);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ParkingSlot> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body)
            throws SlotUnavailableException {
        String statusStr = body.get("status");
        SlotStatus status = SlotStatus.valueOf(statusStr.toUpperCase());
        ParkingSlot updated = slotService.updateSlotStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteSlot(@PathVariable Long id) throws SlotUnavailableException {
        slotService.deleteSlot(id);
        return ResponseEntity.ok(Map.of("message", "Parking slot deleted successfully."));
    }
}
