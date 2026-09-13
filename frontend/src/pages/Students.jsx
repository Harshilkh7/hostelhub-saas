import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  college_id: "",
  course: "",
  year: "",
  guardian_name: "",
  guardian_phone: "",
  hostel_id: "",
  room_id: "",
};

function Students() {
  const [students, setStudents] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([loadStudents(), loadHostels(), loadRooms()]);
  }, []);

  const loadStudents = async () => {
    try {
      const { data } = await api.get("/users/students");
      setStudents(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load students");
    }
  };

  const loadHostels = async () => {
    try {
      const { data } = await api.get("/hostels");
      setHostels(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load hostels");
    }
  };

  const loadRooms = async () => {
    try {
      const { data } = await api.get("/rooms");
      setRooms(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load rooms");
    }
  };

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setError("");
    setSuccess("");
  };

  const filteredRooms = form.hostel_id
    ? rooms.filter((room) => room.hostel_id === form.hostel_id)
    : rooms;

  const handleHostelChange = (event) => {
    setForm((current) => ({ ...current, hostel_id: event.target.value, room_id: "" }));
    setError("");
  };

  const createStudent = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { data } = await api.post("/users/students", {
        ...form,
        year: form.year ? Number(form.year) : undefined,
      });
      setSuccess(`${data.user.name} was created as a student. They can now log in with the email and password you entered.`);
      setForm(emptyForm);
      await loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create student account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Students</h1>
          <p className="mt-1 text-slate-500">Create and manage student login accounts for your organization.</p>
        </div>

        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{success}</div>}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Create student account</h2>
          <p className="mt-1 text-sm text-slate-500">The account is automatically created with the STUDENT role and your organization.</p>

          <form onSubmit={createStudent} className="mt-6 grid gap-4 md:grid-cols-2">
            <input className="rounded-lg border p-3" placeholder="Full name *" value={form.name} onChange={update("name")} required />
            <input className="rounded-lg border p-3" type="email" placeholder="Email *" value={form.email} onChange={update("email")} required />
            <input className="rounded-lg border p-3" type="password" minLength={8} placeholder="Temporary password (8+ chars) *" value={form.password} onChange={update("password")} required />
            <input className="rounded-lg border p-3" placeholder="College ID" value={form.college_id} onChange={update("college_id")} />
            <input className="rounded-lg border p-3" placeholder="Course" value={form.course} onChange={update("course")} />
            <input className="rounded-lg border p-3" type="number" min="1" placeholder="Year" value={form.year} onChange={update("year")} />
            <input className="rounded-lg border p-3" placeholder="Guardian name" value={form.guardian_name} onChange={update("guardian_name")} />
            <input className="rounded-lg border p-3" type="tel" placeholder="Guardian phone" value={form.guardian_phone} onChange={update("guardian_phone")} />
            <select className="rounded-lg border p-3" value={form.hostel_id} onChange={handleHostelChange}>
              <option value="">Select hostel (optional)</option>
              {hostels.map((hostel) => <option key={hostel.id} value={hostel.id}>{hostel.name}</option>)}
            </select>
            <select className="rounded-lg border p-3" value={form.room_id} onChange={update("room_id")} disabled={!filteredRooms.length}>
              <option value="">Select room (optional)</option>
              {filteredRooms.map((room) => <option key={room.id} value={room.id}>{room.hostel_name} · Room {room.room_number} · Capacity {room.capacity}</option>)}
            </select>
            <button disabled={loading} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50 md:col-span-2" type="submit">
              {loading ? "Creating account..." : "Create Student Account"}
            </button>
          </form>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Student accounts</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{students.length} students</span>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="p-3">Student</th><th className="p-3">Email</th><th className="p-3">College ID</th><th className="p-3">Course</th><th className="p-3">Hostel</th><th className="p-3">Room</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr className="border-b last:border-0" key={student.id}>
                    <td className="p-3 font-medium text-slate-900">{student.name}</td>
                    <td className="p-3 text-slate-600">{student.email}</td>
                    <td className="p-3 text-slate-600">{student.college_id || "—"}</td>
                    <td className="p-3 text-slate-600">{student.course || "—"}</td>
                    <td className="p-3 text-slate-600">{student.hostel_name || "—"}</td>
                    <td className="p-3 text-slate-600">{student.room_number || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!students.length && <p className="py-8 text-center text-slate-500">No student accounts yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Students;
