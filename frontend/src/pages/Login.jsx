import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

    localStorage.setItem(
        "token",
        res.data.token
    );

    localStorage.setItem(
        "role",
        res.data.user.role
    );

    if (
    res.data.user.role ===
    "HOSTEL_ADMIN"
    ) {
    navigate("/admin");
    } else {
    window.location.href =
        "/student";
    }

    alert("Login Successful");

    } catch (err) {
      console.error(err);
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

  <div className="bg-white p-8 rounded shadow w-96">

    <h1 className="text-2xl font-bold mb-6">
      HostelHub Login
    </h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="mt-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button className=" bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Login
        </button>
      </form>
    </div>
    </div>
  );
}

export default Login;