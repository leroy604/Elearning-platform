package com.elearning.course_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonDTO {
    private Long id;
    private Long courseId;
    private String title;
    private String fileName;
    private String fileType;
    private LocalDateTime createdAt;
}
