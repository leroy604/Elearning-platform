import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import Exam from './pages/Exam';
import Payment from './pages/Payment';
import CourseDashboard from './pages/CourseDashboard';
import InstructorDashboard from './pages/InstructorDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Courses />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/exam/:examId" element={<Exam />} />
            <Route path="/payment/:enrollmentId" element={<Payment />} />
            <Route path="/course/:courseId/dashboard" element={<CourseDashboard />} />
            <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;