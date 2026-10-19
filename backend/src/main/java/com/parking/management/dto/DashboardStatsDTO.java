package com.parking.management.dto;

import com.parking.management.model.ParkingActivityLog;
import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {

    private long totalSlots;
    private long availableSlots;
    private long occupiedSlots;
    private long vehiclesParkedToday;
    private long activeSessions;
    private double todayRevenue;
    private double totalRevenue;
    private double occupancyRatePercentage;

    private Map<String, Long> vehicleTypeDistribution;
    private Map<String, Double> paymentMethodRevenue;
    private List<DailyRevenuePoint> weeklyRevenue;
    private List<ParkingActivityLog> recentActivities;

    public DashboardStatsDTO() {}

    public static class DailyRevenuePoint {
        private String date;
        private double revenue;
        private long vehicleCount;

        public DailyRevenuePoint(String date, double revenue, long vehicleCount) {
            this.date = date;
            this.revenue = revenue;
            this.vehicleCount = vehicleCount;
        }

        public String getDate() {
            return date;
        }

        public double getRevenue() {
            return revenue;
        }

        public long getVehicleCount() {
            return vehicleCount;
        }
    }

    // Getters and Setters

    public long getTotalSlots() {
        return totalSlots;
    }

    public void setTotalSlots(long totalSlots) {
        this.totalSlots = totalSlots;
    }

    public long getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(long availableSlots) {
        this.availableSlots = availableSlots;
    }

    public long getOccupiedSlots() {
        return occupiedSlots;
    }

    public void setOccupiedSlots(long occupiedSlots) {
        this.occupiedSlots = occupiedSlots;
    }

    public long getVehiclesParkedToday() {
        return vehiclesParkedToday;
    }

    public void setVehiclesParkedToday(long vehiclesParkedToday) {
        this.vehiclesParkedToday = vehiclesParkedToday;
    }

    public long getActiveSessions() {
        return activeSessions;
    }

    public void setActiveSessions(long activeSessions) {
        this.activeSessions = activeSessions;
    }

    public double getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(double todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getOccupancyRatePercentage() {
        return occupancyRatePercentage;
    }

    public void setOccupancyRatePercentage(double occupancyRatePercentage) {
        this.occupancyRatePercentage = occupancyRatePercentage;
    }

    public Map<String, Long> getVehicleTypeDistribution() {
        return vehicleTypeDistribution;
    }

    public void setVehicleTypeDistribution(Map<String, Long> vehicleTypeDistribution) {
        this.vehicleTypeDistribution = vehicleTypeDistribution;
    }

    public Map<String, Double> getPaymentMethodRevenue() {
        return paymentMethodRevenue;
    }

    public void setPaymentMethodRevenue(Map<String, Double> paymentMethodRevenue) {
        this.paymentMethodRevenue = paymentMethodRevenue;
    }

    public List<DailyRevenuePoint> getWeeklyRevenue() {
        return weeklyRevenue;
    }

    public void setWeeklyRevenue(List<DailyRevenuePoint> weeklyRevenue) {
        this.weeklyRevenue = weeklyRevenue;
    }

    public List<ParkingActivityLog> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<ParkingActivityLog> recentActivities) {
        this.recentActivities = recentActivities;
    }
}
