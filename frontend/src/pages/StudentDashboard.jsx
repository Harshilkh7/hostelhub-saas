import Navbar from "../components/Navbar";

function StudentDashboard() {
  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Student Dashboard</h1>

        <p>
          Welcome to HostelHub
        </p>

        <ul>
          <li>
            View Leave Requests
          </li>

          <li>
            Create Complaints
          </li>

          <li>
            Track Complaint Status
          </li>
        </ul>
      </div>
    </>
  );
}

export default StudentDashboard;