import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import "./index.css";
import "./app.css";
import Login2 from "./components/login2/Login2";
import AuthProvider from "./components/AuthProvider";

const App = () => {
  const { currentUser, setCurrentUser } = useUserStore();

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);  // Update currentUser in store
      } else {
        setCurrentUser(null);  // Clear currentUser in store if logged out
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setCurrentUser]);

  console.log("Current User:", currentUser);

  return (
    <Router>
      <AuthProvider>
        <div className="container">
          <Routes>
            <Route path="/register" element={<Login />} />
            <Route path="/" element={<Login2 />} />
            
            {/* Protected Routes */}
            <Route 
              path="/list" 
              element={<ProtectedRoute user={currentUser}><List /></ProtectedRoute>} 
            />
            <Route 
              path="/chat/:chatId" 
              element={<ProtectedRoute user={currentUser}><Chat /></ProtectedRoute>} 
            />
            <Route 
              path="/detail" 
              element={<ProtectedRoute user={currentUser}><Detail /></ProtectedRoute>} 
            />
            <Route 
              path="/notification" 
              element={<ProtectedRoute user={currentUser}><Notification /></ProtectedRoute>} 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

// Helper component for protecting routes
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default App;

