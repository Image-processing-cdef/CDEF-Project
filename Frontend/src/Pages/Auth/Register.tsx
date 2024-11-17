import { FormEvent, useState } from "react";
import { register, login } from "../../utils/appwrite"; // Import login function
import { useNavigate } from "react-router-dom";

interface RegisterProps {
  toggleForm: () => void;
}

export default function Register({ toggleForm }: RegisterProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and include a number and a special character.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const account = await register(email, password);
      if (account) {
        alert(`Successfully created account with ID: ${account?.$id}`);
    
        // Automatically log in the user after successful registration
        const loggedInAccount = await login(email, password);
        if (loggedInAccount) {
          navigate("/"); // Navigate to Home after login
        } else {
          setError("Account created, but login failed. Please log in manually.");
        }
      }
    } catch (err) {
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-700 border border-gray-600 p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-700 border border-gray-600 p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-gray-700 border border-gray-600 p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-200"
        >
          Sign Up
        </button>
      </form>
      <div className="text-gray-400 mt-4 text-center">
        Already have an account? <button onClick={toggleForm} className="text-blue-500">Login</button>
      </div>
    </>
  );
}
