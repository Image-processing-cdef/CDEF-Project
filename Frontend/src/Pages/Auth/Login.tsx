import { useState } from "react";
import { login } from "../../utils/appwrite";

interface LoginProps {
  toggleForm: () => void;
}

export default function Login({ toggleForm }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and include a number and a special character.");
      return;
    }

    setIsLoading(true);
    setError(null);
  
    try {
      const account = await login(email, password);
      if (account) {
        window.location.href = '/'; // Force a full page reload
      } else {
        setError("Failed to log in. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-700 border border-gray-600 p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
          disabled={isLoading}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-700 border border-gray-600 p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
          disabled={isLoading}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-200 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="text-gray-400 mt-4 text-center">
        Not registered? <button onClick={toggleForm} className="text-blue-500">Sign Up</button>
      </div>
    </>
  );
}