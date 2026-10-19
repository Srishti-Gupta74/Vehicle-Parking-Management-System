package com.parking.management.service;

import com.parking.management.dto.ReportDTO;
import com.parking.management.io.ParkingBackupManager;
import com.parking.management.io.ParkingReportWriter;
import com.parking.management.model.ParkingSession;
import com.parking.management.model.SessionStatus;
import com.parking.management.model.SlotStatus;
import com.parking.management.repository.ParkingSessionRepository;
import com.parking.management.repository.ParkingSlotRepository;
import com.parking.management.repository.PaymentRepository;
import com.parking.management.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ReportService {

    private final ParkingSessionRepository sessionRepository;
    private final ParkingSlotRepository slotRepository;
    private final PaymentRepository paymentRepository;
    private final VehicleRepository vehicleRepository;
    private final ParkingReportWriter reportWriter;
    private final ParkingBackupManager backupManager;

    @Autowired
    public ReportService(ParkingSessionRepository sessionRepository,
                         ParkingSlotRepository slotRepository,
                         PaymentRepository paymentRepository,
                         VehicleRepository vehicleRepository,
                         ParkingReportWriter reportWriter,
                         ParkingBackupManager backupManager) {
        this.sessionRepository = sessionRepository;
        this.slotRepository = slotRepository;
        this.paymentRepository = paymentRepository;
        this.vehicleRepository = vehicleRepository;
        this.reportWriter = reportWriter;
        this.backupManager = backupManager;
    }

    public ReportDTO getReportSummary() {
        ReportDTO dto = new ReportDTO();

        long totalVehicles = vehicleRepository.count();
        long totalSessions = sessionRepository.count();
        long activeSessions = sessionRepository.countByStatus(SessionStatus.ACTIVE);
        long completedSessions = sessionRepository.countByStatus(SessionStatus.COMPLETED);
        Double totalRevenue = paymentRepository.sumTotalRevenue();

        long totalSlots = slotRepository.count();
        long occupiedSlots = slotRepository.countByStatus(SlotStatus.OCCUPIED);
        double occupancyRate = (totalSlots > 0) ? ((double) occupiedSlots / totalSlots) * 100.0 : 0.0;

        dto.setTotalVehicles(totalVehicles);
        dto.setTotalSessions(totalSessions);
        dto.setActiveSessions(activeSessions);
        dto.setCompletedSessions(completedSessions);
        dto.setTotalRevenue(totalRevenue != null ? totalRevenue : 0.0);
        dto.setOccupancyRate(Math.round(occupancyRate * 100.0) / 100.0);

        List<ParkingSession> allSessions = sessionRepository.findAll();
        double sumFee = 0;
        long sumHours = 0;
        int completedCount = 0;

        Map<String, Long> countByType = new LinkedHashMap<>();
        Map<String, Double> revByType = new LinkedHashMap<>();
        countByType.put("BIKE", 0L);
        countByType.put("CAR", 0L);
        countByType.put("TRUCK", 0L);
        revByType.put("BIKE", 0.0);
        revByType.put("CAR", 0.0);
        revByType.put("TRUCK", 0.0);

        for (ParkingSession s : allSessions) {
            String type = s.getVehicle().getVehicleType();
            countByType.put(type, countByType.getOrDefault(type, 0L) + 1);

            if (s.getStatus() == SessionStatus.COMPLETED && s.getParkingFee() != null) {
                sumFee += s.getParkingFee();
                if (s.getDuration() != null) {
                    sumHours += s.getDuration();
                }
                completedCount++;
                revByType.put(type, revByType.getOrDefault(type, 0.0) + s.getParkingFee());
            }
        }

        dto.setVehicleCountsByType(countByType);
        dto.setRevenueByType(revByType);

        dto.setAverageFee(completedCount > 0 ? Math.round((sumFee / completedCount) * 100.0) / 100.0 : 0.0);
        dto.setAverageDurationHours(completedCount > 0 ? Math.round(((double) sumHours / completedCount) * 10.0) / 10.0 : 0.0);

        // Payment method breakdown
        Map<String, Long> payMethods = new LinkedHashMap<>();
        List<Object[]> payMethodRows = paymentRepository.getRevenueByPaymentMethod();
        for (Object[] row : payMethodRows) {
            String method = row[0].toString();
            Long count = (Long) row[1];
            payMethods.put(method, count);
        }
        dto.setSessionsByPaymentMethod(payMethods);

        dto.setExportFilesAvailable(Arrays.asList("parking_history.txt", "parking_report.txt", "parking_backup.dat"));
        return dto;
    }

    /**
     * Generates a real text report on the filesystem using FileWriter.
     */
    public File generateAndExportTextReport() throws IOException {
        List<ParkingSession> sessions = sessionRepository.findAllSessionsOrdered();
        // Generates exports/parking_history.txt
        File historyFile = reportWriter.exportParkingHistory(sessions);

        // Also generate exports/parking_report.txt
        ReportDTO summary = getReportSummary();
        StringBuilder sb = new StringBuilder();
        sb.append("=================================================================\n");
        sb.append("         VPMS STATISTICAL SUMMARY & AUDIT REPORT                 \n");
        sb.append("         Generated: ").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
        sb.append("=================================================================\n\n");
        sb.append("Total Registered Vehicles: ").append(summary.getTotalVehicles()).append("\n");
        sb.append("Total Sessions Recorded  : ").append(summary.getTotalSessions()).append("\n");
        sb.append("Active Sessions          : ").append(summary.getActiveSessions()).append("\n");
        sb.append("Completed Sessions       : ").append(summary.getCompletedSessions()).append("\n");
        sb.append(String.format("Total Revenue Collected  : ₹%.2f\n", summary.getTotalRevenue()));
        sb.append(String.format("Average Fee Per Session  : ₹%.2f\n", summary.getAverageFee()));
        sb.append(String.format("Average Duration (Hours) : %.1f hrs\n", summary.getAverageDurationHours()));
        sb.append(String.format("Current Occupancy Rate   : %.2f%%\n\n", summary.getOccupancyRate()));
        sb.append("Revenue Breakdown by Vehicle Type:\n");
        for (Map.Entry<String, Double> entry : summary.getRevenueByType().entrySet()) {
            sb.append(String.format("  - %-6s: ₹%.2f\n", entry.getKey(), entry.getValue()));
        }
        sb.append("\n=================================================================\n");

        reportWriter.exportStatisticalReport(sb.toString());

        // Also generate exports/parking_backup.dat using FileOutputStream
        backupManager.createBinaryBackup(sb.toString());

        return historyFile;
    }

    /**
     * Generates binary backup file using FileOutputStream and returns it.
     */
    public File generateBinaryBackup() throws IOException {
        ReportDTO summary = getReportSummary();
        String snapshot = "SNAPSHOT_" + System.currentTimeMillis() + "|TOTAL_REVENUE=" + summary.getTotalRevenue() +
                "|TOTAL_SESSIONS=" + summary.getTotalSessions();
        return backupManager.createBinaryBackup(snapshot);
    }
}
