import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    instructor: string;
}

const InstructorDashboard = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    
    // New Course Form State
    const [courseForm, setCourseForm] = useState({
        title: '',
        description: '',
        price: 0,
        category: 'Technology',
        level: 'BEGINNER',
        duration: 5,
        language: 'English'
    });

    // Exam Form State
    const [examForm, setExamForm] = useState({
        courseId: '',
        title: '',
        description: '',
        duration: 60,
        totalQuestions: 10,
        passingScore: 80
    });

    useEffect(() => {
        const fetchCourses = async () => {
            if (!user?.id) return;
            try {
                // Fetch courses created by this instructor
                const res = await axiosClient.get(`/courses/instructor/${user.id}`);
                setCourses(res.data);
            } catch (err) {
                console.error('Failed to fetch instructor courses', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [user?.id]);

    const handleCourseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post('/courses', {
                ...courseForm,
                instructor: `${user?.firstName} ${user?.lastName}`,
                instructorId: user?.id
            });
            alert('🚀 Course Launched Successfully!');
            setCourses([...courses, res.data]);
            setCourseForm({
                title: '',
                description: '',
                price: 0,
                category: 'Technology',
                level: 'BEGINNER',
                duration: 5,
                language: 'English'
            });
        } catch (err) {
            console.error('Failed to create course', err);
            alert('❌ Failed to launch course');
        }
    };

    const handleExamSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!examForm.courseId) {
            alert('Please select a course for the exam');
            return;
        }
        try {
            await axiosClient.post('/api/exams', {
                ...examForm,
                courseId: Number(examForm.courseId)
            });
            alert('📝 Exam Set Successfully!');
            setExamForm({
                courseId: '',
                title: '',
                description: '',
                duration: 60,
                totalQuestions: 10,
                passingScore: 80
            });
        } catch (err) {
            console.error('Failed to create exam', err);
            alert('❌ Failed to set exam');
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Header */}
                <header className="animate-fade-in">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Instructor Dashboard</h1>
                    <p className="text-white/60">Manage your courses, students, and curriculum from one place.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Left Column: Create Content */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* Course Creation Form */}
                        <section className="card-glass animate-fade-in-up">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <span className="bg-blue-500/20 p-2 rounded-lg mr-3">🚀</span>
                                Launch a New Course
                            </h2>
                            <form onSubmit={handleCourseSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-white/50 ml-1">COURSE TITLE</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Master React in 30 Days" 
                                        className="form-input"
                                        value={courseForm.title}
                                        onChange={e => setCourseForm({...courseForm, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-white/50 ml-1">DESCRIPTION</label>
                                    <textarea 
                                        placeholder="What will students learn?" 
                                        className="form-input min-h-[120px] pt-3"
                                        value={courseForm.description}
                                        onChange={e => setCourseForm({...courseForm, description: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-white/50 ml-1">PRICE ($)</label>
                                    <input 
                                        type="number" 
                                        className="form-input"
                                        value={courseForm.price}
                                        onChange={e => setCourseForm({...courseForm, price: Number(e.target.value)})}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-white/50 ml-1">LEVEL</label>
                                    <select 
                                        className="form-input"
                                        value={courseForm.level}
                                        onChange={e => setCourseForm({...courseForm, level: e.target.value})}
                                    >
                                        <option value="BEGINNER">Beginner</option>
                                        <option value="INTERMEDIATE">Intermediate</option>
                                        <option value="ADVANCED">Advanced</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="btn-primary w-full py-4 text-lg font-bold">
                                        ✨ Create Course
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Exam Creation Form */}
                        <section className="card-glass animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <span className="bg-purple-500/20 p-2 rounded-lg mr-3">📝</span>
                                Set a Course Exam
                            </h2>
                            <form onSubmit={handleExamSubmit} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-white/50 ml-1">SELECT COURSE</label>
                                    <select 
                                        className="form-input"
                                        value={examForm.courseId}
                                        onChange={e => setExamForm({...examForm, courseId: e.target.value})}
                                        required
                                    >
                                        <option value="">-- Choose a course --</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-white/50 ml-1">EXAM TITLE</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Final Certification Exam"
                                            className="form-input"
                                            value={examForm.title}
                                            onChange={e => setExamForm({...examForm, title: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-white/50 ml-1">DURATION (MINUTES)</label>
                                        <input 
                                            type="number" 
                                            className="form-input"
                                            value={examForm.duration}
                                            onChange={e => setExamForm({...examForm, duration: Number(e.target.value)})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-white/50 ml-1">TOTAL QUESTIONS</label>
                                        <input 
                                            type="number" 
                                            className="form-input"
                                            value={examForm.totalQuestions}
                                            onChange={e => setExamForm({...examForm, totalQuestions: Number(e.target.value)})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-white/50 ml-1">PASSING SCORE (%)</label>
                                        <input 
                                            type="number" 
                                            className="form-input"
                                            value={examForm.passingScore}
                                            onChange={e => setExamForm({...examForm, passingScore: Number(e.target.value)})}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-xl w-full hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                                    🏷️ Set Exam
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* Right Column: List & Stats */}
                    <div className="space-y-10">
                        <section className="card-glass animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <h3 className="text-xl font-bold text-white mb-6">Your Courses</h3>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="flex justify-center py-10"><div className="spinner"></div></div>
                                ) : courses.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className="text-white/40 italic">No courses created yet.</p>
                                    </div>
                                ) : (
                                    courses.map(c => (
                                        <div key={c.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all group">
                                            <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{c.title}</h4>
                                            <div className="flex justify-between mt-2 text-xs">
                                                <span className="text-white/40">${c.price}</span>
                                                <span className="text-blue-300">Active</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Quick Stats */}
                        <section className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="card-glass p-6 text-center">
                                <div className="text-2xl font-bold text-white">{courses.length}</div>
                                <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Courses</div>
                            </div>
                            <div className="card-glass p-6 text-center">
                                <div className="text-2xl font-bold text-green-400">0</div>
                                <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Students</div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;
