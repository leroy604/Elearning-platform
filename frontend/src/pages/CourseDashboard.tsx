import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

interface Course {
    id: number;
    title: string;
    description: string;
    instructor: string;
}

const CourseDashboard = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'exam'>('overview');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axiosClient.get(`/courses/${courseId}`);
                setCourse(res.data);
            } catch (err) {
                console.error('Failed to fetch course', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="spinner"></div></div>;
    if (!course) return <div className="text-center py-20 text-white">Course not found</div>;

    const lessons = [
        { id: 1, title: 'Introduction to the Course', duration: '10:00', completed: true },
        { id: 2, title: 'Foundational Concepts', duration: '15:30', completed: true },
        { id: 3, title: 'Advanced Techniques', duration: '22:15', completed: false },
        { id: 4, title: 'Real-world Applications', duration: '18:45', completed: false },
        { id: 5, title: 'Final Project Preparation', duration: '12:00', completed: false },
    ];

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="relative mb-12 p-8 rounded-3xl overflow-hidden animate-fade-in">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 backdrop-blur-3xl z-0"></div>
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <nav className="flex mb-4 text-sm text-white/50 space-x-2">
                                    <Link to="/" className="hover:text-white transition-colors">Courses</Link>
                                    <span>/</span>
                                    <span className="text-white/80">{course.title}</span>
                                </nav>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                                    {course.title}
                                </h1>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 rounded-lg bg-blue-500/30 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold text-[10px]">
                                            {course.instructor?.charAt(0)}
                                        </div>
                                        <span className="text-white/70 font-medium">{course.instructor}</span>
                                    </div>
                                    <div className="h-4 w-[1px] bg-white/20"></div>
                                    <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2 py-1 rounded-md border border-blue-500/30 uppercase tracking-wider">
                                        Active Enrollment
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Navigation */}
                <div className="flex space-x-1 p-1 bg-white/5 rounded-2xl mb-8 border border-white/10 max-w-md">
                    {(['overview', 'lessons', 'exam'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 capitalize ${
                                activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Content Column */}
                    <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
                        {activeTab === 'overview' && (
                            <div className="card-glass p-8 space-y-6">
                                <h3 className="text-2xl font-bold text-white">About this course</h3>
                                <p className="text-white/70 text-lg leading-relaxed">
                                    {course.description}
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                                        <div className="text-2xl mb-1">⏰</div>
                                        <div className="text-white font-bold">12 Hours</div>
                                        <div className="text-white/40 text-xs">Duration</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                                        <div className="text-2xl mb-1">📚</div>
                                        <div className="text-white font-bold">5 Modules</div>
                                        <div className="text-white/40 text-xs">Content</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                                        <div className="text-2xl mb-1">📜</div>
                                        <div className="text-white font-bold">Certificate</div>
                                        <div className="text-white/40 text-xs">Included</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                                        <div className="text-2xl mb-1">🤝</div>
                                        <div className="text-white font-bold">Lifetime</div>
                                        <div className="text-white/40 text-xs">Access</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'lessons' && (
                            <div className="card-glass p-0 overflow-hidden">
                                <div className="p-8 border-b border-white/10">
                                    <h3 className="text-2xl font-bold text-white">Course Curriculum</h3>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {lessons.map((lesson) => (
                                        <div key={lesson.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                                                    lesson.completed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/10 text-white/40 border border-white/10'
                                                }`}>
                                                    {lesson.completed ? '✓' : lesson.id}
                                                </div>
                                                <div>
                                                    <h4 className={`font-semibold ${lesson.completed ? 'text-white/90' : 'text-white/70'}`}>{lesson.title}</h4>
                                                    <div className="text-xs text-white/40">{lesson.duration}</div>
                                                </div>
                                            </div>
                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 text-sm font-bold hover:underline">
                                                Play Lesson
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'exam' && (
                            <div className="card-glass p-12 text-center space-y-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-600/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-white">Ready for the Exam?</h3>
                                <p className="text-white/60 max-w-md mx-auto">
                                    Test your knowledge and earn your certification for {course.title}. 
                                    You'll need a score of 80% or higher to pass.
                                </p>
                                <div className="pt-4">
                                    <Link to={`/exam/${course.id}`} className="btn-primary px-12 py-4 text-lg inline-block">
                                        🚀 Start Exam Now
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">
                        <div className="card-glass p-6">
                            <h4 className="text-white font-bold mb-4 flex items-center space-x-2">
                                <span className="text-blue-400">📊</span>
                                <span>Your Progress</span>
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Completion</span>
                                    <span className="text-white font-bold">40%</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-3 border border-white/10">
                                    <div className="bg-blue-500 h-3 rounded-full w-[40%] shadow-[0_0_12px_rgba(59,130,246,0.5)]"></div>
                                </div>
                                <p className="text-xs text-white/40 italic">
                                    Complete 3 more lessons to unlock the final exam.
                                </p>
                            </div>
                        </div>

                        <div className="card-glass p-6">
                            <h4 className="text-white font-bold mb-4 flex items-center space-x-2">
                                <span className="text-blue-400">👤</span>
                                <span>Instructor</span>
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg border border-white/20">
                                        👩‍🏫
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">{course.instructor}</div>
                                        <div className="text-white/40 text-xs text-blue-400">Senior Instructor</div>
                                    </div>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Expert in the field with over 10 years of professional experience. 
                                    David is passionate about teaching complex concepts in an easy-to-understand way.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDashboard;
