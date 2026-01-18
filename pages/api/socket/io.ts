import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponse } from "next";

export type NextApiResponseServerIo = NextApiResponse & {
    socket: any;
};

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;

        // Use global/singleton to prevent re-initialization during HMR
        const globalIo = (global as any).io;

        if (globalIo) {
            res.socket.server.io = globalIo;
        } else {
            const io = new ServerIO(httpServer, {
                path: path,
                addTrailingSlash: false,
            });

            io.on("connection", (socket) => {
                console.log("Socket connected:", socket.id);

                socket.on("join_room", (room) => {
                    socket.join(room);
                    console.log(`Socket ${socket.id} joined room ${room}`);
                });

                socket.on("send_message", (message) => {
                    // Broadcast to the specific room (for the User to receive)
                    console.log("Broadcasting message to room:", message.room);
                    io.to(message.room).emit("receive_message", message);

                    // ALSO Broadcast to Admin Dashboard (for Admin to receive all chats)
                    // This ensures the sidebar updates and the admin sees messages from users they aren't currently viewing
                    io.to("admin_dashboard").emit("receive_message", message);
                });

                socket.on("disconnect", () => {
                    console.log("Socket disconnected:", socket.id);
                })
            });

            res.socket.server.io = io;
            (global as any).io = io;
        }
    }

    res.end();
};

export default ioHandler;
