package com.parking.management.controller;

import com.parking.management.dto.VehicleDTO;
import com.parking.management.model.ParkingSession;
import com.parking.management.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    private final VehicleService vehicleService;

    @Autowired
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<VehicleDTO>> searchVehicles(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(vehicleService.searchVehicles(query));
    }

    @GetMapping("/{id}/sessions")
    public ResponseEntity<List<ParkingSession>> getVehicleSessions(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleSessions(id));
    }
}
