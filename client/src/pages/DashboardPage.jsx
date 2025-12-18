import { useEffect, useState } from "react";
import { fetchParticipants } from "../services/api.js";
import { getSocket } from "../services/socket.js";

function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleString();
}

function DashboardPage() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await fetchParticipants();
        if (!isMounted) return;
        // Sort by timestamp descending (newest first)
        const sorted = [...data].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setParticipants(sorted);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Failed to load participants.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    load();

    const socket = getSocket();
    socket.on("new_participant", (participant) => {
      setParticipants((prev) => [participant, ...prev]);
    });

    return () => {
      isMounted = false;
      socket.off("new_participant");
    };
  }, []);

  return (
    <div className="card">
      <h2 className="card-title">Live Registration Dashboard</h2>
      <p className="card-subtitle">
        Registrations will appear here in real time as participants submit the form.
      </p>

      {loading && <p>Loading participants...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !participants.length && !error && (
        <p>No participants registered yet. Registrations will show up here.</p>
      )}

      {!loading && participants.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Company / Department</th>
                <th>Experience / Current Year</th>
                <th>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p.id || `${p.email}-${p.timestamp}`}>
                  <td>{p.fullName}</td>
                  <td>{p.email}</td>
                  <td>{p.phone}</td>
                  <td>{p.role}</td>
                  <td>{p.role === "Working Professional" ? p.companyName : p.department}</td>
                  <td>
                    {p.role === "Working Professional"
                      ? p.yearsOfExperience ?? "-"
                      : p.currentYear ?? "-"}
                  </td>
                  <td>{formatDate(p.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;


