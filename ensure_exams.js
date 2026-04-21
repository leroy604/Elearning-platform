const axios = require('axios');

const API_BASE = 'http://localhost:8080/api';

async function run() {
    try {
        const courses = (await axios.get(`${API_BASE}/courses`)).data;
        const exams = (await axios.get(`${API_BASE}/exams`)).data;
        const examCourseIds = exams.map(e => e.courseId);

        console.log(`Checking ${courses.length} courses...`);

        for (const course of courses) {
            if (!examCourseIds.includes(course.id)) {
                console.log(`Adding exam for: ${course.title} (ID: ${course.id})`);
                
                // Create Exam
                const examRes = await axios.post(`${API_BASE}/exams`, {
                    courseId: course.id,
                    title: `${course.title} Certification Exam`,
                    description: `Final assessment for ${course.title}. Test your knowledge and earn your certificate.`,
                    duration: 40,
                    totalQuestions: 5,
                    passingScore: 70
                });

                const examId = examRes.data.id;

                // Add 5 Questions
                const questions = [
                    { content: "What is the primary purpose of this technology?", options: ["Development", "Cooking", "Driving", "Gaming"], correctAnswerIndex: 0 },
                    { content: "Which of the following is a core concept?", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 0 },
                    { content: "How do you initialize a new project?", options: ["Command line", "Hand writing", "Asking someone", "Waiting"], correctAnswerIndex: 0 },
                    { content: "What is the most common error?", options: ["Logic", "Syntax", "Sleep", "Hunger"], correctAnswerIndex: 1 },
                    { content: "Why should you use this?", options: ["Efficiency", "Fun", "Requirement", "No reason"], correctAnswerIndex: 0 }
                ];

                for (const q of questions) {
                    await axios.post(`${API_BASE}/exams/${examId}/questions`, q);
                }
                console.log(`✓ Exam and 5 questions added.`);
            }
        }
    } catch (err) {
        console.error('Error during cleanup:', err.message);
    }
}

run();
