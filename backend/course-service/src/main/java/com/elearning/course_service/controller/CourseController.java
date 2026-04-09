package com.elearning.course_service.controller;

import com.elearning.course_service.dto.CreateCourseRequest;
import com.elearning.course_service.dto.CourseDTO;
import com.elearning.course_service.dto.UpdateCourseRequest;
import com.elearning.course_service.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(@Valid @RequestBody CreateCourseRequest request) {
        CourseDTO course = courseService.createCourse(request);
        return new ResponseEntity<>(course, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        CourseDTO course = courseService.getCourseById(id);
        return new ResponseEntity<>(course, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<CourseDTO>> getCoursesByInstructorId(@PathVariable Long instructorId) {
        List<CourseDTO> courses = courseService.getCoursesByInstructorId(instructorId);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<CourseDTO>> getCoursesByCategory(@PathVariable String category) {
        List<CourseDTO> courses = courseService.getCoursesByCategory(category);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<List<CourseDTO>> getCoursesByLevel(@PathVariable String level) {
        List<CourseDTO> courses = courseService.getCoursesByLevel(level);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @GetMapping("/instructor/{instructorId}/category/{category}")
    public ResponseEntity<List<CourseDTO>> getCoursesByInstructorAndCategory(
            @PathVariable Long instructorId,
            @PathVariable String category) {
        List<CourseDTO> courses = courseService.getCoursesByInstructorAndCategory(instructorId, category);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCourseRequest request) {
        CourseDTO course = courseService.updateCourse(id, request);
        return new ResponseEntity<>(course, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
