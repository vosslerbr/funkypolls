import express, { Request, Response } from "express";
import { io } from "../../app";

const router = express.Router();

// alerts the client that a new vote has been cast
router.post("/new-vote/:id", (req: Request, res: Response) => {
  try {
    const { id: pollId } = req.params;

    // emit a newvote event to the poll's room
    // this will trigger the client to fetch the latest results
    io.to(pollId).emit("newvote");

    res.status(200).send("New vote event emitted");
  } catch (error) {
    console.error(error);
  }
});

// alerts client of a status change for a poll
router.post("/status-change/:id", (req: Request, res: Response) => {
  try {
    const { id: pollId } = req.params;

    io.to(pollId).emit("status-change");

    res.status(200).send("Status change event emitted");
  } catch (error) {
    console.error(error);
  }
});

export default router;
