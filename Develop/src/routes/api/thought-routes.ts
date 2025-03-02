// /api/thoughts

// /api/thoughts/:thoughtId

// /api/thoughts/:thoughtId/reactions

// /api/thoughts/:thoughtId/reactions/:reactionId

import { Router } from "express";
import { Thought, User } from "../models";
import ReactionSchema from "../models/Reaction";
import mongoose from "mongoose";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const thoughts = await Thought.find().populate("reactions");
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve thoughts", details: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id).populate("reactions");

    if (!thought) return res.status(404).json({ error: "Thought not found" });

    res.json(thought);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve thought", details: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const { thoughtText, username, userId } = req.body;

    const newThought = await Thought.create({ thoughtText, username });

    await User.findByIdAndUpdate(
      userId,
      { $push: { thoughts: newThought._id } },
      { new: true }
    );

    res.status(201).json(newThought);
  } catch (err) {
    res.status(400).json({ error: "Failed to create thought", details: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedThought) return res.status(404).json({ error: "Thought not found" });

    res.json(updatedThought);
  } catch (err) {
    res.status(400).json({ error: "Failed to update thought", details: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);

    if (!thought) return res.status(404).json({ error: "Thought not found" });

    await User.findOneAndUpdate(
      { thoughts: req.params.id },
      { $pull: { thoughts: req.params.id } }
    );

    res.json({ message: "Thought deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete thought", details: err });
  }
});

router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const reaction = { ...req.body, reactionId: new mongoose.Types.ObjectId() };

    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: reaction } },
      { new: true }
    );

    if (!updatedThought) return res.status(404).json({ error: "Thought not found" });

    res.json(updatedThought);
  } catch (err) {
    res.status(500).json({ error: "Failed to add reaction", details: err });
  }
});

router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );

    if (!updatedThought) return res.status(404).json({ error: "Thought not found" });

    res.json(updatedThought);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove reaction", details: err });
  }
});

export default router;