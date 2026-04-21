import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import Landing from './Landing';

interface Course   { id:number; title:string; description:string; price:number; instructor:string; }
interface Enrollment { id:number; courseId:number; status:string; }

const DEMO_COURSES: Course[] = [
  { id:1, title:'React Fundamentals', description:'Build modern UIs with components, hooks, routing, and best practices. Perfect for getting productive fast.', price:29, instructor:'Amina K.' },
  { id:2, title:'Java + Spring Boot Microservices', description:'Design resilient services with discovery, gateway routing, auth, and data persistence. Hands-on and practical.', price:49, instructor:'David N.' },
  { id:3, title:'PostgreSQL for Developers', description:'Data modeling, indexing, queries, and performance tuning — everything you need for real production apps.', price:39, instructor:'Sarah M.' },
];

const Courses = () => {
  const [courses, setCourses]       = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading]       = useState(true);
  const [enrolling, setEnrolling]   = useState<number|null>(null);
  const { user, isAuthenticated, isInstructor } = useAuth();
  const navigate                    = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [cRes, eRes] = await Promise.all([
          axiosClient.get('/courses'),
          isAuthenticated && user?.id && !isInstructor ? axiosClient.get(`/enrollments/user/${user.id}`) : Promise.resolve({ data:[] })
        ]);
        setCourses(cRes.data);
        setEnrollments(eRes.data);
      } catch {
        setCourses(DEMO_COURSES);
      } finally { setLoading(false); }
    };
    fetch();
  }, [isAuthenticated, user?.id, isInstructor]);

  const handleEnroll = async (courseId: number) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (isInstructor) { alert('Instructors cannot enroll in courses.'); return; }
    setEnrolling(courseId);
    try {
      const res = await axiosClient.post('/enrollments', { courseId, userId: user?.id });
      setEnrollments([...enrollments, res.data]);
      navigate(`/payment/${res.data.id}?courseId=${courseId}`);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : err instanceof Error ? err.message : 'Unknown error';
      alert(`Enrollment failed: ${msg}`);
    } finally { setEnrolling(null); }
  };

  const getEnrollment = (id:number) => enrollments.find(e => e.courseId === id);

  if (loading) return (
    <div className="center-screen">
      <div style={{ textAlign:'center' }}>
        <div className="spinner" style={{ width:32, height:32, borderWidth:3, margin:'0 auto 1rem' }} />
        <p style={{ color:'var(--text-2)' }}>Loading courses…</p>
      </div>
    </div>
  );

  if (!isAuthenticated) return <Landing />;

  return (
    <div className="courses-wrapper">
      {/* Hero */}
      <div className="hero-section animate-fade-in" style={{ maxWidth:1200, margin:'0 auto' }}>
        <h1 className="hero-title">Discover Your Next<br />Learning Adventure</h1>
        <p className="hero-subtitle">
          Explore our curated collection designed to help you master new skills and advance your career — at your own pace.
        </p>

        <div className="stats-grid">
          {[
            { num:`${courses.length}+`, label:'Courses Available' },
            { num:'10K+', label:'Students Learning' },
            { num:'4.9★', label:'Average Rating' },
          ].map(s => (
            <div key={s.label} className="stat-card animate-slide-up">
              <div className="stat-number">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        {courses.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem 1rem' }}>
            <div style={{ width:48, height:48, borderRadius:12, background:'rgba(255,255,255,.05)', border:'1px solid var(--border)', display:'grid', placeItems:'center', margin:'0 auto 1rem' }}>
              <svg width="22" height="22" fill="none" stroke="var(--text-3)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 style={{ fontWeight:700, marginBottom:'.5rem' }}>No courses yet</h3>
            <p style={{ color:'var(--text-2)' }}>Check back soon for new learning opportunities!</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course, i) => {
              const enrollment = getEnrollment(course.id);
              const isCompleted = enrollment?.status === 'COMPLETED';
              const isPending   = enrollment?.status === 'PENDING';

              return (
                <div key={course.id} className="course-card animate-slide-up" style={{ animationDelay:`${i*0.07}s` }}>
                  {/* Card header */}
                  <div className="course-header">
                    <div className="course-title">{course.title}</div>
                    <div className="course-price">${course.price}</div>
                  </div>

                  {/* Card body */}
                  <div className="course-content">
                    <p className="course-description">{course.description}</p>

                    <div className="course-meta">
                      <div className="course-instructor">
                        <div className="instructor-avatar">
                          {course.instructor?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span>{course.instructor || 'Unknown'}</span>
                      </div>
                      {!isInstructor && isCompleted && <span className="badge badge-green" style={{ marginLeft:'auto' }}>Enrolled</span>}
                      {!isInstructor && isPending   && <span className="badge badge-amber" style={{ marginLeft:'auto' }}>Pending</span>}
                    </div>

                    {/* Enroll button — identical height/icon for all states */}
                    {isInstructor ? (
                      <button className="enroll-btn enroll-blue"
                        onClick={() => navigate(`/course/${course.id}/dashboard`)}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Enter Course
                      </button>
                    ) : isCompleted ? (
                      <button className="enroll-btn enroll-green"
                        onClick={() => navigate(`/course/${course.id}/dashboard`)}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Enter Course
                      </button>
                    ) : isPending ? (
                      <button className="enroll-btn enroll-amber"
                        onClick={() => navigate(`/payment/${enrollment!.id}?courseId=${course.id}`)}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Complete Payment
                      </button>
                    ) : (
                      <button className="enroll-btn enroll-blue"
                        disabled={enrolling === course.id}
                        onClick={() => handleEnroll(course.id)}>
                        {enrolling === course.id
                          ? <><div className="spinner" />Enrolling…</>
                          : <><svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>Enroll Now</>
                        }
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>

  );
};

export default Courses;
