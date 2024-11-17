import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./Pages/Root/Home";
import Auth from "./Pages/Auth/Auth";
import { getUserData } from "./utils/appwrite";
import { Models } from "appwrite";
import Result from "./Pages/Root/Result";
import { Loading } from "./Components/Loading";

function App() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getUserData();
        return user
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };
    checkUser().then((user) => {
      if (user) {
        setUser(user);
      }
      setLoading(false);
    }).catch(() => {console.error("Failed to fetch user data")});
  }, []);
  

  if (loading) {
    return (
      <div className="bg-gray-900 h-screen w-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Home /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/result/:id"
        element={user ? <Result /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/auth/*"
        element={!user ? <Auth /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
