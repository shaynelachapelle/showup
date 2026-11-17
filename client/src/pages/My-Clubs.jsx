import '../css/MyClubs.css';

export default function MyClubs() {
  // Default data until MongoDB is connected
  const followedClubs = [
    { id: 1, name: "Computer Science Undergraduate Society", initials: "CSUS" },
    { id: 2, name: "DriveSafe", initials: "DS" },
    { id: 3, name: "McGill Esports", initials: "MES" },
    { id: 4, name: "McGill Students' Culinary Society", initials: "MSCS" },
    { id: 5, name: "McGill Association of North American Born Asians", initials: "MANABA" }
  ];

  return (
    <div className="myclubs-container">
      
      {/* Red Navigation Bar */}
      <nav className="navbar">
        <div className="logo-section">
          <span className="logo-text">Show</span>up
        </div>
      </nav>

      {/* Main Content */}
      <div className="myclubs-content">
        <h1 className="page-title">My Clubs</h1>
        <p className="page-subtitle">Organizations you are currently following.</p>

        <div className="clubs-grid">
          {followedClubs.map((club) => (
            <div key={club.id} className="club-card">
              <div className="club-avatar">{club.initials}</div>
              <h3 className="club-name">{club.name}</h3>
              <button className="following-btn">Following</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}