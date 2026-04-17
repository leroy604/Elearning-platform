package com.elearning.exam_service.controller;

import com.elearning.exam_service.dto.CreateExamRequest;
import com.elearning.exam_service.dto.ExamDTO;
import com.elearning.exam_service.dto.UpdateExamRequest;
import com.elearning.exam_service.service.ExamService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.elearning.exam_service.dto.QuestionDTO;
import com.elearning.exam_service.dto.SubmitExamRequest;
import com.elearning.exam_service.dto.ExamResultDTO;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ExamController {
    
    @Autowired
    private ExamService examService;
    
    @PostMapping
    public ResponseEntity<ExamDTO> createExam(@Valid @RequestBody CreateExamRequest request) {
        ExamDTO exam = examService.createExam(request);
        return new ResponseEntity<>(exam, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExamDTO> getExamById(@PathVariable Long id) {
        ExamDTO exam = examService.getExamById(id);
        return new ResponseEntity<>(exam, HttpStatus.OK);
    }
    
    @GetMapping
    public ResponseEntity<List<ExamDTO>> getAllExams() {
        List<ExamDTO> exams = examService.getAllExams();
        return new ResponseEntity<>(exams, HttpStatus.OK);
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ExamDTO>> getExamsByCourseId(@PathVariable Long courseId) {
        List<ExamDTO> exams = examService.getExamsByCourseId(courseId);
        return new ResponseEntity<>(exams, HttpStatus.OK);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ExamDTO> updateExam(
            @PathVariable Long id,
            @Valid @RequestBody UpdateExamRequest request) {
        ExamDTO exam = examService.updateExam(id, request);
        return new ResponseEntity<>(exam, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @PostMapping("/{id}/questions")
    public ResponseEntity<QuestionDTO> addQuestion(@PathVariable Long id, @Valid @RequestBody QuestionDTO request) {
        QuestionDTO question = examService.addQuestion(id, request);
        return new ResponseEntity<>(question, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}/questions")
    public ResponseEntity<List<QuestionDTO>> getExamQuestions(@PathVariable Long id) {
        List<QuestionDTO> questions = examService.getExamQuestions(id);
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }
    
    @PostMapping("/{id}/submit")
    public ResponseEntity<ExamResultDTO> submitExam(@PathVariable Long id, @Valid @RequestBody SubmitExamRequest request) {
        ExamResultDTO result = examService.submitExam(id, request);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
