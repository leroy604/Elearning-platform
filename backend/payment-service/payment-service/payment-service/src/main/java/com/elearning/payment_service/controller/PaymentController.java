package com.elearning.payment_service.controller;

import com.elearning.payment_service.client.EnrollmentClient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    private final EnrollmentClient enrollmentClient;

    @PostMapping("/simulate")
    public ResponseEntity<?> simulatePayment(@RequestBody PaymentSimulationRequest request) {
        log.info("Simulating payment for enrollment ID: {}", request.getEnrollmentId());
        
        // Simulate a small delay for "processing"
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Call course-service to update enrollment status
        try {
            enrollmentClient.updateStatus(request.getEnrollmentId(), "COMPLETED");
            log.info("Payment simulation successful. Enrollment {} status updated to COMPLETED", request.getEnrollmentId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment processed successfully"
            ));
        } catch (Exception e) {
            log.error("Failed to update enrollment status", e);
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Payment simulation failed to update enrollment status: " + e.getMessage()
            ));
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentSimulationRequest {
        private Long enrollmentId;
        private String cardNumber;
        private String expiryDate;
        private String cvv;
        private String cardHolderName;
    }
}
