package com.elearning.exam_service.dto;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateExamRequest {
    
    private String title;
    
    private String description;
    
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer duration;
    
    @Min(value = 1, message = "Must have at least 1 question")
    private Integer totalQuestions;
    
    @Min(value = 0, message = "Passing score cannot be negative")
    private Integer passingScore;
}
