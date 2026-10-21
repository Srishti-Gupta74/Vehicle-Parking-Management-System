package com.parking.management.io;

import com.parking.management.model.ParkingSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * File I/O handler using character streams (FileWriter, FileReader, BufferedReader).
 *
 * Demonstrates the following CSC2104 OOP Syllabus Concepts:
 * 1. File Handling using FileWriter (Writing textual data)
 * 2. File Handling using FileReader and BufferedReader (Reading textual data line-by-line)
 * 3. Checked Exceptions (IOException) handling with try-with-resources and throws
 * 4. Resource cleanup and defensive directory creation
 */
@Component
public class ParkingReportWriter {

    private static final Logger logger = LoggerFactory.getLogger(ParkingReportWriter.class);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Value("${app.exports.dir:./exports}")
    private String exportsDir;

    private void ensureExportsDirectoryExists() {
        File dir = new File(exportsDir);
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            logger.info("Created exports directory: {} (success: {})", dir.getAbsolutePath(), created);
        }
    }

    /**
     * Writes all parking sessions to a text file using FileWriter and BufferedWriter.
     *
     * @param sessions list of parking sessions
     * @return the generated File object
     * @throws IOException if a file write error occurs
     */
    public File exportParkingHistory(List<ParkingSession> sessions) throws IOException {
        ensureExportsDirectoryExists();
        File targetFile = new File(exportsDir, "parking_history.txt");

        // =========================================================================
        // CSC2104 OOP CONCEPT: CHARACTER STREAMS & try-with-resources
        // Uses FileWriter + BufferedWriter to write character/textual stream data.
        // try-with-resources ensures streams auto-close, avoiding memory leaks.
        // =========================================================================
        try (FileWriter fw = new FileWriter(targetFile, false);
             BufferedWriter bw = new BufferedWriter(fw)) {

            bw.write("========================================================================================\n");
            bw.write("                         VEHICLE PARKING MANAGEMENT SYSTEM                              \n");
            bw.write("                                PARKING HISTORY AUDIT                                   \n");
            bw.write("                   Generated: " + LocalDateTime.now().format(FORMATTER) + "            \n");
            bw.write("========================================================================================\n");
            bw.write(String.format("%-6s | %-14s | %-8s | %-6s | %-19s | %-19s | %-8s | %-10s | %-10s\n",
                    "ID", "VEHICLE NO", "TYPE", "SLOT", "ENTRY TIME", "EXIT TIME", "HRS", "FEE (₹)", "STATUS"));
            bw.write("----------------------------------------------------------------------------------------\n");

            if (sessions != null) {
                for (ParkingSession s : sessions) {
                    String exitStr = s.getExitTime() != null ? s.getExitTime().format(FORMATTER) : "ACTIVE";
                    String feeStr = s.getParkingFee() != null ? String.format("%.2f", s.getParkingFee()) : "0.00";
                    long duration = s.getDuration() != null ? s.getDuration() : 0L;

                    bw.write(String.format("%-6d | %-14s | %-8s | %-6s | %-19s | %-19s | %-8d | %-10s | %-10s\n",
                            s.getSessionId(),
                            s.getVehicle() != null ? s.getVehicle().getVehicleNumber() : "N/A",
                            s.getVehicle() != null ? s.getVehicle().getVehicleType() : "N/A",
                            s.getSlot() != null ? s.getSlot().getSlotNumber() : "N/A",
                            s.getEntryTime().format(FORMATTER),
                            exitStr,
                            duration,
                            feeStr,
                            s.getStatus()));
                }
            }

            bw.write("========================================================================================\n");
            bw.write("                         END OF PARKING AUDIT REPORT                                    \n");
            bw.write("========================================================================================\n");
            bw.flush();
        }

        logger.info("Successfully exported parking history to {}", targetFile.getAbsolutePath());
        return targetFile;
    }

    /**
     * Exports a comprehensive statistical summary report.
     */
    public File exportStatisticalReport(String reportContent) throws IOException {
        ensureExportsDirectoryExists();
        File targetFile = new File(exportsDir, "parking_report.txt");

        try (FileWriter fw = new FileWriter(targetFile, false);
             BufferedWriter bw = new BufferedWriter(fw)) {
            bw.write(reportContent);
            bw.flush();
        }

        logger.info("Statistical report generated at {}", targetFile.getAbsolutePath());
        return targetFile;
    }

    /**
     * Reads back an exported report file using FileReader and BufferedReader.
     * Demonstrates FileReader / BufferedReader usage as required by the syllabus.
     */
    public String readReportFile(String fileName) throws IOException {
        File file = new File(exportsDir, fileName);
        if (!file.exists()) {
            throw new FileNotFoundException("Report file not found: " + fileName);
        }

        StringBuilder content = new StringBuilder();
        try (FileReader fr = new FileReader(file);
             BufferedReader br = new BufferedReader(fr)) {
            String line;
            while ((line = br.readLine()) != null) {
                content.append(line).append("\n");
            }
        }
        return content.toString();
    }
}
