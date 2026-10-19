package com.parking.management.controller;

import com.parking.management.dto.ReportDTO;
import com.parking.management.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<ReportDTO> getReportSummary() {
        return ResponseEntity.ok(reportService.getReportSummary());
    }

    @GetMapping("/export")
    public ResponseEntity<Resource> exportReport(@RequestParam(defaultValue = "txt") String type) throws IOException {
        File generatedFile;
        MediaType mediaType;

        if ("backup".equalsIgnoreCase(type) || "dat".equalsIgnoreCase(type)) {
            generatedFile = reportService.generateBinaryBackup();
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        } else {
            // Generates exports/parking_history.txt and exports/parking_report.txt
            generatedFile = reportService.generateAndExportTextReport();
            mediaType = MediaType.TEXT_PLAIN;
        }

        Resource resource = new FileSystemResource(generatedFile);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + generatedFile.getName() + "\"")
                .contentType(mediaType)
                .contentLength(generatedFile.length())
                .body(resource);
    }
}
