package com.parking.management.io;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.charset.StandardCharsets;

/**
 * File I/O handler using byte streams (FileInputStream, FileOutputStream).
 *
 * Demonstrates the following CSC2104 OOP Syllabus Concepts:
 * 1. File Handling using FileOutputStream (Writing binary/raw byte streams)
 * 2. File Handling using FileInputStream (Reading raw byte streams into byte arrays)
 * 3. Buffered byte streams for I/O efficiency
 * 4. Checked Exception handling (FileNotFoundException, IOException)
 */
@Component
public class ParkingBackupManager {

    private static final Logger logger = LoggerFactory.getLogger(ParkingBackupManager.class);

    @Value("${app.exports.dir:./exports}")
    private String exportsDir;

    private void ensureExportsDirectoryExists() {
        File dir = new File(exportsDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    /**
     * Creates a binary backup file using FileOutputStream.
     *
     * @param backupData raw textual data or serialized snapshot
     * @return File pointer to the generated .dat file
     * @throws IOException on stream failure
     */
    public File createBinaryBackup(String backupData) throws IOException {
        ensureExportsDirectoryExists();
        File backupFile = new File(exportsDir, "parking_backup.dat");

        byte[] headerBytes = "VPMS_BACKUP_V1.0\n".getBytes(StandardCharsets.UTF_8);
        byte[] payloadBytes = backupData.getBytes(StandardCharsets.UTF_8);

        // =========================================================================
        // CSC2104 OOP CONCEPT: BYTE STREAMS (BINARY I/O)
        // Uses FileOutputStream + BufferedOutputStream for raw binary byte streams.
        // =========================================================================
        try (FileOutputStream fos = new FileOutputStream(backupFile, false);
             BufferedOutputStream bos = new BufferedOutputStream(fos)) {

            bos.write(headerBytes);
            bos.write(payloadBytes);
            bos.flush();
        }

        logger.info("Binary backup written to {} ({} bytes)", backupFile.getAbsolutePath(), backupFile.length());
        return backupFile;
    }

    /**
     * Reads a binary backup file using FileInputStream.
     * Demonstrates byte buffer allocation and stream reading.
     *
     * @param backupFileName name of the backup file
     * @return decoded String content
     * @throws IOException on read error
     */
    public String readBinaryBackup(String backupFileName) throws IOException {
        File backupFile = new File(exportsDir, backupFileName);
        if (!backupFile.exists()) {
            throw new FileNotFoundException("Binary backup file not found: " + backupFileName);
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // Demonstrates FileInputStream with BufferedInputStream
        try (FileInputStream fis = new FileInputStream(backupFile);
             BufferedInputStream bis = new BufferedInputStream(fis)) {

            byte[] buffer = new byte[1024];
            int bytesRead;
            // While loop reading chunks from FileInputStream
            while ((bytesRead = bis.read(buffer)) != -1) {
                baos.write(buffer, 0, bytesRead);
            }
        }

        return baos.toString(StandardCharsets.UTF_8);
    }
}
