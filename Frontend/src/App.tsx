import { useEffect, useRef } from "react";

function App() {
  const wsRef = useRef<WebSocket | undefined>(undefined);

  const handleCreateRoom = async () => {
    console.log("handle create room");
    wsRef.current?.send(JSON.stringify({
      type:"create"
    }))
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      console.log("event===>", event);
    };
    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      <div className="w-[100vw] h-[100vh] flex justify-center items-center">
        <div className="w-3/5 h-4/5 bg-slate-800 rounded-lg p-4">
          <div className="flex justify-between">
            <button
              className="p-1 px-2 bg-white hover:bg-slate-50 hover:text-slate-950 text-slate-900 font-mono rounded-md text-sm"
              onClick={handleCreateRoom}
            >
              Create Room
            </button>
            <button className="p-1 px-2 bg-blue-700 hover:bg-blue-600 text-white font-mono rounded-md text-sm">
              Join Room
            </button>
          </div>

          <div></div>
        </div>
      </div>
    </>
  );
}

export default App;
