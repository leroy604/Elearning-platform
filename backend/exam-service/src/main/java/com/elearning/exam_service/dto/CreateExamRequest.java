package com.elearning.exam_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateExamRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer duration;
    
    @NotNull(message = "Total questions is required")
    @Min(value = 1, message = "Must have at least 1 question")
    private Integer totalQuestions;
    
    @NotNull(message = "Passing score is required")
    @Min(value = 0, message = "Passing score cannot be negative")
    private Integer passingScore;
    
    @NotNull(message = "Course ID is required")
    private Long courseId;
}
