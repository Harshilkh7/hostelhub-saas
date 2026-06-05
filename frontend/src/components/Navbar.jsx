import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const role =
    localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "15px",
        borderBottom:
          "1px solid #ccc",
      }}
    >
      {role === "STUDENT" ? (
        <>
          <Link to="/student">
            Dashboard
          </Link>

          <Link to="/my-leaves">
            My Leaves
          </Link>

          <Link to="/my-complaints">
            My Complaints
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

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;