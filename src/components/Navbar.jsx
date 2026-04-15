import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        Place<span className="text-gray-800">AI</span>
      </Link>
      <div className="flex gap-4 items-center">
        <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">Home</Link>
        <Link to="/companies" className="text-gray-600 hover:text-indigo-600 font-medium">Companies</Link>
        <Link to="/chat" className="text-gray-600 hover:text-indigo-600 font-medium">AI Chat</Link>
        <Link to="/dashboard-home" className="text-gray-600 hover:text-indigo-600 font-medium">Dashboard</Link>
        <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition">Login</Link>
      </div>
    </nav>
  )
}