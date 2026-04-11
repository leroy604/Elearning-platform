package com.elearning.course_service.service;

import com.elearning.course_service.dto.CreateEnrollmentRequest;
import com.elearning.course_service.dto.EnrollmentDTO;
import com.elearning.course_service.entity.EnrollmentEntity;
import com.elearning.course_service.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseService courseService;

    public EnrollmentDTO enrollStudent(CreateEnrollmentRequest request) {
        courseService.getCourseById(request.getCourseId());

        EnrollmentEntity enrollment = new EnrollmentEntity();
        enrollment.setUserId(request.getUserId());
        enrollment.setCourseId(request.getCourseId());
        enrollment.setEnrolledAt(LocalDateTime.now());
        enrollment.setStatus("PENDING");

        EnrollmentEntity saved = enrollmentRepository.save(enrollment);
        return toDto(saved);
    }

    public List<EnrollmentDTO> getEnrollmentsByUser(Long userId) {
        return enrollmentRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public EnrollmentDTO updateEnrollmentStatus(Long id, String status) {
        EnrollmentEntity enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        enrollment.setStatus(status);
        EnrollmentEntity saved = enrollmentRepository.save(enrollment);
        return toDto(saved);
    }

    private EnrollmentDTO toDto(EnrollmentEntity entity) {
        return EnrollmentDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .courseId(entity.getCourseId())
                .enrolledAt(entity.getEnrolledAt())
                .status(entity.getStatus())
                .build();
    }
}
