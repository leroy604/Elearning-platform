package com.elearning.exam_service.repository;

import com.elearning.exam_service.entity.ExamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<ExamEntity, Long> {
    
    List<ExamEntity> findByCourseId(Long courseId);
    
    Optional<ExamEntity> findByIdAndCourseId(Long id, Long courseId);
    
    boolean existsByIdAndCourseId(Long id, Long courseId);
}
