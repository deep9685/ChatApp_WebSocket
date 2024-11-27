import { useEffect, useRef, useState } from "react";
import Modal from "./components/Modal";
import { toast } from "react-toastify";

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [inputId, setInputId] = useState('');

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openJoinRoomModal = () => setIsJoinRoomModalOpen(true);
  const closeJoinRoomModal = () => setIsJoinRoomModalOpen(false);

  const wsRef = useRef<WebSocket | undefined>(undefined);

  const handleCreateRoom = async () => {
    console.log("handle create room");
    wsRef.current?.send(
      JSON.stringify({
        type: "create",
      })
    );
  };

  const handleJoinRoom = async () => {
    console.log("handle JOIN room", inputId);
    wsRef.current?.send(
      JSON.stringify({
        type: "join",
        payload:{
          roomId:inputId
        }
      })
    );
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      console.log("event.data", event.data);
      const data = JSON.parse(event.data);

      if (data?.type == "create") {
        setIsCreateModalOpen(true);
        setRoomId(data?.roomId);
      }

      if(data?.type == "join"){
        if(data?.status === 404){
          toast.error(data?.message)
        }
        else if(data?.status === 400){
          toast.error(data?.message)
        }else if(data?.status === 200){
          toast.success(data?.message)
        }
        else{
          toast.error("Something went wrong!");
        }
      }
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
            <button
              className="p-1 px-2 bg-blue-700 hover:bg-blue-600 text-white font-mono rounded-md text-sm"
              onClick={openJoinRoomModal}
            >
              Join Room
            </button>
          </div>

          <div></div>
        </div>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <p className="text-white">Room is created successfully.</p>
        <p className="text-white">
          Please Join the Room using this Room ID : {roomId}
        </p>
      </Modal>

      <Modal isOpen={isJoinRoomModalOpen} onClose={closeJoinRoomModal}>
        <input
          className="bg-slate-500 rounded-md p-2 border-none text-center font-mono font-semibold"
          maxLength={5}
          placeholder="Enter Room ID"
          onChange={(e)=>{
            setInputId(e.target.value)
          }}
        />
        <button
          className="p-1 px-2 bg-blue-700 hover:bg-blue-600 text-white font-mono rounded-md text-sm mt-3 mb-4"
          onClick={handleJoinRoom}
        >
          Submit
        </button>
      </Modal>
    </>
  );
}

export default App;
