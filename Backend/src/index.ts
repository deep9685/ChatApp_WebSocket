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

            const response = {
                type:"create",
                message: "Room is created successfully",
                roomId: roomNumber,
            }
            socket.send(JSON.stringify(response));
        }

        if(parsedMessage.type == "join"){
            console.log("Room join request")
            if(!allSockets[parsedMessage?.payload?.roomId]){
                const response = {
                    type:"join",
                    status:404,
                    message:"Invalid Room Id!!"
                }
                socket.send(JSON.stringify(response));
            }
            else if(isAlreadyJoined(socket, parsedMessage?.payload?.roomId)){
                const response = {
                    type:"join",
                    status:400,
                    message:"You have already joined this room"
                }
                socket.send(JSON.stringify(response));
            }
            else{
                allSockets[parsedMessage?.payload?.roomId].push(socket);
                const response = {
                    type:"join",
                    status:200,
                    message:"Room joined Successfully"
                }
                socket.send(JSON.stringify(response));
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