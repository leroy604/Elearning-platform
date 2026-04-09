package com.elearning.exam_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamDTO {
    
    private Long id;
    
    private String title;
    
    private String description;
    
    private Integer duration;
    
    private Integer totalQuestions;
    
    private Integer passingScore;
    
    private Long courseId;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
