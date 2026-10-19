package com.parking.management.service;

import com.parking.management.dto.DashboardStatsDTO;
import com.parking.management.model.SlotStatus;
import com.parking.management.model.SlotType;
import com.parking.management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DashboardService {

    private final ParkingSlotRepository slotRepository;
    private final ParkingSessionRepository sessionRepository;
    private final PaymentRepository paymentRepository;
    private final ParkingActivityLogRepository activityLogRepository;
    private final VehicleRepository vehicleRepository;

    @Autowired
    public DashboardService(ParkingSlotRepository slotRepository,
                            ParkingSessionRepository sessionRepository,
                            PaymentRepository paymentRepository,
                            ParkingActivityLogRepository activityLogRepository,
                            VehicleRepository vehicleRepository) {
        this.slotRepository = slotRepository;
        this.sessionRepository = sessionRepository;
        this.paymentRepository = paymentRepository;
        this.activityLogRepository = activityLogRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO dto = new DashboardStatsDTO();

        long totalSlots = slotRepository.count();
        long availableSlots = slotRepository.countByStatus(SlotStatus.AVAILABLE);
        long occupiedSlots = slotRepository.countByStatus(SlotStatus.OCCUPIED);

        dto.setTotalSlots(totalSlots);
        dto.setAvailableSlots(availableSlots);
        dto.setOccupiedSlots(occupiedSlots);

        double occupancyRate = (totalSlots > 0) ? ((double) occupiedSlots / totalSlots) * 100.0 : 0.0;
        dto.setOccupancyRatePercentage(Math.round(occupancyRate * 100.0) / 100.0);

        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime todayEnd = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        dto.setVehiclesParkedToday(sessionRepository.countByEntryTimeBetween(todayStart, todayEnd));
        dto.setActiveSessions(sessionRepository.countByStatus(com.parking.management.model.SessionStatus.ACTIVE));

        Double todayRev = paymentRepository.sumRevenueBetween(todayStart, todayEnd);
        dto.setTodayRevenue(todayRev != null ? todayRev : 0.0);

        Double totalRev = paymentRepository.sumTotalRevenue();
        dto.setTotalRevenue(totalRev != null ? totalRev : 0.0);

        // Vehicle distribution
        Map<String, Long> vehicleDist = new LinkedHashMap<>();
        vehicleDist.put("BIKE", slotRepository.countBySlotType(SlotType.BIKE));
        vehicleDist.put("CAR", slotRepository.countBySlotType(SlotType.CAR));
        vehicleDist.put("TRUCK", slotRepository.countBySlotType(SlotType.TRUCK));
        dto.setVehicleTypeDistribution(vehicleDist);

        // Payment method breakdown
        Map<String, Double> paymentDist = new LinkedHashMap<>();
        List<Object[]> payMethodRows = paymentRepository.getRevenueByPaymentMethod();
        for (Object[] row : payMethodRows) {
            String method = row[0].toString();
            Double amount = (Double) row[2];
            paymentDist.put(method, amount != null ? amount : 0.0);
        }
        // Ensure default keys exist
        paymentDist.putIfAbsent("CASH", 0.0);
        paymentDist.putIfAbsent("UPI", 0.0);
        paymentDist.putIfAbsent("CARD", 0.0);
        dto.setPaymentMethodRevenue(paymentDist);

        // 7-day revenue points
        List<DashboardStatsDTO.DailyRevenuePoint> weekly = new ArrayList<>();
        DateTimeFormatter df = DateTimeFormatter.ofPattern("MMM dd");
        for (int i = 6; i >= 0; i--) {
            LocalDate day = LocalDate.now().minusDays(i);
            LocalDateTime dayStart = LocalDateTime.of(day, LocalTime.MIN);
            LocalDateTime dayEnd = LocalDateTime.of(day, LocalTime.MAX);
            Double rev = paymentRepository.sumRevenueBetween(dayStart, dayEnd);
            long count = sessionRepository.countByEntryTimeBetween(dayStart, dayEnd);
            weekly.add(new DashboardStatsDTO.DailyRevenuePoint(day.format(df), rev != null ? rev : 0.0, count));
        }
        dto.setWeeklyRevenue(weekly);

        // Recent activity logs
        dto.setRecentActivities(activityLogRepository.findTop15ByOrderByTimestampDesc());

        return dto;
    }
}
