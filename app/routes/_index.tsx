// app/routes/index.tsx
import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to the App</h1>
        <p className="text-gray-600">Choose an action below to get started.</p>
        <div className="space-y-2">
          <Link
            to="/login"
            className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
