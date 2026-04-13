import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

interface ExamData {
    id: number;
    title: string;
    description: string;
    duration: number;
    totalQuestions: number;
    passingScore: number;
}

const Exam = () => {
    const { examId } = useParams(); // Note: This is currently passed as courseId from dashboard
    const navigate = useNavigate();
    const [exam, setExam] = useState<ExamData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isStarted, setIsStarted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const mockQuestions = [
        {
            id: 1,
            question: "Which of the following describes a 'Component' in modern web frameworks?",
            options: [
                "A script that runs on the server only",
                "A reusable, independent piece of UI",
                "A database table definition",
                "A styling rule for a specific browser"
            ],
            correct: "A reusable, independent piece of UI"
        },
        {
            id: 2,
            question: "What is the primary purpose of 'State' in a frontend application?",
            options: [
                "To store static assets like images",
                "To track the physical location of the user",
                "To manage data that changes over time and affects UI",
                "To define the global CSS variables"
            ],
            correct: "To manage data that changes over time and affects UI"
        },
        {
            id: 3,
            question: "What does 'API' stand for in software development?",
            options: [
                "Advanced Programming Insight",
                "Application Process Integration",
                "Automated Protocol Interface",
                "Application Programming Interface"
            ],
            correct: "Application Programming Interface"
        }
    ];

    useEffect(() => {
        const fetchExam = async () => {
            try {
                // Fetch exams for this course
                const res = await axiosClient.get(`/exams/course/${examId}`);
                if (res.data && res.data.length > 0) {
                    setExam(res.data[0]); // Take the first exam found
                }
            } catch (err) {
                console.error('Failed to fetch exam', err);
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [examId]);

    const handleAnswer = (questionId: number, option: string) => {
        setAnswers({ ...answers, [questionId]: option });
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;

    if (!exam) return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card-glass p-12 text-center max-w-md">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-white mb-2">No Exam Found</h2>
                <p className="text-white/60 mb-8">The instructor hasn't set an exam for this course yet.</p>
                <button onClick={() => navigate(-1)} className="btn-secondary w-full">Go Back</button>
            </div>
        </div>
    );

    if (isSubmitted) {
        const score = mockQuestions.filter(q => answers[q.id] === q.correct).length;
        const passed = (score / mockQuestions.length) * 100 >= (exam.passingScore || 80);

        return (
            <div className="min-h-screen py-12 px-4 flex items-center justify-center">
                <div className="max-w-md w-full animate-fade-in text-center space-y-8">
                    <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-2xl ${
                        passed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                        {passed ? '🎉' : '❌'}
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-white mb-2">
                            {passed ? 'Congratulations!' : 'Keep Practicing!'}
                        </h1>
                        <p className="text-white/60">
                            You scored <span className="text-white font-bold">{score} / {mockQuestions.length}</span> on the {exam.title}
                        </p>
                    </div>
                    <div className="card-glass p-8 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/60">Required Score</span>
                            <span className="text-white font-bold">{exam.passingScore}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/60">Your Score</span>
                            <span className="text-white font-bold">{Math.round((score / mockQuestions.length) * 100)}%</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate(`/course/${examId}/dashboard`)} 
                        className="btn-primary w-full py-4 text-lg"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (isStarted) {
        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    <header className="flex justify-between items-end">
                        <div className="space-y-1">
                            <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest">{exam.title}</h2>
                            <h1 className="text-3xl font-extrabold text-white">Question {currentStep + 1} <span className="text-white/20">/ {mockQuestions.length}</span></h1>
                        </div>
                        <div className="text-right">
                            <div className="text-white text-2xl font-mono leading-none">{exam.duration}:00</div>
                            <div className="text-white/40 text-[10px] uppercase font-bold tracking-tighter">Time Remaining</div>
                        </div>
                    </header>

                    <div className="card-glass p-8 md:p-12 space-y-10">
                        <h3 className="text-xl md:text-2xl text-white font-medium leading-relaxed">
                            {mockQuestions[currentStep].question}
                        </h3>

                        <div className="space-y-4">
                            {mockQuestions[currentStep].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(mockQuestions[currentStep].id, option)}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                                        answers[mockQuestions[currentStep].id] === option
                                            ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-xs font-bold ${
                                            answers[mockQuestions[currentStep].id] === option
                                                ? 'bg-blue-400 border-blue-400 text-blue-900'
                                                : 'border-white/20 text-white/40'
                                        }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        {option}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="pt-8 flex justify-between gap-4">
                            <button
                                disabled={currentStep === 0}
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="px-8 py-3 rounded-xl bg-white/5 text-white/70 font-bold border border-white/10 disabled:opacity-20"
                            >
                                Previous
                            </button>
                            {currentStep < mockQuestions.length - 1 ? (
                                <button
                                    onClick={() => setCurrentStep(prev => prev + 1)}
                                    className="btn-primary px-12 py-3"
                                >
                                    Next Question
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold px-12 py-3 rounded-xl shadow-lg shadow-green-600/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Submit Exam
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 flex items-center justify-center">
            <div className="max-w-xl w-full text-center space-y-10 animate-fade-in">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20"></div>
                    <div className="relative mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 border border-blue-400/30">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">{exam.title}</h1>
                    <p className="text-white/60 text-lg max-w-md mx-auto">{exam.description || "Take this exam to earn your certificate."}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="card-glass p-4 bg-white/5">
                        <div className="text-2xl mb-1">⏱️</div>
                        <div className="text-white font-bold">{exam.duration}m</div>
                        <div className="text-white/40 text-[10px] uppercase font-bold">Time Limit</div>
                    </div>
                    <div className="card-glass p-4 bg-white/5">
                        <div className="text-2xl mb-1">🎯</div>
                        <div className="text-white font-bold">{exam.passingScore}%</div>
                        <div className="text-white/40 text-[10px] uppercase font-bold">Pass Mark</div>
                    </div>
                    <div className="card-glass p-4 bg-white/5 md:col-span-1 col-span-2">
                        <div className="text-2xl mb-1">📝</div>
                        <div className="text-white font-bold">{mockQuestions.length}</div>
                        <div className="text-white/40 text-[10px] uppercase font-bold">Questions</div>
                    </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl">
                    <div className="flex items-start space-x-4 text-left">
                        <span className="text-yellow-400 text-xl font-bold">⚠️</span>
                        <p className="text-yellow-200/70 text-sm">
                            Once you start, the timer will begin. Ensure you have a stable internet connection. 
                            You cannot pause the exam once it has started.
                        </p>
                    </div>
                </div>

                <div className="pt-4 space-y-4">
                    <button 
                        onClick={() => setIsStarted(true)} 
                        className="btn-primary w-full py-5 text-xl font-extrabold shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40"
                    >
                        Start My Exam Now 🚀
                    </button>
                    <button onClick={() => navigate(-1)} className="text-white/40 hover:text-white transition-colors font-medium">
                        Cancel and Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Exam;