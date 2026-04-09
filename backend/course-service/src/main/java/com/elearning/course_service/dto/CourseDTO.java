package com.elearning.course_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {

    private Long id;

    private String title;

    private String description;

    private String instructor;

    private BigDecimal price;

    private String category;

    private String level;

    private Integer duration;

    private String language;

    private Long instructorId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
