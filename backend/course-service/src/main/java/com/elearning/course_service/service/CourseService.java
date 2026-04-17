package com.elearning.course_service.service;

import com.elearning.course_service.dto.CreateCourseRequest;
import com.elearning.course_service.dto.CourseDTO;
import com.elearning.course_service.dto.UpdateCourseRequest;
import com.elearning.course_service.entity.CourseEntity;
import com.elearning.course_service.exception.CourseNotFoundException;
import com.elearning.course_service.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;
import com.elearning.course_service.entity.LessonEntity;
import com.elearning.course_service.repository.LessonRepository;
import com.elearning.course_service.dto.LessonDTO;

@Service
@Transactional
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    public CourseDTO createCourse(CreateCourseRequest request) {
        CourseEntity course = new CourseEntity();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setInstructor(request.getInstructor());
        course.setPrice(request.getPrice());
        course.setCategory(request.getCategory());
        course.setLevel(request.getLevel());
        course.setDuration(request.getDuration());
        course.setLanguage(request.getLanguage());
        course.setInstructorId(request.getInstructorId());

        CourseEntity savedCourse = courseRepository.save(course);
        return convertToDTO(savedCourse);
    }

    public CourseDTO getCourseById(Long courseId) {
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with ID: " + courseId));
        return convertToDTO(course);
    }

    public List<CourseDTO> getCoursesByInstructorId(Long instructorId) {
        List<CourseEntity> courses = courseRepository.findByInstructorId(instructorId);
        return courses.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getCoursesByCategory(String category) {
        List<CourseEntity> courses = courseRepository.findByCategory(category);
        return courses.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getCoursesByLevel(String level) {
        List<CourseEntity> courses = courseRepository.findByLevel(level);
        return courses.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getCoursesByInstructorAndCategory(Long instructorId, String category) {
        List<CourseEntity> courses = courseRepository.findByInstructorIdAndCategory(instructorId, category);
        return courses.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO updateCourse(Long courseId, UpdateCourseRequest request) {
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with ID: " + courseId));

        if (request.getTitle() != null) {
            course.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            course.setDescription(request.getDescription());
        }
        if (request.getInstructor() != null) {
            course.setInstructor(request.getInstructor());
        }
        if (request.getPrice() != null) {
            course.setPrice(request.getPrice());
        }
        if (request.getCategory() != null) {
            course.setCategory(request.getCategory());
        }
        if (request.getLevel() != null) {
            course.setLevel(request.getLevel());
        }
        if (request.getDuration() != null) {
            course.setDuration(request.getDuration());
        }
        if (request.getLanguage() != null) {
            course.setLanguage(request.getLanguage());
        }

        CourseEntity updatedCourse = courseRepository.save(course);
        return convertToDTO(updatedCourse);
    }

    public void deleteCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new CourseNotFoundException("Course not found with ID: " + courseId);
        }
        courseRepository.deleteById(courseId);
    }

    public List<CourseDTO> getAllCourses() {
        List<CourseEntity> courses = courseRepository.findAll();
        return courses.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CourseDTO convertToDTO(CourseEntity course) {
        return new CourseDTO(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getInstructor(),
                course.getPrice(),
                course.getCategory(),
                course.getLevel(),
                course.getDuration(),
                course.getLanguage(),
                course.getInstructorId(),
                course.getCreatedAt(),
                course.getUpdatedAt()
        );
    }

    public LessonDTO uploadLesson(Long courseId, String title, MultipartFile file) throws Exception {
        if (!courseRepository.existsById(courseId)) {
            throw new CourseNotFoundException("Course not found with ID: " + courseId);
        }

        LessonEntity lesson = new LessonEntity();
        lesson.setCourseId(courseId);
        lesson.setTitle(title);
        lesson.setFileName(file.getOriginalFilename());
        lesson.setFileType(file.getContentType());
        lesson.setFileData(file.getBytes());

        LessonEntity savedLesson = lessonRepository.save(lesson);
        return new LessonDTO(savedLesson.getId(), savedLesson.getCourseId(), savedLesson.getTitle(), savedLesson.getFileName(), savedLesson.getFileType(), savedLesson.getCreatedAt());
    }

    public List<LessonDTO> getCourseLessons(Long courseId) {
        return lessonRepository.findByCourseId(courseId).stream()
                .map(lesson -> new LessonDTO(lesson.getId(), lesson.getCourseId(), lesson.getTitle(), lesson.getFileName(), lesson.getFileType(), lesson.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public LessonEntity getLessonFile(Long lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with ID: " + lessonId));
    }
}
