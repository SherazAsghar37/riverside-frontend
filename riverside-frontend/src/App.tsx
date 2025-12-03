import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAppDispatch } from "./hooks/ReduxHooks";
import { logout } from "./features/authentication/authSlice";
import Login from "./features/authentication/pages/Login";
import Signup from "./features/authentication/pages/Signup";
// import Receiver from "./features/sessions/pages/Receiver";
// import JoinSession from "./features/sessions/pages/JoinSession";
import Dashboard from "./features/dashboard/pages/Dashboard";
import HostView from "./features/sessions/pages/HostView";
import PreSessionConfiguration from "./features/sessions/pages/PreSessionConfiguration";
import ParticipantView from "./features/sessions/pages/ParticipantView";
import Recordings from "./features/recordings/Recordings";

function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleUnauthorized = () => {
      console.log("Unauthorized");
      dispatch(logout());
      navigate("/login");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [dispatch, navigate]);

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
      {/* <Route path="/receiver" element={<Receiver />} /> */}
      {/* <Route path="/joinSession" element={<JoinSession />} /> */}
      <Route path="/recordings" element={<Recordings />} />
    </Routes>
  );
}

export default App;
