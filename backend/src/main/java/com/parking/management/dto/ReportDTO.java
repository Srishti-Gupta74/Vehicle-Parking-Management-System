package com.parking.management.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class ReportDTO {

    private long totalVehicles;
    private long totalSessions;
    private long activeSessions;
    private long completedSessions;
    private double totalRevenue;
    private double averageFee;
    private double averageDurationHours;
    private double occupancyRate;

    private Map<String, Long> vehicleCountsByType;
    private Map<String, Double> revenueByType;
    private Map<String, Long> sessionsByPaymentMethod;
    private List<String> exportFilesAvailable;
    private LocalDateTime generatedAt;

    public ReportDTO() {
        this.generatedAt = LocalDateTime.now();
    }

    public long getTotalVehicles() {
        return totalVehicles;
    }

    public void setTotalVehicles(long totalVehicles) {
        this.totalVehicles = totalVehicles;
    }

    public long getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(long totalSessions) {
        this.totalSessions = totalSessions;
    }

    public long getActiveSessions() {
        return activeSessions;
    }

    public void setActiveSessions(long activeSessions) {
        this.activeSessions = activeSessions;
    }

    public long getCompletedSessions() {
        return completedSessions;
    }

    public void setCompletedSessions(long completedSessions) {
        this.completedSessions = completedSessions;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getAverageFee() {
        return averageFee;
    }

    public void setAverageFee(double averageFee) {
        this.averageFee = averageFee;
    }

    public double getAverageDurationHours() {
        return averageDurationHours;
    }

    public void setAverageDurationHours(double averageDurationHours) {
        this.averageDurationHours = averageDurationHours;
    }

    public double getOccupancyRate() {
        return occupancyRate;
    }

    public void setOccupancyRate(double occupancyRate) {
        this.occupancyRate = occupancyRate;
    }

    public Map<String, Long> getVehicleCountsByType() {
        return vehicleCountsByType;
    }

    public void setVehicleCountsByType(Map<String, Long> vehicleCountsByType) {
        this.vehicleCountsByType = vehicleCountsByType;
    }

    public Map<String, Double> getRevenueByType() {
        return revenueByType;
    }

    public void setRevenueByType(Map<String, Double> revenueByType) {
        this.revenueByType = revenueByType;
    }

    public Map<String, Long> getSessionsByPaymentMethod() {
        return sessionsByPaymentMethod;
    }

    public void setSessionsByPaymentMethod(Map<String, Long> sessionsByPaymentMethod) {
        this.sessionsByPaymentMethod = sessionsByPaymentMethod;
    }

    public List<String> getExportFilesAvailable() {
        return exportFilesAvailable;
    }

    public void setExportFilesAvailable(List<String> exportFilesAvailable) {
        this.exportFilesAvailable = exportFilesAvailable;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}
