import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
        {isLogin ? <Login toggleForm={toggleForm} /> : <Register toggleForm={toggleForm} />}
      </div>
    </div>
  );
}
