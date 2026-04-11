package com.elearning.course_service.controller;

import com.elearning.course_service.dto.CreateEnrollmentRequest;
import com.elearning.course_service.dto.EnrollmentDTO;
import com.elearning.course_service.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<EnrollmentDTO> enrollStudent(@RequestBody CreateEnrollmentRequest request) {
        EnrollmentDTO enrollment = enrollmentService.enrollStudent(request);
        return new ResponseEntity<>(enrollment, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EnrollmentDTO>> getEnrollmentsByUser(@PathVariable Long userId) {
        List<EnrollmentDTO> enrollments = enrollmentService.getEnrollmentsByUser(userId);
        return ResponseEntity.ok(enrollments);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<EnrollmentDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        EnrollmentDTO enrollment = enrollmentService.updateEnrollmentStatus(id, status);
        return ResponseEntity.ok(enrollment);
    }
}
