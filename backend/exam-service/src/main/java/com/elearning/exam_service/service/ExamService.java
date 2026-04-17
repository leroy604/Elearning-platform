package com.elearning.exam_service.service;

import com.elearning.exam_service.dto.CreateExamRequest;
import com.elearning.exam_service.dto.ExamDTO;
import com.elearning.exam_service.dto.UpdateExamRequest;
import com.elearning.exam_service.entity.ExamEntity;
import com.elearning.exam_service.exception.ExamNotFoundException;
import com.elearning.exam_service.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import com.elearning.exam_service.dto.QuestionDTO;
import com.elearning.exam_service.dto.SubmitExamRequest;
import com.elearning.exam_service.dto.ExamResultDTO;
import com.elearning.exam_service.entity.QuestionEntity;
import com.elearning.exam_service.repository.QuestionRepository;

@Service
@Transactional
public class ExamService {
    
    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;
    
    public ExamDTO createExam(CreateExamRequest request) {
        ExamEntity exam = new ExamEntity();
        exam.setTitle(request.getTitle());
        exam.setDescription(request.getDescription());
        exam.setDuration(request.getDuration());
        exam.setTotalQuestions(request.getTotalQuestions());
        exam.setPassingScore(request.getPassingScore());
        exam.setCourseId(request.getCourseId());
        
        ExamEntity savedExam = examRepository.save(exam);
        return convertToDTO(savedExam);
    }
    
    public ExamDTO getExamById(Long examId) {
        ExamEntity exam = examRepository.findById(examId)
                .orElseThrow(() -> new ExamNotFoundException("Exam not found with ID: " + examId));
        return convertToDTO(exam);
    }
    
    public List<ExamDTO> getExamsByCourseId(Long courseId) {
        List<ExamEntity> exams = examRepository.findByCourseId(courseId);
        return exams.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ExamDTO updateExam(Long examId, UpdateExamRequest request) {
        ExamEntity exam = examRepository.findById(examId)
                .orElseThrow(() -> new ExamNotFoundException("Exam not found with ID: " + examId));
        
        if (request.getTitle() != null) {
            exam.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            exam.setDescription(request.getDescription());
        }
        if (request.getDuration() != null) {
            exam.setDuration(request.getDuration());
        }
        if (request.getTotalQuestions() != null) {
            exam.setTotalQuestions(request.getTotalQuestions());
        }
        if (request.getPassingScore() != null) {
            exam.setPassingScore(request.getPassingScore());
        }
        
        ExamEntity updatedExam = examRepository.save(exam);
        return convertToDTO(updatedExam);
    }
    
    public void deleteExam(Long examId) {
        if (!examRepository.existsById(examId)) {
            throw new ExamNotFoundException("Exam not found with ID: " + examId);
        }
        examRepository.deleteById(examId);
    }
    
    public List<ExamDTO> getAllExams() {
        List<ExamEntity> exams = examRepository.findAll();
        return exams.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private ExamDTO convertToDTO(ExamEntity exam) {
        return new ExamDTO(
                exam.getId(),
                exam.getTitle(),
                exam.getDescription(),
                exam.getDuration(),
                exam.getTotalQuestions(),
                exam.getPassingScore(),
                exam.getCourseId(),
                exam.getCreatedAt(),
                exam.getUpdatedAt()
        );
    }

    public QuestionDTO addQuestion(Long examId, QuestionDTO request) {
        if (!examRepository.existsById(examId)) {
            throw new ExamNotFoundException("Exam not found with ID: " + examId);
        }
        QuestionEntity entity = new QuestionEntity();
        entity.setExamId(examId);
        entity.setContent(request.getContent());
        entity.setOptions(request.getOptions());
        entity.setCorrectAnswerIndex(request.getCorrectAnswerIndex());

        QuestionEntity saved = questionRepository.save(entity);
        return new QuestionDTO(saved.getId(), saved.getExamId(), saved.getContent(), saved.getOptions(), saved.getCorrectAnswerIndex());
    }

    public List<QuestionDTO> getExamQuestions(Long examId) {
        return questionRepository.findByExamId(examId).stream()
                .map(q -> new QuestionDTO(q.getId(), q.getExamId(), q.getContent(), q.getOptions(), q.getCorrectAnswerIndex()))
                .collect(Collectors.toList());
    }

    public ExamResultDTO submitExam(Long examId, SubmitExamRequest request) {
        ExamEntity exam = examRepository.findById(examId)
                .orElseThrow(() -> new ExamNotFoundException("Exam not found"));

        List<QuestionEntity> questions = questionRepository.findByExamId(examId);
        int correct = 0;
        for (QuestionEntity q : questions) {
            Integer studentAnswer = request.getAnswers().get(q.getId());
            if (studentAnswer != null && studentAnswer.equals(q.getCorrectAnswerIndex())) {
                correct++;
            }
        }
        
        int totalQuestions = questions.size();
        int scorePercentage = totalQuestions == 0 ? 0 : (correct * 100) / totalQuestions;
        boolean passed = scorePercentage >= exam.getPassingScore();

        return new ExamResultDTO(examId, totalQuestions, correct, scorePercentage, passed);
    }
}
