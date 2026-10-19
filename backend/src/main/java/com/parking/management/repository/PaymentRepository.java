package com.parking.management.repository;

import com.parking.management.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findBySession_SessionId(Long sessionId);

    List<Payment> findAllByOrderByPaymentTimeDesc();

    @Query("SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p WHERE p.paymentStatus = 'PAID'")
    Double sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p WHERE p.paymentStatus = 'PAID' AND p.paymentTime BETWEEN :start AND :end")
    Double sumRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT p.paymentMethod, COUNT(p), COALESCE(SUM(p.amount), 0.0) FROM Payment p WHERE p.paymentStatus = 'PAID' GROUP BY p.paymentMethod")
    List<Object[]> getRevenueByPaymentMethod();
}
