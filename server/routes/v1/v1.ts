import express, { Request, Response } from "express";
import { io } from "../../app";

const router = express.Router();

router.post("/newvote/:id", (req: Request, res: Response) => {
  try {
    const { id: pollId } = req.params;

    // emit a newvote event to the poll's room
    // this will trigger the client to fetch the latest results
    io.to(pollId).emit("newvote");

    res.status(200).send("OK");
  } catch (error) {
    console.error(error);
  }
});

export default router;
