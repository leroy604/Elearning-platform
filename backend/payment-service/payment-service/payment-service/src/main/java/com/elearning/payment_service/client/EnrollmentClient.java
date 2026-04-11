package com.elearning.payment_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "course-service")
public interface EnrollmentClient {

    @PutMapping("/api/enrollments/{id}/status")
    void updateStatus(@PathVariable("id") Long id, @RequestParam("status") String status);
}
