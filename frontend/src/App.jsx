import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Hostels from "./pages/Hostels";
import Rooms from "./pages/Rooms";
import Leaves from "./pages/Leaves";
import Complaints from "./pages/Complaints";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/hostels"
          element={<Hostels />}
        />

        <Route
          path="/rooms"
          element={<Rooms />}
        />

        <Route 
          path="/leaves" 
          element={<Leaves />} 
        />

        <Route
          path="/complaints" 
          element={<Complaints />} 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;