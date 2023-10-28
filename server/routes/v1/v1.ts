import express, { Request, Response } from "express";
import { io } from "../../app";

const router = express.Router();

router.post("/newvote/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    io.to(id).emit("newvote");

    res.status(200).send("OK");
  } catch (error) {
    console.error(error);
  }
});

export default router;
