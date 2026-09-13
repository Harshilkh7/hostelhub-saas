import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const organization = JSON.parse(localStorage.getItem("organization") || "null");
  const adminRoles = ["SUPER_ADMIN", "HOSTEL_ADMIN", "WARDEN"];

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-slate-900 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-bold text-xl">HostelHub</h1>
        {organization && <p className="text-xs text-slate-400">{organization.name} · {organization.plan || "FREE"}</p>}
      </div>
      <div className="flex flex-wrap gap-5 items-center text-sm">
        {role === "STUDENT" ? (
          <>
            <Link to="/student">Dashboard</Link>
            <Link to="/my-leaves">Leaves</Link>
            <Link to="/my-complaints">Complaints</Link>
          </>
        ) : (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/hostels">Hostels</Link>
            <Link to="/rooms">Rooms</Link>
            <Link to="/students">Students</Link>
            <Link to="/leaves">Leaves</Link>
            <Link to="/complaints">Complaints</Link>
          </>
        )}
        {adminRoles.includes(role) && <Link to="/subscription">Billing</Link>}
      </div>
      <button onClick={logout} className="rounded bg-red-500 px-4 py-2">Logout</button>
    </nav>
  );
}

export default Navbar;
