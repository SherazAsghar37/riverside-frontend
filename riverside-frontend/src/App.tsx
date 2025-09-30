import { Routes, Route } from "react-router-dom";
import Login from "./features/authentication/pages/Login";
import Signup from "./features/authentication/pages/Signup";
import CreateSession from "./features/sessions/pages/PreSessionConfiguration";
import Receiver from "./features/sessions/pages/Receiver";
import JoinSession from "./features/sessions/pages/JoinSession";
import Dashboard from "./features/dashboard/pages/Dashboard";
import HostView from "./features/sessions/pages/HostView";
import PreSessionConfiguration from "./features/sessions/pages/PreSessionConfiguration";
import ParticipantView from "./features/sessions/pages/ParticipantView";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-session" element={<PreSessionConfiguration />} />
      <Route path="/join-session/host" element={<PreSessionConfiguration />} />
      <Route path="/join-session" element={<PreSessionConfiguration />} />
      <Route path="/host" element={<HostView />} />
      <Route path="/participant" element={<ParticipantView />} />
      <Route path="/receiver" element={<Receiver />} />
      <Route path="/joinSession" element={<JoinSession />} />
    </Routes>
  );
}

export default App;
