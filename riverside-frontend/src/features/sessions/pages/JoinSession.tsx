import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinSessionApi } from "../sessionApi";

const token = localStorage.getItem("JWT");
console.log("JOIN SESSIOn", token);

export default function JoinSession() {
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleJoinSession() {
    try {
      const response = await joinSessionApi(sessionCode!);
      console.log("JOIN SESSIONS MESSAGE: ", response.data.msg);
      if (response.status === 200) {
        const sessionId = response.data.sessionId;
        console.log("SESSION ID ", sessionId);
        navigate("/receiver", {
          state: { sessionCode: sessionCode, sessionId: sessionId },
        });
      }
    } catch (error) {
      // @ts-ignore
      if (error.response) {
        // @ts-ignore
        const status = error.response.status;
        // @ts-ignore
        const message = error.response.msg;
        console.log("Status : ", status);
        console.log("Message : ", message);

        if (status === 400) {
          console.log(message);
        } else {
          console.log("Something Went Wrong!");
        }
      }
    }
  }
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 justify-center items-center">
      <div className="w-full max-w-md mx-auto bg-gray-800/90 rounded-2xl shadow-lg p-8 border border-white/10">
        <h1 className="text-3xl font-bold mb-4 text-white text-center">
          Join a Session
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          Enter your session code to join as a guest
        </p>
        <div className="mb-6">
          <label
            htmlFor="sessionCode"
            className="block text-sm font-medium mb-2 text-gray-300"
          >
            Session Code
          </label>
          <input
            id="sessionCode"
            type="text"
            placeholder="Enter Session URL or ID"
            onChange={(e) => setSessionCode(e.target.value)}
            className="input w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <button
          onClick={handleJoinSession}
          className="btn btn-primary w-full py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Join Session
        </button>
      </div>
    </div>
  );
}
