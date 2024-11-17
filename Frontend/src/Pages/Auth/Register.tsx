import { FormEvent, useState } from "react";
import { register, login } from "../../utils/appwrite"; 


interface RegisterProps {
  toggleForm: () => void;
}

export default function Register({ toggleForm }: RegisterProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
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

    setIsLoading(true);
    setError(null);

    try {
      const account = await register(email, password);
      if (account) {
        const loggedInAccount = await login(email, password);
        if (loggedInAccount) {
          window.location.href = '/'; // Force a full page reload
        } else {
          setError("Account created, but login failed. Please log in manually.");
          toggleForm();
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-gray-700 border border-gray-600 p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
          disabled={isLoading}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-200 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <div className="text-gray-400 mt-4 text-center">
        Already have an account? <button onClick={toggleForm} className="text-blue-500">Login</button>
      </div>
    </>
  );
}