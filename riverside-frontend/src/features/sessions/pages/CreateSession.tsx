import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import { createSessionApi } from "../sessionApi";
import CreateSessionHeader from "../components/CreateSessionHeader";
import CreateSessionInformation from "../components/CreateSessionInformation";

import CreateSessionCamView from "../components/CreateSessionCamView";

const token = localStorage.getItem("JWT");
console.log("i am session", token);
export default function CreateSession() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const onAllowAccess = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        console.log("Access granted to camera and microphone");
      })
      .catch((error) => {
        console.error("Error accessing camera and microphone:", error);
      });
  }, []);

  useEffect(onAllowAccess, []);

  const camBlocked = !stream;
  const micBlocked = !stream || !stream.getAudioTracks().length;

  return (
    <>
      <div className="bg-[var(--secondary-background)] min-h-screen flex flex-col">
        <div>
          <CreateSessionHeader />
        </div>

        <div className="flex flex-1 flex-col [@media(min-width:850px)]:flex-row justify-center items-center gap-20 px-20 py-10">
          <CreateSessionInformation
            onAllowAccess={onAllowAccess}
            camBlocked={camBlocked}
            micBlocked={micBlocked}
          />

          <CreateSessionCamView stream={stream} onAllowAccess={onAllowAccess} />
        </div>
      </div>
    </>
  );
}

// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { Mic, AlertCircle } from "lucide-react";
// import { createSessionApi } from "../sessionApi";

// const token = localStorage.getItem("JWT");
// console.log("i am session", token);
// export default function CreateSession() {
//   const [sessionName, setSessionName] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   async function handleCreateSession() {
//     if (!sessionName?.trim()) {
//       setError("Please enter a session name");
//       return;
//     }

//     setError(null);
//     setIsLoading(true);

//     try {
//       const response: any = await createSessionApi(sessionName);
//       const data = response.data;
//       if (response.status === 200) {
//         // do next stuff
//         console.log(data);
//         const sessionCode = data.sessionCode;
//         const sessionId = data.sessionId;
//         navigate("/sender", {
//           state: { sessionCode: sessionCode, sessionId: sessionId },
//         });
//       }
//     } catch (error: any) {
//       if (error.response) {
//         const status = error.response.status;
//         const message = error.response.data.error;
//         console.log("Status : ", status);
//         console.log("Message : ", message);
//         if (status === 400) {
//           setError(message);
//         } else {
//           setError("Something went wrong. Please try again.");
//         }
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl p-8">
//         <div className="flex items-center space-x-3 mb-8">
//           <div className="w-12 h-12 bg-indigo-900/30 rounded-xl flex items-center justify-center">
//             <Mic className="w-6 h-6 text-indigo-400" />
//           </div>
//           <h1 className="text-2xl font-bold text-white">Create New Session</h1>
//         </div>

//         {error && (
//           <div className="mb-6 bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg flex items-start">
//             <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
//             <span>{error}</span>
//           </div>
//         )}

//         <div className="space-y-6">
//           <div>
//             <label
//               htmlFor="sessionName"
//               className="block text-sm font-medium text-gray-300 mb-2"
//             >
//               Session Name
//             </label>
//             <input
//               id="sessionName"
//               type="text"
//               placeholder="Enter Session Name"
//               onChange={(e) => setSessionName(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-100 placeholder-gray-400 outline-none transition-all"
//             />
//           </div>

//           <button
//             onClick={handleCreateSession}
//             disabled={isLoading}
//             className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center ${
//               isLoading ? "opacity-80 cursor-not-allowed" : ""
//             }`}
//           >
//             {isLoading ? (
//               <svg
//                 className="animate-spin h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//             ) : (
//               "Create Session"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
