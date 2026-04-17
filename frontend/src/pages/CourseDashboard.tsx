import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

interface Course  { id:number; title:string; description:string; instructor:string; }
interface Lesson  { id:number; courseId:number; title:string; fileName:string; fileType:string; createdAt:string; }
interface Exam    { id:number; title:string; duration:number; totalQuestions:number; passingScore:number; }

type Tab = 'overview'|'lessons'|'exam';

const CourseDashboard = () => {
    const { courseId } = useParams();
    const [course,  setCourse]  = useState<Course|null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [exam,    setExam]    = useState<Exam|null>(null);
    const [loading, setLoading] = useState(true);
    const [tab,     setTab]     = useState<Tab>('overview');

    useEffect(() => {
        const load = async () => {
            try {
                const [cRes, lRes, eRes] = await Promise.all([
                    axiosClient.get(`/courses/${courseId}`),
                    axiosClient.get(`/courses/${courseId}/lessons`),
                    axiosClient.get(`/exams/course/${courseId}`),
                ]);
                setCourse(cRes.data);
                setLessons(lRes.data);
                if (eRes.data?.length) setExam(eRes.data[0]);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        load();
    }, [courseId]);

    if (loading) return (
        <div className="center-screen">
            <div className="spinner" style={{ width:32, height:32, borderWidth:3 }} />
        </div>
    );
    if (!course) return (
        <div className="center-screen">
            <div style={{ textAlign:'center' }}>
                <p style={{ color:'var(--text-2)', marginBottom:'1rem' }}>Course not found.</p>
                <Link to="/" className="btn btn-primary">Back to Courses</Link>
            </div>
        </div>
    );

    const tabs: Tab[] = ['overview','lessons','exam'];

    return (
        <div style={{ minHeight:'100vh', padding:'2rem 1.25rem' }}>
            <div style={{ maxWidth:1100, margin:'0 auto' }}>

                {/* Page header */}
                <div className="animate-fade-in" style={{ marginBottom:'2rem' }}>
                    {/* Breadcrumb */}
                    <div style={{ display:'flex', alignItems:'center', gap:'.5rem', color:'var(--text-3)', fontSize:'.8rem', marginBottom:'.875rem' }}>
                        <Link to="/" style={{ color:'var(--text-3)', textDecoration:'none', display:'flex', alignItems:'center', gap:'.3rem' }}>
                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            Courses
                        </Link>
                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <span>{course.title}</span>
                    </div>

                    {/* Title + meta */}
                    <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem' }}>
                        <div>
                            <h1 style={{ fontSize:'clamp(1.6rem,3vw,2.25rem)', fontWeight:800, color:'var(--text)', lineHeight:1.2, marginBottom:'.625rem' }}>
                                {course.title}
                            </h1>
                            <div style={{ display:'flex', alignItems:'center', gap:'.75rem', flexWrap:'wrap' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:'.5rem', color:'var(--text-2)', fontSize:'.875rem' }}>
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    {course.instructor}
                                </div>
                                <span className="badge badge-blue">Active Enrollment</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab nav */}
                <div style={{ display:'flex', gap:'.375rem', marginBottom:'1.75rem', borderBottom:'1px solid var(--border)', paddingBottom:'.5rem' }}>
                    {tabs.map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            style={{
                                padding:'.5rem 1rem', borderRadius:8, border:'none', cursor:'pointer', fontWeight:600, fontSize:'.875rem',
                                background: tab===t ? 'rgba(37,99,235,.12)' : 'transparent',
                                color: tab===t ? '#60a5fa' : 'var(--text-2)',
                                textTransform:'capitalize', transition:'all .2s'
                            }}>
                            {t}
                        </button>
                    ))}
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'1.5rem', alignItems:'start' }}>

                    {/* ── Content column ── */}
                    <div>
                        {/* OVERVIEW */}
                        {tab === 'overview' && (
                            <div className="card-glass animate-fade-in">
                                <h3 className="section-title">
                                    <svg width="18" height="18" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    About this course
                                </h3>
                                <p style={{ color:'var(--text-2)', lineHeight:1.75 }}>{course.description}</p>

                                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'.75rem', marginTop:'1.5rem' }}>
                                    {[
                                        { label:'Duration', value:'12 Hours' },
                                        { label:'Modules',  value:'5 Units' },
                                        { label:'Certificate', value:'Verified' },
                                        { label:'Access', value:'Lifetime' },
                                    ].map(s => (
                                        <div key={s.label} style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:10, padding:'.875rem', textAlign:'center' }}>
                                            <div style={{ fontWeight:700, color:'var(--text)', fontSize:'.95rem' }}>{s.value}</div>
                                            <div style={{ color:'var(--text-3)', fontSize:'.75rem', marginTop:'.25rem' }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* LESSONS */}
                        {tab === 'lessons' && (
                            <div className="card-glass animate-fade-in" style={{ padding:0, overflow:'hidden' }}>
                                <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid var(--border)' }}>
                                    <h3 className="section-title" style={{ marginBottom:0 }}>
                                        <svg width="17" height="17" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                        Course Lessons
                                    </h3>
                                    <p style={{ color:'var(--text-3)', fontSize:'.8rem', marginTop:'.25rem' }}>Download PDF/Word materials below</p>
                                </div>

                                {lessons.length === 0 ? (
                                    <div style={{ padding:'3rem', textAlign:'center', color:'var(--text-3)' }}>
                                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin:'0 auto .75rem', display:'block', opacity:.4 }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        No lessons uploaded yet
                                    </div>
                                ) : (
                                    <div>
                                        {lessons.map((lesson, i) => (
                                            <div key={lesson.id}
                                                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom: i < lessons.length-1 ? '1px solid var(--border)':'none' }}
                                                className="lesson-row">
                                                <div style={{ display:'flex', alignItems:'center', gap:'.875rem' }}>
                                                    <div style={{ width:36, height:36, borderRadius:9, background:'rgba(37,99,235,.12)', border:'1px solid rgba(37,99,235,.2)', display:'grid', placeItems:'center', flexShrink:0 }}>
                                                        <svg width="16" height="16" fill="none" stroke="#60a5fa" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight:600, color:'var(--text)', fontSize:'.9rem' }}>{lesson.title}</div>
                                                        <div style={{ color:'var(--text-3)', fontSize:'.75rem', marginTop:'.15rem' }}>{lesson.fileName}</div>
                                                    </div>
                                                </div>
                                                <a href={`/api/courses/lessons/${lesson.id}/download`} target="_blank" rel="noreferrer"
                                                    style={{ display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.8rem', fontWeight:600, color:'#60a5fa', textDecoration:'none', padding:'.4rem .75rem', borderRadius:7, border:'1px solid rgba(37,99,235,.25)', background:'rgba(37,99,235,.08)', transition:'all .2s' }}>
                                                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                    Download
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* EXAM */}
                        {tab === 'exam' && (
                            <div className="card-glass animate-fade-in" style={{ textAlign:'center', padding:'2.5rem' }}>
                                <div style={{ width:52, height:52, borderRadius:14, background:'rgba(37,99,235,.12)', border:'1px solid rgba(37,99,235,.25)', display:'grid', placeItems:'center', margin:'0 auto 1.25rem' }}>
                                    <svg width="24" height="24" fill="none" stroke="#60a5fa" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>

                                {exam ? (
                                    <>
                                        <h3 style={{ fontSize:'1.5rem', fontWeight:800, color:'var(--text)', marginBottom:'.5rem' }}>{exam.title}</h3>
                                        <div style={{ display:'flex', justifyContent:'center', gap:'1.5rem', color:'var(--text-2)', fontSize:'.875rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
                                            {[
                                                { icon:<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text:`${exam.duration} minutes` },
                                                { icon:<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text:`${exam.totalQuestions} questions` },
                                                { icon:<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text:`Pass at ${exam.passingScore}%` },
                                            ].map((m,i) => (
                                                <span key={i} style={{ display:'flex', alignItems:'center', gap:'.4rem' }}>{m.icon}{m.text}</span>
                                            ))}
                                        </div>
                                        <p style={{ color:'var(--text-2)', maxWidth:380, margin:'0 auto 1.75rem', lineHeight:1.7 }}>
                                            Test your knowledge and earn your certificate for <strong style={{ color:'var(--text)' }}>{course.title}</strong>.
                                        </p>
                                        <Link to={`/exam/${exam.id}`} className="btn btn-primary" style={{ padding:'.875rem 2.5rem', fontSize:'.95rem' }}>
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            Start Exam Now
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <h3 style={{ fontSize:'1.35rem', fontWeight:700, color:'var(--text)', marginBottom:'.5rem' }}>No Exam Available Yet</h3>
                                        <p style={{ color:'var(--text-2)' }}>The instructor hasn't set up an exam for this course yet. Check back later!</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar ── */}
                    <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                        {/* Progress */}
                        <div className="card-solid">
                            <h4 className="section-title" style={{ fontSize:'.9rem' }}>
                                <svg width="15" height="15" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                Your Progress
                            </h4>
                            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.8rem', marginBottom:'.5rem' }}>
                                <span style={{ color:'var(--text-2)' }}>Completion</span>
                                <span style={{ fontWeight:700, color:'var(--text)' }}>40%</span>
                            </div>
                            <div style={{ height:6, background:'rgba(255,255,255,.07)', borderRadius:3, overflow:'hidden', marginBottom:'.75rem' }}>
                                <div style={{ height:'100%', width:'40%', background:'linear-gradient(90deg,var(--blue),var(--indigo))', borderRadius:3 }} />
                            </div>
                            <p style={{ fontSize:'.75rem', color:'var(--text-3)' }}>Complete more lessons to unlock the final exam.</p>
                        </div>

                        {/* Instructor */}
                        <div className="card-solid">
                            <h4 className="section-title" style={{ fontSize:'.9rem', marginBottom:'1rem' }}>
                                <svg width="15" height="15" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                Instructor
                            </h4>
                            <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'.875rem' }}>
                                <div style={{ width:40, height:40, borderRadius:10, background:'rgba(37,99,235,.15)', border:'1px solid rgba(37,99,235,.25)', display:'grid', placeItems:'center', flexShrink:0 }}>
                                    <svg width="18" height="18" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <div style={{ fontWeight:700, color:'var(--text)', fontSize:'.9rem' }}>{course.instructor}</div>
                                    <div style={{ color:'var(--text-3)', fontSize:'.75rem' }}>Senior Instructor</div>
                                </div>
                            </div>
                            <p style={{ fontSize:'.8rem', color:'var(--text-2)', lineHeight:1.65 }}>
                                Expert in the field with over 10 years of professional experience — passionate about making complex topics accessible.
                            </p>
                        </div>

                        {/* Quick nav */}
                        <div className="card-solid">
                            <h4 className="section-title" style={{ fontSize:'.9rem', marginBottom:'1rem' }}>
                                <svg width="15" height="15" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                                Quick Nav
                            </h4>
                            {tabs.map(t => (
                                <button key={t} onClick={() => setTab(t)}
                                    style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:'.625rem', padding:'.5rem .625rem', borderRadius:8, border:'none', cursor:'pointer', fontSize:'.875rem', fontWeight: tab===t ? 600 : 400, color: tab===t ? '#60a5fa':'var(--text-2)', background: tab===t ? 'rgba(37,99,235,.1)':'transparent', transition:'all .2s', textTransform:'capitalize', marginBottom:'.25rem' }}>
                                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDashboard;
