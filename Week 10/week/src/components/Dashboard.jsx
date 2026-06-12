import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <main className="app-shell">
      <section className="glass-card dashboard-card">
        <p className="eyebrow">Dashboard</p>
        <h2>Librarian Dashboard</h2>
        <p className="subtle-text">
          Review your collection tools and jump into book maintenance tasks instantly.
        </p>
        <div className="action-row">
          <Link className="primary-btn" to="/deletebook">
            Delete books
          </Link>
          <span className="status-pill">Online</span>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
