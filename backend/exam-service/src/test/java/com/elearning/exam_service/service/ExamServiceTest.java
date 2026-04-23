package com.elearning.exam_service.service;

import com.elearning.exam_service.dto.CreateExamRequest;
import com.elearning.exam_service.dto.ExamDTO;
import com.elearning.exam_service.dto.ExamResultDTO;
import com.elearning.exam_service.dto.SubmitExamRequest;
import com.elearning.exam_service.entity.ExamEntity;
import com.elearning.exam_service.entity.QuestionEntity;
import com.elearning.exam_service.repository.ExamRepository;
import com.elearning.exam_service.repository.QuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExamServiceTest {

    @Mock
    private ExamRepository examRepository;

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private ExamService examService;

    private CreateExamRequest createRequest;
    private ExamEntity examEntity;
    private List<QuestionEntity> questionEntities;

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

        // Create 4 questions — correct answer index is 0 for all
        questionEntities = new ArrayList<>();
        for (int i = 1; i <= 4; i++) {
            QuestionEntity q = new QuestionEntity();
            q.setId((long) i);
            q.setExamId(1L);
            q.setContent("Question " + i);
            q.setOptions(Arrays.asList("Option A", "Option B", "Option C"));
            q.setCorrectAnswerIndex(0);
            questionEntities.add(q);
        }
    }

    @Test
    void createExam_ShouldReturnExamDTO() {
        when(examRepository.save(any(ExamEntity.class))).thenReturn(examEntity);

        ExamDTO result = examService.createExam(createRequest);

        assertNotNull(result);
        assertEquals("Final Exam", result.getTitle());
        assertEquals(10, result.getTotalQuestions());
        assertEquals(80, result.getPassingScore());
        verify(examRepository, times(1)).save(any(ExamEntity.class));
    }

    @Test
    void getExamById_ShouldReturnExamDTO_WhenExists() {
        when(examRepository.findById(1L)).thenReturn(Optional.of(examEntity));

        ExamDTO result = examService.getExamById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Final Exam", result.getTitle());
    }

    @Test
    void getExamById_ShouldThrowException_WhenNotExists() {
        when(examRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> examService.getExamById(99L));
    }

    @Test
    void deleteExam_ShouldCallRepository_WhenExists() {
        when(examRepository.existsById(1L)).thenReturn(true);

        examService.deleteExam(1L);

        verify(examRepository, times(1)).deleteById(1L);
    }

    // ==================== GRADE CALCULATION TESTS ====================

    @Test
    void submitExam_ShouldCalculatePassingGrade_WhenAllAnswersCorrect() {
        // Arrange — all 4 answers correct (index 0)
        Map<Long, Integer> answers = new HashMap<>();
        answers.put(1L, 0);
        answers.put(2L, 0);
        answers.put(3L, 0);
        answers.put(4L, 0);

        SubmitExamRequest request = new SubmitExamRequest();
        request.setAnswers(answers);

        when(examRepository.findById(1L)).thenReturn(Optional.of(examEntity));
        when(questionRepository.findByExamId(1L)).thenReturn(questionEntities);

        // Act
        ExamResultDTO result = examService.submitExam(1L, request);

        // Assert — 4/4 correct = 100%, threshold is 80% ? PASSED
        assertEquals(4, result.getTotalQuestions());
        assertEquals(4, result.getCorrectAnswers());
        assertEquals(100, result.getScorePercentage());
        assertTrue(result.isPassed());
    }

    @Test
    void submitExam_ShouldCalculateFailingGrade_WhenBelowPassingScore() {
        // Arrange — only 2 out of 4 correct (50%)
        Map<Long, Integer> answers = new HashMap<>();
        answers.put(1L, 0); // correct
        answers.put(2L, 0); // correct
        answers.put(3L, 1); // wrong
        answers.put(4L, 1); // wrong

        SubmitExamRequest request = new SubmitExamRequest();
        request.setAnswers(answers);

        when(examRepository.findById(1L)).thenReturn(Optional.of(examEntity));
        when(questionRepository.findByExamId(1L)).thenReturn(questionEntities);

        // Act
        ExamResultDTO result = examService.submitExam(1L, request);

        // Assert — 2/4 = 50%, threshold is 80% ? FAILED
        assertEquals(4, result.getTotalQuestions());
        assertEquals(2, result.getCorrectAnswers());
        assertEquals(50, result.getScorePercentage());
        assertFalse(result.isPassed());
    }
}
