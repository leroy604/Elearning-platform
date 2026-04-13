package com.elearning.exam_service.service;

import com.elearning.exam_service.dto.CreateExamRequest;
import com.elearning.exam_service.dto.ExamDTO;
import com.elearning.exam_service.entity.ExamEntity;
import com.elearning.exam_service.repository.ExamRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExamServiceTest {

    @Mock
    private ExamRepository examRepository;

    @InjectMocks
    private ExamService examService;

    private CreateExamRequest createRequest;
    private ExamEntity examEntity;

    @BeforeEach
    void setUp() {
        createRequest = new CreateExamRequest();
        createRequest.setTitle("Final Exam");
        createRequest.setDescription("Test Description");
        createRequest.setDuration(60);
        createRequest.setTotalQuestions(10);
        createRequest.setPassingScore(80);
        createRequest.setCourseId(1L);

        examEntity = new ExamEntity();
        examEntity.setId(1L);
        examEntity.setTitle("Final Exam");
        examEntity.setDescription("Test Description");
        examEntity.setDuration(60);
        examEntity.setTotalQuestions(10);
        examEntity.setPassingScore(80);
        examEntity.setCourseId(1L);
        examEntity.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createExam_ShouldReturnExamDTO() {
        // Arrange
        when(examRepository.save(any(ExamEntity.class))).thenReturn(examEntity);

        // Act
        ExamDTO result = examService.createExam(createRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Final Exam", result.getTitle());
        assertEquals(10, result.getTotalQuestions());
        assertEquals(80, result.getPassingScore());
        verify(examRepository, times(1)).save(any(ExamEntity.class));
    }

    @Test
    void getExamById_ShouldReturnExamDTO_WhenExists() {
        // Arrange
        when(examRepository.findById(1L)).thenReturn(Optional.of(examEntity));

        // Act
        ExamDTO result = examService.getExamById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Final Exam", result.getTitle());
    }

    @Test
    void getExamById_ShouldThrowException_WhenNotExists() {
        // Arrange
        when(examRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> examService.getExamById(99L));
    }

    @Test
    void deleteExam_ShouldCallRepository_WhenExists() {
        // Arrange
        when(examRepository.existsById(1L)).thenReturn(true);

        // Act
        examService.deleteExam(1L);

        // Assert
        verify(examRepository, times(1)).deleteById(1L);
    }
}
