import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});

import { createServer } from 'http';
import connectToDB from './db/dbConnect.js';
import app from './app.js';
import { initializeSocket } from './config/socket.js';

const server = createServer(app);

initializeSocket(server);

connectToDB()
.then(() => {
    server.listen(process.env.PORT || 3000, () => {
        console.log(`Server is listening on: ${process.env.PORT}`);
        console.log(`Socket.io initialized`);
    });
})
.catch((error) => console.log("MONGODB connection failed!!!: ", error));