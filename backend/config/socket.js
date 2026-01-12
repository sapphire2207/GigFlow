import { Server } from "socket.io";

let io;
// Store user socket mappings: { userId: socketId }
const userSocketMap = new Map();

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true,
            methods: ["GET", "POST", "PATCH", "DELETE"]
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        // Handle user registration with their socket
        socket.on("register", (userId) => {
            if (userId) {
                userSocketMap.set(userId.toString(), socket.id);
                console.log(`User ${userId} registered with socket ${socket.id}`);
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            // Remove user from map when they disconnect
            for (let [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const getUserSocketId = (userId) => {
    return userSocketMap.get(userId.toString());
};

export const emitToUser = (userId, event, data) => {
    const socketId = getUserSocketId(userId);
    if (socketId) {
        io.to(socketId).emit(event, data);
        return true;
    }
    return false;
};