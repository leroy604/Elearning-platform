const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_BASE = 'http://localhost:8080/api';
const DUMMY_PDF_PATH = path.join(__dirname, 'dummy_lesson.pdf');

async function run() {
    try {
        if (!fs.existsSync(DUMMY_PDF_PATH)) {
            console.error('Error: dummy_lesson.pdf not found in the root directory.');
            return;
        }

        const courses = (await axios.get(`${API_BASE}/courses`)).data;
        console.log(`Checking lessons for ${courses.length} courses...`);

        for (const course of courses) {
            const lessons = (await axios.get(`${API_BASE}/courses/${course.id}/lessons`)).data;
            const currentCount = lessons.length;
            console.log(`Course: ${course.title} (ID: ${course.id}) - Current Lessons: ${currentCount}`);

            if (currentCount < 4) {
                const missingCount = 4 - currentCount;
                console.log(`Adding ${missingCount} lessons...`);

                for (let i = 1; i <= missingCount; i++) {
                    const form = new FormData();
                    form.append('title', `Deep Dive: ${course.title} Part ${currentCount + i}`);
                    form.append('file', fs.createReadStream(DUMMY_PDF_PATH));

                    await axios.post(`${API_BASE}/courses/${course.id}/lessons`, form, {
                        headers: form.getHeaders()
                    });
                    console.log(`✓ Lesson ${currentCount + i} uploaded.`);
                }
            }
        }
        console.log('Finalization: All courses now have at least 4 lessons.');
    } catch (err) {
        console.error('Error during lesson population:', err.message);
        if (err.response) console.error('Response data:', err.response.data);
    }
}

run();
