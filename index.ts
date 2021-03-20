import dotenv from "dotenv"
import { createRols } from "./libs/initialSetup";
import Server from "./models/server"

dotenv.config({
    path:'.env'
});

const server = new Server();

server.listen();

createRols();