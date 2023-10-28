import express, { Request, Response } from "express";
import applyMiddleware from "./middleware";
import errorHandler from "./middleware/globalErrorsMiddleware";
import v1Routes from "./routes/v1/v1";
import { createServer } from "http";
import { Server } from "socket.io";

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

applyMiddleware(app);

// Version 1 routes
app.use("/api/v1", v1Routes);

app.get("/api", (req: Request, res: Response) => {
  res.send("Welcome to the API!");
});

// Global error handler middleware
app.use(errorHandler);

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected");

  // get the Poll ID from the client
  const pollId = socket.handshake.query.pollId as string;

  // join the poll room
  socket.join(pollId);

  io.to(pollId).emit("newevent", "Event to poll with id: " + pollId);

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

httpServer.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});
