import express from "express";
import createPoll from "../../controllers/poll/create";
import getPoll from "../../controllers/poll/get";
import submitVote from "../../controllers/poll/submitVote";

const router = express.Router();

router.post("/poll", createPoll);
router.get("/poll/:id", getPoll);
router.put("/poll/vote/:id", submitVote);

export default router;
