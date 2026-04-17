package com.elearning.exam_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmitExamRequest {
    // A map from Question ID to the chosen option index format
    private Map<Long, Integer> answers;
}
