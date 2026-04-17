import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface Question { id:number; examId:number; content:string; options:string[]; }
interface ExamInfo  { id:number; title:string; duration:number; totalQuestions:number; passingScore:number; }
interface ExamResult { examId:number; totalQuestions:number; correctAnswers:number; scorePercentage:number; passed:boolean; }
interface jsPDFWithPlugin extends jsPDF { autoTable:(options:any) => jsPDF; }

const Exam = () => {
    const { examId } = useParams();
    const [exam, setExam]         = useState<ExamInfo|null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers]   = useState<Record<number,number>>({});
    const [result, setResult]     = useState<ExamResult|null>(null);
    const [loading, setLoading]   = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [phase, setPhase]       = useState<'preview'|'taking'|'result'>('preview');
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentQ, setCurrentQ] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const [examRes, qRes] = await Promise.all([
                    axiosClient.get(`/exams/${examId}`),
                    axiosClient.get(`/exams/${examId}/questions`)
                ]);
                setExam(examRes.data);
                setQuestions(qRes.data);
                setTimeLeft(examRes.data.duration * 60);
            } catch (err) { console.error('Failed to fetch exam', err); }
            finally { setLoading(false); }
        };
        fetchExam();
    }, [examId]);

    const startExam = () => {
        setPhase('taking');
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { clearInterval(timerRef.current!); handleSubmit(); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSubmit = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setSubmitting(true);
        try {
            const res = await axiosClient.post(`/exams/${examId}/submit`, { answers });
            setResult(res.data); setPhase('result');
        } catch { alert('Failed to submit. Please try again.'); }
        finally { setSubmitting(false); }
    };

    const exportPDF = () => {
        if (!exam || !questions.length) return;
        const doc = new jsPDF() as jsPDFWithPlugin;
        doc.setFontSize(18); doc.text(`${exam.title} — Questions`, 14, 22);
        doc.setFontSize(10); doc.setTextColor(100);
        doc.text(`Duration: ${exam.duration} min  |  Questions: ${questions.length}`, 14, 30);
        doc.autoTable({
            startY:38, head:[['#','Question','Options']],
            body: questions.map((q,i) => [i+1, q.content, q.options.join('\n')]),
            theme:'grid', headStyles:{ fillColor:[37,99,235] },
            columnStyles:{ 0:{cellWidth:10}, 1:{cellWidth:100}, 2:{cellWidth:70} }
        });
        doc.save(`${exam.title.replace(/\s+/g,'_')}_Questions.pdf`);
    };

    const fmt = (s:number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

    if (loading) return (
        <div className="center-screen">
            <div className="spinner" style={{ width:32, height:32, borderWidth:3 }} />
        </div>
    );

    if (!exam) return (
        <div className="center-screen">
            <div className="card-glass" style={{ textAlign:'center', padding:'3rem', maxWidth:420 }}>
                <svg width="40" height="40" fill="none" stroke="var(--text-3)" viewBox="0 0 24 24" style={{ margin:'0 auto 1rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p style={{ color:'var(--text-2)', marginBottom:'1.5rem' }}>Exam not found.</p>
                <Link to="/" className="btn btn-primary">Back to Courses</Link>
            </div>
        </div>
    );

    /* ── RESULT ── */
    if (phase === 'result' && result) {
        const passed = result.passed;
        const deg = result.scorePercentage * 3.6;
        const color = passed ? '#22c55e' : '#ef4444';
        return (
            <div className="center-screen" style={{ padding:'2rem 1.25rem' }}>
                <div style={{ maxWidth:480, width:'100%' }} className="animate-slide-up">
                    <div className="card-glass" style={{ textAlign:'center', padding:'2.5rem' }}>

                        {/* Badge */}
                        <div style={{ width:56, height:56, borderRadius:14, background:`${color}18`, border:`1px solid ${color}40`, display:'grid', placeItems:'center', margin:'0 auto 1.25rem' }}>
                            {passed
                                ? <svg width="26" height="26" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                : <svg width="26" height="26" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            }
                        </div>

                        <h2 style={{ fontSize:'1.75rem', fontWeight:800, color, marginBottom:'.4rem' }}>
                            {passed ? 'Congratulations!' : 'Keep Practicing!'}
                        </h2>
                        <p style={{ color:'var(--text-2)', marginBottom:'1.75rem' }}>
                            {passed ? 'You passed the exam and earned your certificate.' : 'You did not reach the passing score this time.'}
                        </p>

                        {/* Score ring */}
                        <div className="score-ring" style={{ marginBottom:'1.75rem', background:`conic-gradient(${color} ${deg}deg, rgba(255,255,255,.06) 0deg)`, borderRadius:'50%' }}>
                            <div className="score-ring-inner">
                                <span style={{ fontSize:'2rem', fontWeight:800, color:'var(--text)' }}>{result.scorePercentage}%</span>
                                <span style={{ fontSize:'.7rem', color:'var(--text-3)', marginTop:'.1rem' }}>Score</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'.75rem', marginBottom:'1.5rem' }}>
                            {[
                                { label:'Total', value: result.totalQuestions, col:'var(--text)' },
                                { label:'Correct', value: result.correctAnswers, col:'#34d399' },
                                { label:'Wrong', value: result.totalQuestions - result.correctAnswers, col:'#f87171' }
                            ].map(s => (
                                <div key={s.label} style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:10, padding:'.875rem .5rem' }}>
                                    <div style={{ fontSize:'1.5rem', fontWeight:800, color:s.col }}>{s.value}</div>
                                    <div style={{ fontSize:'.75rem', color:'var(--text-3)', marginTop:'.2rem' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display:'flex', flexWrap:'wrap', gap:'.75rem', justifyContent:'center' }}>
                            <Link to="/" className="btn btn-primary">Back to Courses</Link>
                            {!passed && (
                                <button className="btn btn-success" onClick={() => { setPhase('preview'); setAnswers({}); setCurrentQ(0); setTimeLeft(exam.duration*60); }}>
                                    Retry Exam
                                </button>
                            )}
                            <button className="btn btn-ghost" onClick={exportPDF}>
                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ── PREVIEW ── */
    if (phase === 'preview') {
        return (
            <div className="center-screen" style={{ padding:'2rem 1.25rem' }}>
                <div style={{ maxWidth:480, width:'100%' }} className="animate-slide-up">
                    <div className="card-glass" style={{ textAlign:'center', padding:'2.5rem' }}>
                        <div style={{ width:52, height:52, borderRadius:13, background:'rgba(37,99,235,.15)', border:'1px solid rgba(37,99,235,.3)', display:'grid', placeItems:'center', margin:'0 auto 1.25rem' }}>
                            <svg width="24" height="24" fill="none" stroke="#60a5fa" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--text)', marginBottom:'.4rem' }}>{exam.title}</h1>
                        <p style={{ color:'var(--text-2)', marginBottom:'1.75rem' }}>Review the details below before starting</p>

                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'.75rem', marginBottom:'1.75rem' }}>
                            {[
                                { icon:<svg width="18" height="18" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label:'Questions', value:`${questions.length}`, color:'#60a5fa' },
                                { icon:<svg width="18" height="18" fill="none" stroke="#818cf8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label:'Time Limit', value:`${exam.duration}m`, color:'#818cf8' },
                                { icon:<svg width="18" height="18" fill="none" stroke="#34d399" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label:'Pass Score', value:`${exam.passingScore}%`, color:'#34d399' }
                            ].map(s => (
                                <div key={s.label} style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:10, padding:'1rem .5rem' }}>
                                    <div style={{ display:'flex', justifyContent:'center', marginBottom:'.4rem' }}>{s.icon}</div>
                                    <div style={{ fontSize:'1.35rem', fontWeight:800, color:s.color }}>{s.value}</div>
                                    <div style={{ fontSize:'.7rem', color:'var(--text-3)', marginTop:'.15rem' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {questions.length === 0
                            ? <div style={{ padding:'.875rem 1rem', background:'rgba(217,119,6,.1)', border:'1px solid rgba(217,119,6,.25)', borderRadius:9, color:'#fbbf24', fontSize:'.875rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', marginBottom:'1.25rem' }}>
                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                No questions added yet
                              </div>
                            : <button className="btn btn-primary" style={{ width:'100%', padding:'.875rem', fontSize:'.95rem', marginBottom:'.75rem' }} onClick={startExam}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Start Exam
                              </button>
                        }
                        <button className="btn btn-ghost" style={{ width:'100%' }} onClick={exportPDF}>
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Export Question Sheet
                        </button>
                        <Link to="/" style={{ display:'block', marginTop:'1.25rem', color:'var(--text-3)', fontSize:'.875rem', textDecoration:'none' }}>← Back to Courses</Link>
                    </div>
                </div>
            </div>
        );
    }

    /* ── TAKING ── */
    const q = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;
    const isLowTime = timeLeft < 60;

    return (
        <div style={{ minHeight:'100vh', padding:'1.5rem 1.25rem' }}>
            <div style={{ maxWidth:720, margin:'0 auto' }} className="animate-fade-in">

                {/* Top bar */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                    <div style={{ color:'var(--text-2)', fontSize:'.875rem' }}>
                        Question <span style={{ fontWeight:700, color:'var(--text)' }}>{currentQ+1}</span> / {questions.length}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'.5rem', padding:'.45rem .9rem', borderRadius:9, fontWeight:700, fontSize:'1.05rem', background: isLowTime?'rgba(220,38,38,.15)':'rgba(255,255,255,.07)', border:`1px solid ${isLowTime?'rgba(220,38,38,.4)':'var(--border)'}`, color: isLowTime?'#f87171':'var(--text)' }}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {fmt(timeLeft)}
                    </div>
                </div>

                {/* Progress */}
                <div className="exam-progress" style={{ marginBottom:'1.5rem' }}>
                    <div className="exam-progress-bar" style={{ width:`${progress}%` }} />
                </div>

                {/* Question card */}
                <div className="card-glass" style={{ marginBottom:'1rem' }}>
                    <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:'var(--text)', lineHeight:1.6, marginBottom:'1.25rem' }}>{q.content}</h3>
                    <div style={{ display:'flex', flexDirection:'column', gap:'.625rem' }}>
                        {q.options.map((opt, idx) => {
                            const sel = answers[q.id] === idx;
                            const labels = ['A','B','C','D'];
                            return (
                                <button key={idx} className={`exam-option ${sel?'selected':''}`}
                                    onClick={() => setAnswers({ ...answers, [q.id]: idx })}>
                                    <span className="exam-option-label">{labels[idx]}</span>
                                    <span style={{ flex:1, textAlign:'left' }}>{opt}</span>
                                    {sel && <svg width="15" height="15" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Nav */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'.75rem' }}>
                    <button className="btn btn-ghost" disabled={currentQ===0}
                        onClick={() => setCurrentQ(Math.max(0, currentQ-1))}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Previous
                    </button>

                    <div style={{ display:'flex', gap:'.35rem', flexWrap:'wrap', justifyContent:'center' }}>
                        {questions.map((_,i) => (
                            <button key={i} onClick={() => setCurrentQ(i)}
                                className={`q-dot ${i===currentQ?'q-dot-current':answers[questions[i].id]!==undefined?'q-dot-answered':''}`}>
                                {i+1}
                            </button>
                        ))}
                    </div>

                    {currentQ < questions.length-1
                        ? <button className="btn btn-primary" onClick={() => setCurrentQ(Math.min(questions.length-1, currentQ+1))}>
                            Next <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </button>
                        : <button className="btn btn-success" disabled={submitting} onClick={handleSubmit}>
                            {submitting ? <><div className="spinner" />Submitting...</> : <><svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Submit Exam</>}
                          </button>
                    }
                </div>

                <p style={{ textAlign:'center', color:'var(--text-3)', fontSize:'.8rem', marginTop:'1rem' }}>
                    {Object.keys(answers).length} / {questions.length} answered
                </p>
            </div>
        </div>
    );
};

export default Exam;