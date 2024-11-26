import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface Room {
    [key: number] : WebSocket[]
}

function generateRandomNumber(){
    return Math.floor(Math.random() * 90000) + 10000;
}

function isAlreadyJoined(socket : WebSocket, roomId: number) : Boolean{
   return Boolean(allSockets[roomId]?.find(prevSocket => prevSocket === socket));
}

let allSockets: Room = {};

wss.on("connection", (socket) => {
    console.log("connected");
    socket.on("message", (message) => {
        // @ts-ignore
        const parsedMessage = JSON.parse(message);

        if(parsedMessage.type == "create"){
            console.log("Room create request");
            const roomNumber = generateRandomNumber();
            allSockets[roomNumber] = [];
            socket.send(`Room is created Successfully, RoomId: ${roomNumber}`);
        }

        if(parsedMessage.type == "join"){
            console.log("Room join request")
            if(!allSockets[parsedMessage?.payload?.roomId]){
                socket.send("Invalid Room Id!!");
            }
            else if(isAlreadyJoined(socket, parsedMessage?.payload?.roomId)){
                socket.send("You have already joined this room");
            }
            else{
                allSockets[parsedMessage?.payload?.roomId].push(socket);
                socket.send("Room joined Successfully");
            }
        }

        if(parsedMessage.type == "chat"){
            console.log("user want to chat");
            allSockets[Number(parsedMessage?.payload?.roomId)].forEach((socket) => {
                socket.send(parsedMessage?.payload?.message);
            })
        }
    })
})