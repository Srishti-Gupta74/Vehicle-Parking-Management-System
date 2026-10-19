# Vehicle Parking Management System (VPMS)
### College Mini-Project for CSC2104: Object Oriented Programming in Java

A complete, full-stack, enterprise-grade web application engineered to solve real-world urban parking challenges while comprehensively demonstrating every core concept in the **CSC2104 Object Oriented Programming in Java** syllabus.

---

## 🌟 Quick Demonstration Links & Credentials

| Service | URL / Port | Status |
| :--- | :--- | :---: |
| **React Web Application** | **[http://localhost:5173](http://localhost:5173)** | **ONLINE** |
| **Spring Boot REST API** | **[http://localhost:8080/api](http://localhost:8080/api)** | **ONLINE** |
| **MySQL 8 Database** | `localhost:3306` (`vehicle_parking_management`) | **ONLINE** |

### Default Admin Credentials
- **Email:** `admin@parking.com`
- **Password:** `admin123`

---

## 🏛️ System Architecture

```
                  ┌──────────────────────────────────────────────┐
                  │          React 18 + TypeScript Client        │
                  │  (Tailwind CSS, Lucide Icons, Recharts)     │
                  └──────────────────────┬───────────────────────┘
                                         │ HTTP / REST API (JSON)
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │            Spring Boot 3.3.4 Backend         │
                  │  (REST Controllers, Spring Security Auth)    │
                  └──────────────────────┬───────────────────────┘
                                         │
                  ┌──────────────────────▼───────────────────────┐
                  │           Java OOP Business Core             │
                  │ ┌──────────────────────────────────────────┐ │
                  │ │ Domain Hierarchy: Vehicle -> Bike,Car... │ │
                  │ │ Multithreading: Monitors, RequestQueue   │ │
                  │ │ Collections, 2D Arrays & Recursion       │ │
                  │ │ File I/O: FileWriter & FileOutputStream │ │
                  │ └──────────────────────────────────────────┘ │
                  └──────────────────────┬───────────────────────┘
                                         │ Spring Data JPA / Hibernate
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │                 MySQL 8 RDBMS                │
                  │  (vehicles, slots, sessions, payments, logs) │
                  └──────────────────────────────────────────────┘
```

---

## 🚀 Key Features

1. **Executive Dashboard**: Real-time KPI counters (active parked vehicles, occupancy rate, today's revenue, available slots), interactive revenue graphs (Recharts), vehicle type distribution, and live activity feed.
2. **Interactive Visual Parking Lot**: Multi-floor visual parking grid showing Bike, Car, and Truck slots. Color-coded real-time status (Green = Available, Red = Occupied, Amber = Maintenance). Click any slot to view parked vehicle details or initiate quick checkout.
3. **Smart Vehicle Park (Check-in)**: Synchronized auto-slot allocation by vehicle type (`BIKE`, `CAR`, `TRUCK`) or floor preference. Generates an instant printable entry ticket (`TCK-...`).
4. **Checkout & Polymorphic Fee Engine**: Real-time duration and rate calculation using runtime polymorphism. Supports multiple payment methods (`UPI`, `CASH`, `CARD`) and generates official printable receipts (`REC-...`).
5. **Slot Management**: Add, toggle maintenance status, or remove parking slots dynamically with capacity updates.
6. **Vehicle Directory**: Comprehensive vehicle registry with search and parking history tracking.
7. **Audit & File Export (I/O)**:
   - Text report export via `FileWriter` / `FileReader` (`exports/parking_report.txt`).
   - Binary database backup via `FileOutputStream` / `FileInputStream` (`exports/parking_backup.dat`).
8. **Interactive OOP Viva Demonstrations**: Dedicated viva page allowing examiners to execute and inspect core OOP algorithms live in the browser.

---

## 📚 Complete CSC2104 Syllabus Coverage

| Syllabus Topic | VPMS Implementation & Location |
| :--- | :--- |
| **Inheritance & Abstraction** | `abstract class Vehicle` extended by `TwoWheeler` (`Bike`) and `FourWheeler` (`Car`, `Truck`). |
| **Runtime Polymorphism** | Dynamic method dispatch in `vehicle.calculateParkingFee(duration)` overridden by each vehicle subclass. |
| **Compile-Time Polymorphism** | Overloaded methods in `Vehicle.java`, `VehicleService.java`, and `ParkingLot.java`. |
| **Pass-by-Value Verification** | `ArgumentPassingDemo.java` proving primitives and object reference addresses are passed by value. |
| **Recursion** | `findAvailableSlotRecursively(...)` traversing the 2D parking matrix. |
| **Arrays (1D & 2D)** | `ParkingSlot[][] parkingGrid` representing the physical multi-floor lot. |
| **Static Nested & Inner Classes** | `ParkingLot.ParkingStatistics` (static) and `ParkingLot.SlotManager` (non-static inner). |
| **Encapsulation & Access Modifiers** | `private`, `protected`, `default`, and `public` fields with rigorous domain invariants. |
| **The `final` Keyword** | `static final` rates, `final` ticket formatting methods, and `final class ParkingTicket`. |
| **Garbage Collection & Lifecycle** | `GarbageCollectionDemo.java` demonstrating object unreachability and `System.gc()`. |
| **Interfaces** | `interface ParkingFeeCalculator` with Java 8+ default methods and `interface PrintableReceipt`. |
| **Custom Exception Handling** | `ParkingLotFullException`, `SlotUnavailableException`, and `@RestControllerAdvice` global interceptor. |
| **Multithreading & Synchronization** | `Thread` subclassing, `Runnable`, `synchronized` slot allocation, and `wait()`/`notifyAll()`. |
| **File I/O (Character & Byte)** | `FileWriter`, `FileReader`, `BufferedReader`, `FileOutputStream`, and `FileInputStream`. |
| **Console I/O** | `Scanner` and `BufferedReader` interactive CLI in `ConsoleParkingDemo.java`. |

> 📖 **For exhaustive academic explanations and line-by-line file mappings, read [OOP_CONCEPTS.md](file:///C:/Users/Asus/.gemini/antigravity/scratch/vehicle-parking-management/OOP_CONCEPTS.md).**

---

## 🛠️ Technology Stack & Requirements

- **Backend**: Java 21, Spring Boot 3.3.4, Spring Data JPA, Hibernate, Maven 3.9.9
- **Frontend**: React 18, TypeScript 5, Vite 5/6, Tailwind CSS, Lucide React, Recharts
- **Database**: MySQL 8.0+
- **Build Tools**: Apache Maven 3.9.9, Node.js v18+ & npm

---

## 💻 How to Run the Application

### 1. Database Setup
```sql
-- Open MySQL Workbench or MySQL CLI:
CREATE DATABASE vehicle_parking_management;
-- Execute schema and seed:
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

### 2. Start the Spring Boot Backend
```powershell
cd backend
mvn spring-boot:run
# Server starts at http://localhost:8080
```

### 3. Start the React Frontend
```powershell
cd frontend
npm install
npm run dev
# Vite client starts at http://localhost:5173
```

### 4. Run Automated End-to-End Verification
```powershell
# In the project root directory:
powershell -ExecutionPolicy Bypass -File .\test_endpoints.ps1
```

---

## 🔌 REST API Endpoints Catalog

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate admin user |
| `GET` | `/api/dashboard` | Fetch dashboard KPI counts and charts data |
| `GET` | `/api/slots` | Fetch all parking slots with live occupancy |
| `POST` | `/api/slots` | Create a new parking slot |
| `PUT` | `/api/slots/{id}/status` | Toggle slot status (AVAILABLE / MAINTENANCE) |
| `DELETE` | `/api/slots/{id}` | Delete a parking slot |
| `POST` | `/api/parking/park` | Park vehicle & generate entry ticket |
| `GET` | `/api/parking/estimate/{vehNo}` | Estimate parking duration and fee |
| `POST` | `/api/parking/checkout` | Process payment, vacate slot & generate receipt |
| `GET` | `/api/parking/active` | Get all currently parked vehicles |
| `GET` | `/api/parking/history` | Query historical parking sessions with filters |
| `GET` | `/api/parking/ticket/{id}` | Retrieve formatted entry ticket object |
| `GET` | `/api/parking/receipt/{id}` | Retrieve formatted payment receipt object |
| `GET` | `/api/reports` | Get revenue and session summary statistics |
| `GET` | `/api/reports/export?type=txt` | Export human-readable report via `FileWriter` |
| `GET` | `/api/reports/export?type=backup` | Export binary backup via `FileOutputStream` |
| `GET` | `/api/demo/{concept}` | Execute live OOP viva demonstration (`argument-passing`, `recursion`, `gc`, `threads`, `nested-classes`) |

---

## 🎯 Step-by-Step Viva Presentation Script

1. **Login & Overview (1 min)**:
   - Navigate to `http://localhost:5173`.
   - Log in using `admin@parking.com` / `admin123`.
   - Present the Dashboard: Highlight live metrics, Recharts weekly revenue graphs, and vehicle distribution charts.
2. **Interactive Parking Lot Grid (1.5 mins)**:
   - Open the **Parking Lot** tab.
   - Explain the 2D array data structure (`ParkingSlot[][] parkingGrid`) mapping floors and slot indices.
   - Demonstrate filtering slots by floor and vehicle type.
3. **Park a Vehicle & Demonstrate Synchronization (2 mins)**:
   - Click **Park Vehicle**.
   - Park a Car with license number `KA-01-VIVA-2024`.
   - Explain how `assignSlotSynchronized` prevents race conditions if multiple vehicles enter simultaneously.
   - Show the generated Entry Ticket modal.
4. **Polymorphic Checkout & Printable Receipt (2 mins)**:
   - Navigate to **Checkout**.
   - Search for `KA-01-VIVA-2024`.
   - Show how the estimated fee dynamically calls `Car.calculateParkingFee()` via runtime polymorphism.
   - Complete payment with UPI.
   - Show the generated Official Receipt modal and explain interface `PrintableReceipt`.
5. **File I/O Verification (1.5 mins)**:
   - Go to **Reports** page.
   - Click **Export Report** (demonstrating `FileWriter` / `FileReader`).
   - Click **Export Backup** (demonstrating `FileOutputStream` / `FileInputStream`).
   - Open the `exports/` folder to show the examiner the actual created files.
6. **OOP Viva Demos Page (2 mins)**:
   - Open the **Viva Demos** tab in the sidebar.
   - Click on each tab:
     - **Pass-by-Value**: Walk the examiner through the proof output.
     - **Recursion**: Show the recursive grid search stack execution.
     - **Multithreading**: Show thread lifecycles and monitor priorities.
     - **Nested Classes**: Contrast static nested vs inner classes.
     - **Garbage Collection**: Explain reference eligibility and JVM memory management.
