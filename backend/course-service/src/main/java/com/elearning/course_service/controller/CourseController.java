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
import org.springframework.web.multipart.MultipartFile;
import com.elearning.course_service.dto.LessonDTO;
import com.elearning.course_service.entity.LessonEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

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

    @PostMapping(value = "/{courseId}/lessons", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LessonDTO> uploadLesson(
            @PathVariable Long courseId,
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file) {
        try {
            LessonDTO lesson = courseService.uploadLesson(courseId, title, file);
            return new ResponseEntity<>(lesson, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{courseId}/lessons")
    public ResponseEntity<List<LessonDTO>> getCourseLessons(@PathVariable Long courseId) {
        return new ResponseEntity<>(courseService.getCourseLessons(courseId), HttpStatus.OK);
    }

    @GetMapping("/lessons/{lessonId}/download")
    public ResponseEntity<byte[]> downloadLesson(@PathVariable Long lessonId) {
        try {
            LessonEntity lesson = courseService.getLessonFile(lessonId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + lesson.getFileName() + "\"")
                    .contentType(MediaType.parseMediaType(lesson.getFileType()))
                    .body(lesson.getFileData());
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}
