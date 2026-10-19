package com.parking.management.dto;

import jakarta.validation.constraints.NotBlank;

public class CheckoutRequest {

    @NotBlank(message = "Vehicle number is required")
    private String vehicleNumber;

    @NotBlank(message = "Payment method is required (CASH, UPI, CARD)")
    private String paymentMethod;

    public CheckoutRequest() {}

    public CheckoutRequest(String vehicleNumber, String paymentMethod) {
        this.vehicleNumber = vehicleNumber;
        this.paymentMethod = paymentMethod;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
