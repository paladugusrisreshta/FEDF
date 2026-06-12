import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const loginHandler = () => {
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  return (
    <main className="app-shell">
      <section className="glass-card auth-card">
        <p className="eyebrow">Library portal</p>
        <h1>Welcome back, librarian</h1>
        <p className="subtle-text">
          Securely manage your catalog, remove outdated titles, and keep your collection current.
        </p>
        <button className="primary-btn" onClick={loginHandler}>
          Login to dashboard
        </button>
      </section>
    </main>
  );
}

export default Login;
