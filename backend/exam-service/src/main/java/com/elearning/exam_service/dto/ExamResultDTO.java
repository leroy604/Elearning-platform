package com.elearning.exam_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultDTO {
    private Long examId;
    private int totalQuestions;
    private int correctAnswers;
    private int scorePercentage;
    private boolean passed;
}
