import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
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
            <Route path="/exam/:examId" element={
              <ProtectedRoute>
                <Exam />
              </ProtectedRoute>
            } />
            <Route path="/payment/:enrollmentId" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />
            <Route path="/course/:courseId/dashboard" element={
              <ProtectedRoute>
                <CourseDashboard />
              </ProtectedRoute>
            } />
            <Route path="/instructor-dashboard" element={
              <ProtectedRoute requireInstructor>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;