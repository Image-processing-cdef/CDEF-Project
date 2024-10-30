import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./Pages/Root/Home";
import Auth from "./Pages/Auth/Auth";
import { getUserData } from "./utils/appwrite";
import { Models } from "appwrite";

function App() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUserData();
      if (user) setUser(user);
      setLoading(false); // Set loading to false once data is fetched
    };
    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>; // Display loading indicator until checkUser is complete

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Home /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/auth/*"
        element={!user ? <Auth /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
