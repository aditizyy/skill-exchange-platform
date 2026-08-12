import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
          Peer-to-Peer Skill Sharing
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight">
          Exchange Skills, <span className="text-indigo-600">Grow Together</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with people who want to learn what you know, and teach what you want to learn. No money involved—just knowledge sharing.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-colors text-lg"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors text-lg"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}