import { useEffect, useState } from "react";
import "./login2.css";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import Notification from "../notification/Notification";
import { useUserStore } from "../../lib/userStore";

const Login2 = () => {
  const [loading, setLoading] = useState(false);
  const { fetchUserInfo } = useUserStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // After a successful login, set up the onAuthStateChanged listener
    
        
          fetchUserInfo(user.uid);
    
    

      // Redirect to home page after successful login
      toast.success("Successfully logged in!");
      setTimeout(()=>{
        navigate('/list');

      },2000)
      

      // Cleanup the listener when the component unmounts
    
    } catch (err) {
      toast.error("Error logging in: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login">
        <div className="item">
          <h2>Talkify</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" name="email" required />
            <input type="password" placeholder="Password" name="password" required />
            <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
          </form>
          <p className="signin-link">
            Dont have an account? <a onClick={() => navigate('/register')}>Register here</a>
          </p>
        </div>
      </div>
      <Notification/>
    </>
  );
};

export default Login2;

