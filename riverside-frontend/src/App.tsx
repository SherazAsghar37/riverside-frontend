import { Routes, Route } from "react-router-dom";
import Login from "./features/authentication/pages/Login";
import Signup from "./features/authentication/pages/Signup";
import Dashboard from "./features/dashboard/pages/Dashboard";
import CreateSession from "./features/sessions/pages/CreateSession";
import Sender from "./features/sessions/pages/Sender";
import Receiver from "./features/sessions/pages/Receiver";
import JoinSession from "./features/sessions/pages/JoinSession";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/createSession" element={<CreateSession />} />
      <Route path="/sender" element={<Sender />} />
      <Route path="/receiver" element={<Receiver />} />
      <Route path="/joinSession" element={<JoinSession />} />
    </Routes>
  );
}

export default App;
