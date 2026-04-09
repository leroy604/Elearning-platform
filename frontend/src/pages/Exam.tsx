import { useParams } from 'react-router-dom';

const Exam = () => {
  const { examId } = useParams();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Exam Session</h1>
          <p className="text-white/70 text-lg">Exam ID: <span className="font-semibold text-indigo-300">#{examId}</span></p>
        </div>

        {/* Exam Interface */}
        <div className="card-glass p-8">
          <div className="text-center space-y-6">
            {/* Timer */}
            <div className="inline-flex items-center space-x-4 bg-indigo-500/20 px-6 py-3 rounded-2xl border border-indigo-400/30">
              <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
              <div>
                <div className="text-2xl font-bold text-white">45:00</div>
                <div className="text-sm text-indigo-200">Time Remaining</div>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/70">
                <span>Progress</span>
                <span>0 / 20 Questions</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full w-0 transition-all duration-500"></div>
              </div>
            </div>

            {/* Exam Content Placeholder */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Exam Interface Ready</h3>
                <p className="text-white/70 mb-6">
                  Your exam questions will appear here. Each question will have multiple choice options,
                  and you'll need to select the correct answer before moving to the next one.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="text-indigo-300 font-semibold mb-1">📝 Multiple Choice</div>
                    <div className="text-white/70 text-sm">Select the best answer</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="text-indigo-300 font-semibold mb-1">⏱️ Timed Session</div>
                    <div className="text-white/70 text-sm">45 minutes to complete</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="text-indigo-300 font-semibold mb-1">🎯 Auto-Graded</div>
                    <div className="text-white/70 text-sm">Instant results</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary px-8 py-3">
                🚀 Start Exam
              </button>
              <button className="btn-secondary px-8 py-3">
                📋 Review Instructions
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-center text-white/50 text-sm space-y-1">
              <p>📊 Answers are automatically saved as you progress</p>
              <p>🔒 Exam session is monitored and secure</p>
              <p>📈 Results will be available immediately after submission</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;