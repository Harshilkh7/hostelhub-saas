import {
  Link,
  useNavigate,
} from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const role =
    localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">

      <h1 className="font-bold text-xl">
        HostelHub
      </h1>

      <div className="flex gap-6">

        {role === "STUDENT" ? (
          <>
            <Link to="/student">
              Dashboard
            </Link>

            <Link to="/my-leaves">
              Leaves
            </Link>

            <Link to="/my-complaints">
              Complaints
            </Link>
          </>
        ) : (
          <>
            <Link to="/admin">
              Dashboard
            </Link>

            <Link to="/hostels">
              Hostels
            </Link>

            <Link to="/rooms">
              Rooms
            </Link>

            <Link to="/leaves">
              Leaves
            </Link>

            <Link to="/complaints">
              Complaints
            </Link>
          </>
        )}

      </div>

      <button
        onClick={logout}
        className="bg-red-500 px-4 py-2 rounded"
      >
        Logout
      </button>

    </nav>
  );
}

export default Navbar;