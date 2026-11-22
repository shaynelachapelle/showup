// Author: Grace Yuzwin, Shayne Lachapelle
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

// css styling
import styles from "../css/LogoutButton.module.css";

function LogoutButton({ className = "" }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      setLoggingOut(false);
      alert(`Couldn't log out: ${err.message}`);
    }
  }

  return (
    <button
      type="button"
      className={`${styles.logout} ${className}`}
      onClick={handleLogout}
      disabled={loggingOut}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
