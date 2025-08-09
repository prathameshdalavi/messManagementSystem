import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: SocketIOServer;

export const initSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

export const sendNoticeToAll = (notice: {
  _id: string;
  title: string;
  message: string;
  mess_id: string;
  createdAt: Date;
}) => {
  if (io) {
    io.emit("new-notice", notice);
  }
};