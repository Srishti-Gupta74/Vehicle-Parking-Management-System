package com.parking.management.controller;

import com.parking.management.demo.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Controller exposing endpoints to trigger and inspect CSC2104 OOP viva demonstrations.
 */
@RestController
@RequestMapping("/api/demo")
@CrossOrigin(origins = "*")
public class DemoController {

    @GetMapping("/argument-passing")
    public ResponseEntity<Map<String, String>> runArgumentPassingDemo() {
        String result = ArgumentPassingDemo.executeAndCapture();
        return ResponseEntity.ok(Map.of("concept", "Java Pass-by-Value", "output", result));
    }

    @GetMapping("/recursion")
    public ResponseEntity<Map<String, String>> runRecursionDemo() {
        String result = RecursionDemo.executeAndCapture();
        return ResponseEntity.ok(Map.of("concept", "Recursive Grid Traversal", "output", result));
    }

    @GetMapping("/gc")
    public ResponseEntity<Map<String, String>> runGarbageCollectionDemo() {
        String result = GarbageCollectionDemo.executeAndCapture();
        return ResponseEntity.ok(Map.of("concept", "Garbage Collection & Lifecycle", "output", result));
    }

    @GetMapping("/nested-classes")
    public ResponseEntity<Map<String, String>> runNestedClassDemo() {
        String result = NestedClassDemo.executeAndCapture();
        return ResponseEntity.ok(Map.of("concept", "Static Nested vs Non-static Inner Class", "output", result));
    }

    @GetMapping("/threads")
    public ResponseEntity<Map<String, String>> runThreadDemo() {
        String result = ThreadDemo.executeAndCapture();
        return ResponseEntity.ok(Map.of("concept", "Multithreading, Lifecycle & Synchronization", "output", result));
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, String>> runAllDemos() {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("argumentPassing", ArgumentPassingDemo.executeAndCapture());
        map.put("recursion", RecursionDemo.executeAndCapture());
        map.put("garbageCollection", GarbageCollectionDemo.executeAndCapture());
        map.put("nestedClasses", NestedClassDemo.executeAndCapture());
        map.put("multithreading", ThreadDemo.executeAndCapture());
        return ResponseEntity.ok(map);
    }
}
