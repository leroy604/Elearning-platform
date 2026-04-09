package com.elearning.course_service.repository;

import com.elearning.course_service.entity.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<CourseEntity, Long> {

    List<CourseEntity> findByInstructorId(Long instructorId);

    List<CourseEntity> findByCategory(String category);

    List<CourseEntity> findByLevel(String level);

    List<CourseEntity> findByInstructorIdAndCategory(Long instructorId, String category);

    Optional<CourseEntity> findByIdAndInstructorId(Long id, Long instructorId);

    boolean existsByIdAndInstructorId(Long id, Long instructorId);
}
