import { useAuth } from "./AuthContext";

export default function AdminPanel() {
  const { user } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 Admin Panel</h1>

      <p>Welcome: {user?.name}</p>

      <div style={{ marginTop: 20 }}>
        <h3>System Control</h3>

        <ul>
          <li>👤 Manage Users</li>
          <li>🎬 Manage Content</li>
          <li>⚙️ Settings</li>
        </ul>
      </div>
    </div>
  );
}
