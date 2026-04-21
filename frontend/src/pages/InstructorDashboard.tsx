import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

interface Course { id:number; title:string; description:string; price:number; instructor:string; }
interface Exam   { id:number; courseId:number; title:string; }
interface User   { id:number; firstName:string; lastName:string; email:string; role:string; }

type Panel = 'course' | 'exam' | 'lesson' | 'question' | 'users';

const PANELS: { key: Panel; label: string; icon: React.ReactNode }[] = [
    { key:'course',   label:'New Course',     icon:<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { key:'exam',     label:'Set Exam',       icon:<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
    { key:'lesson',   label:'Upload Lesson',  icon:<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> },
    { key:'question', label:'Add Question',   icon:<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { key:'users',    label:'Manage Users',   icon:<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
];

const Label = ({ children }: { children: string }) => (
    <label style={{ fontSize:'.72rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.07em', display:'block', marginBottom:'.35rem' }}>
        {children}
    </label>
);

const InstructorDashboard = () => {
    const { user, isAdmin } = useAuth();
    const [courses, setCourses]   = useState<Course[]>([]);
    const [exams,   setExams]     = useState<Exam[]>([]);
    const [users,   setUsers]     = useState<User[]>([]);
    const [loading, setLoading]   = useState(true);
    const [panel,   setPanel]     = useState<Panel>('course');
    const [status,  setStatus]    = useState('');

    const [courseForm, setCourseForm] = useState({ title:'', description:'', price:0, category:'Technology', level:'BEGINNER', duration:5, language:'English' });
    const [examForm,   setExamForm]   = useState({ courseId:'', title:'', description:'', duration:60, totalQuestions:10, passingScore:80 });
    const [lessonForm, setLessonForm] = useState({ courseId:'', title:'' });
    const [lessonFile, setLessonFile] = useState<File|null>(null);
    const [questionForm, setQuestionForm] = useState({ examId:'', content:'', optionA:'', optionB:'', optionC:'', optionD:'', correctAnswerIndex:0 });

    useEffect(() => {
        if (!user?.id) return;
        (async () => {
            try {
                const [cRes, uRes] = await Promise.all([
                    axiosClient.get(`/courses/instructor/${user.id}`).catch(() => axiosClient.get('/courses')), // Fallback to all if instructor filter fails or acting as admin
                    axiosClient.get('/users').catch(() => ({ data: [] }))
                ]);
                
                setCourses(cRes.data);
                setUsers(uRes.data);

                const examList: Exam[] = [];
                for (const c of cRes.data) {
                    try {
                        const eRes = await axiosClient.get(`/exams/course/${c.id}`);
                        examList.push(...eRes.data);
                    } catch { /* skip */ }
                }
                setExams(examList);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        })();
    }, [user?.id]);

    const flash = (msg: string) => { setStatus(msg); setTimeout(() => setStatus(''), 3500); };

    const handleCourseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post('/courses', { ...courseForm, instructor:`${user?.firstName} ${user?.lastName}`, instructorId:user?.id });
            setCourses([...courses, res.data]);
            setCourseForm({ title:'', description:'', price:0, category:'Technology', level:'BEGINNER', duration:5, language:'English' });
            flash('✓ Course launched successfully!');
        } catch { flash('✗ Failed to launch course.'); }
    };

    const handleExamSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post('/exams', { ...examForm, courseId:Number(examForm.courseId) });
            setExams([...exams, res.data]);
            setExamForm({ courseId:'', title:'', description:'', duration:60, totalQuestions:10, passingScore:80 });
            flash('✓ Exam set successfully!');
        } catch { flash('✗ Failed to set exam.'); }
    };

    const handleLessonUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lessonForm.courseId || !lessonFile) { flash('Select a course and a file.'); return; }
        try {
            const fd = new FormData();
            fd.append('title', lessonForm.title);
            fd.append('file', lessonFile);
            await axiosClient.post(`/courses/${lessonForm.courseId}/lessons`, fd, { headers:{ 'Content-Type':'multipart/form-data' } });
            setLessonForm({ courseId:'', title:'' }); setLessonFile(null);
            flash('✓ Lesson uploaded!');
        } catch { flash('✗ Failed to upload lesson.'); }
    };

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosClient.post(`/exams/${questionForm.examId}/questions`, {
                content: questionForm.content,
                options: [questionForm.optionA, questionForm.optionB, questionForm.optionC, questionForm.optionD],
                correctAnswerIndex: Number(questionForm.correctAnswerIndex)
            });
            setQuestionForm({ ...questionForm, content:'', optionA:'', optionB:'', optionC:'', optionD:'', correctAnswerIndex:0 });
            flash('✓ Question added!');
        } catch { flash('✗ Failed to add question.'); }
    };

    const handleDeleteCourse = async (id: number) => {
        if (!window.confirm('Delete this course? This cannot be undone.')) return;
        try {
            await axiosClient.delete(`/courses/${id}`);
            setCourses(courses.filter(c => c.id !== id));
            setExams(exams.filter(e => e.courseId !== id));
            flash('✓ Course deleted.');
        } catch { flash('✗ Failed to delete course.'); }
    };

    const handleRoleUpdate = async (id: number, newRole: string) => {
        const verb = newRole === 'INSTRUCTOR' ? 'Promote' : 'Demote';
        if (!window.confirm(`${verb} this user to ${newRole}?`)) return;
        try {
            await axiosClient.put(`/users/${id}`, { role: newRole });
            setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
            flash(`✓ User ${verb.toLowerCase()}d successfully.`);
        } catch { flash(`✗ Failed to update user role.`); }
    };

    const handleDeleteUser = async (id: number) => {
        if (!window.confirm('Delete this user account? This action is permanent.')) return;
        try {
            await axiosClient.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
            flash('✓ User deleted.');
        } catch { flash('✗ Failed to delete user.'); }
    };

    const inputCls = 'form-input';
    const selectCls = 'form-select';

    return (
        <div style={{ minHeight:'100vh', padding:'2rem 1.25rem' }}>
            <div style={{ maxWidth:1200, margin:'0 auto' }}>

                {/* Header */}
                <div className="animate-fade-in" style={{ marginBottom:'2rem' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
                        <div>
                            <h1 style={{ fontSize:'clamp(1.6rem,3vw,2.25rem)', fontWeight:800, color:'var(--text)', marginBottom:'.4rem' }}>
                                {isAdmin ? 'Admin Dashboard' : 'Instructor Dashboard'}
                            </h1>
                            <p style={{ color:'var(--text-2)', fontSize:'.9rem' }}>
                                {isAdmin 
                                    ? 'Comprehensive management of courses, users, and site content.' 
                                    : 'Manage your courses, exams, and teaching materials.'}
                            </p>
                        </div>
                        {/* Stats strip */}
                        <div style={{ display:'flex', gap:.75+'rem' }}>
                            {[
                                { label:'Courses', value:courses.length, color:'#60a5fa' },
                                { label:'Users',   value:users.length,   color:'#34d399' },
                                { label:'Exams',   value:exams.length,   color:'#818cf8' },
                            ].map(s => (
                                <div key={s.label} style={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:10, padding:'.625rem 1rem', textAlign:'center', minWidth:72 }}>
                                    <div style={{ fontSize:'1.35rem', fontWeight:800, color:s.color }}>{s.value}</div>
                                    <div style={{ fontSize:'.7rem', color:'var(--text-3)' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Flash message */}
                    {status && (
                        <div style={{ marginTop:'1rem', padding:'.75rem 1rem', borderRadius:9, fontSize:'.875rem', fontWeight:600, background: status.startsWith('✓') ? 'rgba(5,150,105,.12)' : 'rgba(220,38,38,.12)', border:`1px solid ${status.startsWith('✓') ? 'rgba(5,150,105,.3)' : 'rgba(220,38,38,.3)'}`, color: status.startsWith('✓') ? '#34d399' : '#f87171' }}>
                            {status}
                        </div>
                    )}
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:'1.5rem', alignItems:'start' }}>

                    {/* ── Sidebar nav ── */}
                    <div style={{ display:'flex', flexDirection:'column', gap:'.375rem' }}>
                        {PANELS.filter(p => isAdmin || p.key !== 'users').map(p => (
                            <button key={p.key} onClick={() => setPanel(p.key)}
                                style={{ display:'flex', alignItems:'center', gap:'.625rem', padding:'.625rem .875rem', borderRadius:9, border:'none', cursor:'pointer', fontWeight:600, fontSize:'.875rem', textAlign:'left', transition:'all .2s', background: panel===p.key ? 'rgba(37,99,235,.14)' : 'transparent', color: panel===p.key ? '#60a5fa' : 'var(--text-2)' }}>
                                {p.icon} {p.label}
                            </button>
                        ))}

                        <div style={{ height:'1px', background:'var(--border)', margin:'.5rem 0' }} />

                        <div style={{ padding:'.5rem .875rem' }}>
                            <p style={{ fontSize:'.7rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.625rem' }}>Active Courses</p>
                            {loading ? <div className="spinner" /> : courses.length === 0
                                ? <p style={{ fontSize:'.8rem', color:'var(--text-3)', fontStyle:'italic' }}>No courses yet</p>
                                : courses.map(c => (
                                    <div key={c.id} style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:8, padding:'.625rem .75rem', marginBottom:'.5rem' }}>
                                        <div style={{ fontWeight:600, color:'var(--text)', fontSize:'.8rem', lineHeight:1.4, marginBottom:'.4rem' }}>{c.title}</div>
                                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                            <span style={{ fontSize:'.7rem', color:'var(--text-3)' }}>${c.price}</span>
                                            <button onClick={() => handleDeleteCourse(c.id)}
                                                style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(220,38,38,.6)', padding:0, display:'flex', transition:'color .2s' }}
                                                title="Delete course">
                                                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/* ── Main panel ── */}
                    <div className="card-glass animate-fade-in" style={{ minHeight:400 }}>

                        {/* ── CREATE COURSE ── */}
                        {panel === 'course' && (
                            <>
                                <h2 className="section-title" style={{ marginBottom:'1.5rem' }}>
                                    <svg width="18" height="18" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Launch a New Course
                                </h2>
                                <form onSubmit={handleCourseSubmit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                                    <div style={{ gridColumn:'1/-1' }}>
                                        <Label>Course Title</Label>
                                        <input className={inputCls} placeholder="e.g. Master React in 30 Days" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title:e.target.value})} required />
                                    </div>
                                    <div style={{ gridColumn:'1/-1' }}>
                                        <Label>Description</Label>
                                        <textarea className={inputCls} placeholder="What will students learn?" style={{ minHeight:100, resize:'vertical' }} value={courseForm.description} onChange={e => setCourseForm({...courseForm, description:e.target.value})} required />
                                    </div>
                                    <div>
                                        <Label>Price ($)</Label>
                                        <input className={inputCls} type="number" value={courseForm.price} onChange={e => setCourseForm({...courseForm, price:Number(e.target.value)})} required />
                                    </div>
                                    <div>
                                        <Label>Level</Label>
                                        <select className={selectCls} value={courseForm.level} onChange={e => setCourseForm({...courseForm, level:e.target.value})}>
                                            <option value="BEGINNER">Beginner</option>
                                            <option value="INTERMEDIATE">Intermediate</option>
                                            <option value="ADVANCED">Advanced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Category</Label>
                                        <input className={inputCls} value={courseForm.category} onChange={e => setCourseForm({...courseForm, category:e.target.value})} />
                                    </div>
                                    <div>
                                        <Label>Duration (hours)</Label>
                                        <input className={inputCls} type="number" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration:Number(e.target.value)})} />
                                    </div>
                                    <div style={{ gridColumn:'1/-1' }}>
                                        <button type="submit" className="btn btn-primary" style={{ width:'100%', padding:'.875rem', fontSize:'.95rem' }}>
                                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                            Create Course
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* ── SET EXAM ── */}
                        {panel === 'exam' && (
                            <>
                                <h2 className="section-title" style={{ marginBottom:'1.5rem' }}>
                                    <svg width="18" height="18" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                    Set a Course Exam
                                </h2>
                                <form onSubmit={handleExamSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                                    <div>
                                        <Label>Select Course</Label>
                                        <select className={selectCls} value={examForm.courseId} onChange={e => setExamForm({...examForm, courseId:e.target.value})} required>
                                            <option value="">-- Choose a course --</option>
                                            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Exam Title</Label>
                                        <input className={inputCls} placeholder="e.g. Final Certification Exam" value={examForm.title} onChange={e => setExamForm({...examForm, title:e.target.value})} required />
                                    </div>
                                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
                                        <div>
                                            <Label>Duration (min)</Label>
                                            <input className={inputCls} type="number" value={examForm.duration} onChange={e => setExamForm({...examForm, duration:Number(e.target.value)})} required />
                                        </div>
                                        <div>
                                            <Label>Total Questions</Label>
                                            <input className={inputCls} type="number" value={examForm.totalQuestions} onChange={e => setExamForm({...examForm, totalQuestions:Number(e.target.value)})} required />
                                        </div>
                                        <div>
                                            <Label>Passing Score (%)</Label>
                                            <input className={inputCls} type="number" value={examForm.passingScore} onChange={e => setExamForm({...examForm, passingScore:Number(e.target.value)})} required />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-indigo" style={{ width:'100%', padding:'.875rem', fontSize:'.95rem' }}>
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Set Exam
                                    </button>
                                </form>
                            </>
                        )}

                        {/* ── UPLOAD LESSON ── */}
                        {panel === 'lesson' && (
                            <>
                                <h2 className="section-title" style={{ marginBottom:'1.5rem' }}>
                                    <svg width="18" height="18" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    Upload Course Lesson
                                </h2>
                                <form onSubmit={handleLessonUpload} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                                    <div>
                                        <Label>Select Course</Label>
                                        <select className={selectCls} value={lessonForm.courseId} onChange={e => setLessonForm({...lessonForm, courseId:e.target.value})} required>
                                            <option value="">-- Choose a course --</option>
                                            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Lesson Title</Label>
                                        <input className={inputCls} placeholder="e.g. Chapter 1: Introduction" value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title:e.target.value})} required />
                                    </div>
                                    <div>
                                        <Label>File (PDF / DOC)</Label>
                                        <input className={inputCls} type="file" accept=".pdf,.doc,.docx" onChange={e => setLessonFile(e.target.files?.[0] ?? null)} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width:'100%', padding:'.875rem', fontSize:'.95rem' }}>
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                        Upload Lesson
                                    </button>
                                </form>
                            </>
                        )}

                        {/* ── ADD QUESTION ── */}
                        {panel === 'question' && (
                            <>
                                <h2 className="section-title" style={{ marginBottom:'1.5rem' }}>
                                    <svg width="18" height="18" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Add Exam Question
                                </h2>
                                <form onSubmit={handleQuestionSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                                    <div>
                                        <Label>Select Exam</Label>
                                        <select className={selectCls} value={questionForm.examId} onChange={e => setQuestionForm({...questionForm, examId:e.target.value})} required>
                                            <option value="">-- Choose an exam --</option>
                                            {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Question</Label>
                                        <textarea className={inputCls} placeholder="What is the output of..." style={{ minHeight:80, resize:'vertical' }} value={questionForm.content} onChange={e => setQuestionForm({...questionForm, content:e.target.value})} required />
                                    </div>
                                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.875rem' }}>
                                        {(['A','B','C','D'] as const).map(l => {
                                            const key = `option${l}` as 'optionA'|'optionB'|'optionC'|'optionD';
                                            return (
                                                <div key={l}>
                                                    <Label>{`Option ${l}`}</Label>
                                                    <input className={inputCls} value={questionForm[key]} onChange={e => setQuestionForm({...questionForm, [key]:e.target.value})} required />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div>
                                        <Label>Correct Answer</Label>
                                        <select className={selectCls} value={questionForm.correctAnswerIndex} onChange={e => setQuestionForm({...questionForm, correctAnswerIndex:Number(e.target.value)})}>
                                            {['Option A','Option B','Option C','Option D'].map((o,i) => <option key={i} value={i}>{o}</option>)}
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-success" style={{ width:'100%', padding:'.875rem', fontSize:'.95rem' }}>
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Add Question
                                    </button>
                                </form>
                            </>
                        )}

                        {/* ── MANAGE USERS ── */}
                        {panel === 'users' && (
                            <>
                                <h2 className="section-title" style={{ marginBottom:'1.5rem' }}>
                                    <svg width="18" height="18" fill="none" stroke="#34d399" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    User Management
                                </h2>
                                <div style={{ overflowX:'auto' }}>
                                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.875rem' }}>
                                        <thead>
                                            <tr style={{ background:'rgba(255,255,255,.03)', borderBottom:'1px solid var(--border)' }}>
                                                <th style={{ textAlign:'left', padding:'.75rem 1rem', color:'var(--text-3)', fontWeight:600 }}>User</th>
                                                <th style={{ textAlign:'left', padding:'.75rem 1rem', color:'var(--text-3)', fontWeight:600 }}>Email</th>
                                                <th style={{ textAlign:'left', padding:'.75rem 1rem', color:'var(--text-3)', fontWeight:600 }}>Role</th>
                                                <th style={{ textAlign:'center', padding:'.75rem 1rem', color:'var(--text-3)', fontWeight:600 }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.length === 0 ? (
                                                <tr><td colSpan={4} style={{ textAlign:'center', padding:'2rem', color:'var(--text-3)' }}>No users found.</td></tr>
                                            ) : users.map(u => (
                                                <tr key={u.id} style={{ borderBottom:'1px solid var(--border)' }}>
                                                    <td style={{ padding:'.75rem 1rem' }}>
                                                        <div style={{ fontWeight:600, color:'var(--text)' }}>{u.firstName} {u.lastName}</div>
                                                        <div style={{ fontSize:'.7rem', color:'var(--text-3)' }}>ID: {u.id}</div>
                                                    </td>
                                                    <td style={{ padding:'.75rem 1rem', color:'var(--text-2)' }}>{u.email}</td>
                                                    <td style={{ padding:'.75rem 1rem' }}>
                                                        <span className={`badge ${u.role === 'INSTRUCTOR' ? 'badge-blue' : 'badge-amber'}`} style={{ fontSize:'.65rem' }}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding:'.75rem 1rem', textAlign:'center' }}>
                                                        <div style={{ display:'flex', gap:'.5rem', justifyContent:'center' }}>
                                                            {u.role === 'STUDENT' ? (
                                                                <button onClick={() => handleRoleUpdate(u.id, 'INSTRUCTOR')}
                                                                    className="btn btn-indigo"
                                                                    style={{ padding:'.35rem .6rem', borderRadius:6, fontSize:'.75rem' }}>
                                                                    Promote
                                                                </button>
                                                            ) : (
                                                                <button onClick={() => handleRoleUpdate(u.id, 'STUDENT')}
                                                                    className="btn btn-ghost"
                                                                    style={{ padding:'.35rem .6rem', borderRadius:6, fontSize:'.75rem', color:'#d97706', borderColor:'rgba(217,119,6,.3)' }}>
                                                                    Demote
                                                                </button>
                                                            )}
                                                            <button onClick={() => handleDeleteUser(u.id)}
                                                                className="btn btn-danger" 
                                                                style={{ padding:'.35rem .6rem', borderRadius:6, fontSize:'.75rem' }}>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;
