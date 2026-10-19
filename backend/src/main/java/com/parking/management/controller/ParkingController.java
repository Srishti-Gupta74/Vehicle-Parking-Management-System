package com.parking.management.controller;

import com.parking.management.dto.*;
import com.parking.management.exception.ParkingLotFullException;
import com.parking.management.exception.SlotUnavailableException;
import com.parking.management.model.ParkingReceipt;
import com.parking.management.model.ParkingSession;
import com.parking.management.model.ParkingTicket;
import com.parking.management.service.ParkingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parking")
@CrossOrigin(origins = "*")
public class ParkingController {

    private final ParkingService parkingService;

    @Autowired
    public ParkingController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

    @PostMapping("/park")
    public ResponseEntity<ParkVehicleResponse> parkVehicle(@Valid @RequestBody ParkVehicleRequest request)
            throws ParkingLotFullException {
        ParkVehicleResponse response = parkingService.parkVehicle(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkoutVehicle(@Valid @RequestBody CheckoutRequest request)
            throws SlotUnavailableException {
        CheckoutResponse response = parkingService.checkoutVehicle(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/estimate/{vehicleNumber}")
    public ResponseEntity<CheckoutResponse> estimateCheckout(@PathVariable String vehicleNumber) {
        CheckoutResponse estimate = parkingService.estimateCheckout(vehicleNumber);
        return ResponseEntity.ok(estimate);
    }

    @GetMapping("/active")
    public ResponseEntity<List<ParkingSession>> getActiveSessions() {
        return ResponseEntity.ok(parkingService.getActiveSessions());
    }

    @GetMapping("/history")
    public ResponseEntity<List<ParkingSession>> getParkingHistory(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false, defaultValue = "ALL") String vehicleType) {
        return ResponseEntity.ok(parkingService.getAllHistory(search, status, vehicleType));
    }

    @GetMapping("/ticket/{sessionId}")
    public ResponseEntity<ParkingTicket> getTicket(@PathVariable Long sessionId) {
        return ResponseEntity.ok(parkingService.getTicketBySessionId(sessionId));
    }

    @GetMapping("/receipt/{sessionId}")
    public ResponseEntity<ParkingReceipt> getReceipt(@PathVariable Long sessionId) {
        return ResponseEntity.ok(parkingService.getReceiptBySessionId(sessionId));
    }
}
