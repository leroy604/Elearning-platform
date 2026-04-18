const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_URL = 'http://localhost:8080/api';

const INSTRUCTORS = [
    { name: 'Lucie', id: 101 },
    { name: 'Leroy', id: 102 },
    { name: 'Guy', id: 103 },
    { name: 'Junior', id: 104 },
    { name: 'Emma', id: 105 }
];

const COURSES = [
    { title: "Advanced React & Next.js", desc: "Master modern web development.", cat: "Web", lvl: "ADVANCED", instIdx: 0 },
    { title: "Spring Boot Microservices", desc: "Build resilient backends.", cat: "Backend", lvl: "INTERMEDIATE", instIdx: 1 },
    { title: "Complete DevOps Bootcamp", desc: "Docker, Kubernetes, CI/CD pipelines.", cat: "DevOps", lvl: "BEGINNER", instIdx: 2 },
    { title: "Python for Data Science", desc: "Pandas, NumPy, and Scikit-Learn.", cat: "Data", lvl: "INTERMEDIATE", instIdx: 3 },
    { title: "Artificial Intelligence Foundations", desc: "Neural networks & ML basics.", cat: "AI", lvl: "ADVANCED", instIdx: 4 },
    { title: "iOS Development with Swift", desc: "Build native Apple experiences.", cat: "Mobile", lvl: "BEGINNER", instIdx: 0 },
    { title: "Mastering PostgreSQL", desc: "Advanced queries & optimizations.", cat: "Database", lvl: "INTERMEDIATE", instIdx: 1 },
    { title: "AWS Cloud Practitioner", desc: "Pass your certification.", cat: "Cloud", lvl: "BEGINNER", instIdx: 2 },
    { title: "Flutter multi-platform", desc: "Write once, run everywhere apps.", cat: "Mobile", lvl: "INTERMEDIATE", instIdx: 3 },
    { title: "Ethical Hacking & Security", desc: "Protect against modern threats.", cat: "Security", lvl: "ADVANCED", instIdx: 4 }
];

// Helper to wait
const delay = ms => new Promise(res => setTimeout(res, ms));

async function seed() {
    console.log("--- STARTING MASSIVE SEED ---");

    // 1. Ensure dummy file exists for lesson uploads
    const dummyPdf = path.join(__dirname, 'dummy_lesson.pdf');
    if (!fs.existsSync(dummyPdf)) {
        fs.writeFileSync(dummyPdf, "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
    }

    let createdCourses = [];

    // 2. Create courses
    for (let i = 0; i < COURSES.length; i++) {
        const c = COURSES[i];
        const inst = INSTRUCTORS[c.instIdx];
        
        try {
            const res = await axios.post(`${API_URL}/courses`, {
                title: c.title,
                description: c.desc,
                price: Math.floor(Math.random() * 50) + 19,
                instructor: inst.name,
                instructorId: inst.id,
                category: c.cat,
                level: c.lvl,
                duration: 20,
                language: 'English'
            });
            console.log(`[COURSE] Created: ${res.data.title}`);
            createdCourses.push(res.data);
        } catch (e) {
            console.error(`[COURSE ERROR] ${c.title}`, e.response?.data || e.message);
        }
    }

    // 3. For each course, add lessons + exam + questions
    for (const course of createdCourses) {
        // A) Lessons (5 per course)
        for (let idx = 1; idx <= 5; idx++) {
            try {
                const fd = new FormData();
                fd.append('title', `Module ${idx}: Important Concepts`);
                fd.append('file', fs.createReadStream(dummyPdf));
                
                await axios.post(`${API_URL}/courses/${course.id}/lessons`, fd, {
                    headers: fd.getHeaders()
                });
                console.log(`[LESSON] Added Mod ${idx} -> ${course.title}`);
            } catch (e) {
                console.error(`[LESSON ERROR] ${course.title}`, e.response?.data || e.message);
            }
        }

        // B) Create Exam (40 minutes lapse time)
        let exam = null;
        try {
            const exRes = await axios.post(`${API_URL}/exams`, {
                courseId: course.id,
                title: `Final Exam: ${course.title}`,
                description: `Comprehensive 30-question exam for ${course.title}`,
                duration: 40,
                totalQuestions: 30,
                passingScore: 70
            });
            exam = exRes.data;
            console.log(`[EXAM] Created Exam ID ${exam.id} -> ${course.title}`);
        } catch (e) {
            console.error(`[EXAM ERROR] -> ${course.title}`, e.response?.data || e.message);
            continue; // Can't add questions without exam
        }

        // C) Questions (30 per exam)
        if (exam) {
            console.log(`[QUESTIONS] Pumping 30 questions for Exam ${exam.id}...`);
            let qsPromises = [];
            for (let q = 1; q <= 30; q++) {
                qsPromises.push(axios.post(`${API_URL}/exams/${exam.id}/questions`, {
                    content: `Sample multi-choice question #${q} testing your knowledge on ${course.title}.`,
                    options: [
                        `Answer Option A for Q${q}`,
                        `Answer Option B for Q${q}`,
                        `Answer Option C for Q${q}`,
                        `Answer Option D for Q${q}`
                    ],
                    correctAnswerIndex: Math.floor(Math.random() * 4) // 0 to 3
                }));
            }
            try {
                await Promise.all(qsPromises);
                console.log(`[QUESTIONS] Successfully added 30 qs!`);
            } catch (e) {
                console.error(`[QUESTIONS ERROR]`, e.response?.data || e.message);
            }
        }
    }

    console.log("--- SEEDING COMPLETE! ---");
}

seed();
