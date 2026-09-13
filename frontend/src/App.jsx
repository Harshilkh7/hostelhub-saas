import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Hostels from "./pages/Hostels";
import Rooms from "./pages/Rooms";
import Students from "./pages/Students";
import Leaves from "./pages/Leaves";
import Complaints from "./pages/Complaints";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/StudentDashboard";
import MyLeaves from "./pages/MyLeaves";
import MyComplaints from "./pages/MyComplaints";
import Subscription from "./pages/Subscription";

const Protected = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/superadmin" element={<Protected><SuperAdminDashboard /></Protected>} />
        <Route path="/hostels" element={<Protected><Hostels /></Protected>} />
        <Route path="/rooms" element={<Protected><Rooms /></Protected>} />
        <Route path="/students" element={<Protected><Students /></Protected>} />
        <Route path="/leaves" element={<Protected><Leaves /></Protected>} />
        <Route path="/complaints" element={<Protected><Complaints /></Protected>} />
        <Route path="/admin" element={<Protected><AdminDashboard /></Protected>} />
        <Route path="/student" element={<Protected><StudentDashboard /></Protected>} />
        <Route path="/my-leaves" element={<Protected><MyLeaves /></Protected>} />
        <Route path="/my-complaints" element={<Protected><MyComplaints /></Protected>} />
        <Route path="/subscription" element={<Protected><Subscription /></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
