import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { fetchAllSessionsApi } from '../dashboardApi';
import type { SessionType } from '../../../types';

function Sessions() {
    const navigate = useNavigate();
  const [sessions,setSessions] = useState<SessionType[]>([]);

  useEffect(()=>{
    async function runFetchAllSessions(){
      const response = await fetchAllSessionsApi();
      console.log(response.data);
      setSessions(response.data.sessions);
    }
    runFetchAllSessions();
  },[])

  return (
        <>
                  {/* Recordings Table */}
          {/* <div className="bg-gray-800 rounded-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-850">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recordings.map((recording) => (
                    <tr key={recording.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${
                            recording.type === 'video' ? 'bg-blue-900/30' : 'bg-indigo-900/30'
                          } flex items-center justify-center`}>
                            {recording.type === 'video' ? (
                              <Video size={18} className="text-blue-400" />
                            ) : (
                              <Mic size={18} className="text-indigo-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">{recording.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{recording.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{recording.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          recording.type === 'video' 
                            ? 'bg-blue-900/20 text-blue-400' 
                            : 'bg-indigo-900/20 text-indigo-400'
                        }`}>
                          {recording.type === 'video' ? 'Video' : 'Audio'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          recording.status === 'completed' 
                            ? 'bg-green-900/20 text-green-400' 
                            : 'bg-yellow-900/20 text-yellow-400'
                        }`}>
                          {recording.status === 'completed' ? 'Completed' : 'Editing'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button 
                            onClick={() => handleRecordingAction('play', recording.id)}
                            className="text-gray-400 hover:text-indigo-400 transition-colors"
                          >
                            <Play size={18} />
                          </button>
                          <button 
                            onClick={() => handleRecordingAction('edit', recording.id)}
                            className="text-gray-400 hover:text-indigo-400 transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleRecordingAction('download', recording.id)}
                            className="text-gray-400 hover:text-indigo-400 transition-colors"
                          >
                            <Download size={18} />
                          </button>
                          <button 
                            onClick={() => handleRecordingAction('delete', recording.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          */}
  
          <div className="bg-gray-800 rounded-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-850">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-700">
                  { sessions && sessions.length > 0 ? sessions.map((session) => (
                    <tr key={session.id.toString()} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                         
                          <div className="ml-4">
                            <div className="text-sm font-medium">{session.sessionName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{session.sessionCode}</td>  
                  <button onClick={()=>navigate('/recentSession',{state:{sessionId:session.id}})}>Open Session</button>
                  </tr>
                  
                  )): <tr className="bg-gray-850">
                    <td className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">No Recordings.</td>
                    <td className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">No Recordings available.</td>
                    
                    
                  </tr>} 
                  
                </tbody>
              </table>
            </div>
          </div></>

  )
}

export default Sessions;