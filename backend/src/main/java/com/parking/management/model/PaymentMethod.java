package com.parking.management.model;

public enum PaymentMethod {
    CASH,
    UPI,
    CARD;

    public static PaymentMethod fromString(String method) {
        if (method == null) {
            throw new IllegalArgumentException("Payment method cannot be null");
        }
        return PaymentMethod.valueOf(method.trim().toUpperCase());
    }
}
