import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  instructorName: string;
}

const DEMO_COURSES: Course[] = [
  {
    id: 1,
    title: 'React Fundamentals',
    description: 'Build modern UIs with components, hooks, routing, and best practices. Perfect for getting productive fast.',
    price: 29,
    instructorName: 'Amina K.',
  },
  {
    id: 2,
    title: 'Java + Spring Boot Microservices',
    description: 'Design resilient services with discovery, gateway routing, auth, and data persistence. Hands-on and practical.',
    price: 49,
    instructorName: 'David N.',
  },
  {
    id: 3,
    title: 'PostgreSQL for Developers',
    description: 'Data modeling, indexing, queries, and performance tuning—everything you need for real production apps.',
    price: 39,
    instructorName: 'Sarah M.',
  },
];

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<number | null>(null);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosClient.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.warn('Failed to fetch courses; showing demo courses.', err);
        setCourses(DEMO_COURSES);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: number) => {
    if (!isAuthenticated) {
      alert('Please login to enroll in courses');
      return;
    }

    setEnrolling(courseId);
    const userId = user?.id || 0;
    try {
      await axiosClient.post('/courses/enroll', { courseId, userId });
      alert('🎉 Enrollment initiated! Complete payment to access the course.');
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : err instanceof Error
        ? err.message
        : 'Unknown error';
      alert(`❌ Enrollment failed: ${message}`);
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-white/80 text-lg font-medium">Loading amazing courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-wrapper">
      {/* Hero Section */}
      <div className="hero-section text-center mb-12 animate-fade-in">
        <h1 className="hero-title mb-4">
          Discover Your Next Learning Adventure
        </h1>
        <p className="hero-subtitle text-white/80">
          Explore our curated collection of courses designed to help you master new skills and advance your career.
        </p>

        {/* Stats */}
        <div className="stats-grid max-w-4xl mx-auto mt-12">
          <div className="stat-card animate-slide-in">
            <div className="stat-number">{courses.length}+</div>
            <div className="stat-label">Courses Available</div>
          </div>
          <div className="stat-card animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="stat-number">10K+</div>
            <div className="stat-label">Students Learning</div>
          </div>
          <div className="stat-card animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="stat-number">4.9★</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="courses-grid">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="course-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="course-header">
                <h3 className="course-title">{course.title}</h3>
                <div className="course-price">${course.price}</div>
              </div>

              <div className="course-content">
                <p className="course-description">{course.description}</p>

                <div className="course-meta">
                  <div className="course-instructor">
                    <div className="instructor-avatar">
                      {course.instructorName.charAt(0).toUpperCase()}
                    </div>
                    <span>{course.instructorName}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrolling === course.id}
                  className="enroll-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enrolling === course.id ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner w-5 h-5 mr-2"></div>
                      Enrolling...
                    </div>
                  ) : (
                    '🚀 Enroll Now'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-white mb-2">No courses available yet</h3>
            <p className="text-white/70">Check back soon for new learning opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;