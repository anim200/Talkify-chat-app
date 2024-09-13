import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase"; // Adjust the import as necessary
import { useUserStore } from "../lib/userStore"; // Adjust the import as necessary

const AuthProvider = ({ children }) => {
  const fetchUserInfo = useUserStore((state) => state.fetchUserInfo);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user.uid);
      } else {
        // Handle case where user is null (e.g., user logged out)
        fetchUserInfo(null);
      }
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  return <>{children}</>;
};

export default AuthProvider;
