import Navbar from "../components/Navbar";

function StudentDashboard() {
  return (
    <>
      <Navbar />

      <div className=" bg-white shadow rounded p-4 mb-4 font-times">
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