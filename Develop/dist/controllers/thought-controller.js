import { Thought } from "../models/Thought.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";
export const getAllThoughts = async (_req, res) => {
    try {
        const thoughts = await Thought.find().populate("reactions");
        return res.json(thoughts);
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to retrieve thoughts", details: err });
    }
};
export const getThoughtById = async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id).populate("reactions");
        if (!thought)
            return res.status(404).json({ error: "Thought not found" });
        return res.json(thought);
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to retrieve thought", details: err });
    }
};
export const createThought = async (req, res) => {
    try {
        const { thoughtText, username, userId } = req.body;
        const newThought = await Thought.create({ thoughtText, username });
        await User.findByIdAndUpdate(userId, { $push: { thoughts: newThought._id } }, { new: true });
        return res.status(201).json(newThought);
    }
    catch (err) {
        return res.status(400).json({ error: "Failed to create thought", details: err });
    }
};
export const updateThought = async (req, res) => {
    try {
        const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedThought)
            return res.status(404).json({ error: "Thought not found" });
        return res.json(updatedThought);
    }
    catch (err) {
        return res.status(400).json({ error: "Failed to update thought", details: err });
    }
};
export const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.id);
        if (!thought)
            return res.status(404).json({ error: "Thought not found" });
        await User.findOneAndUpdate({ thoughts: req.params.id }, { $pull: { thoughts: req.params.id } });
        return res.json({ message: "Thought deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to delete thought", details: err });
    }
};
export const addReaction = async (req, res) => {
    try {
        const reaction = { ...req.body, reactionId: new mongoose.Types.ObjectId() };
        const updatedThought = await Thought.findByIdAndUpdate(req.params.thoughtId, { $push: { reactions: reaction } }, { new: true });
        if (!updatedThought)
            return res.status(404).json({ error: "Thought not found" });
        return res.json(updatedThought);
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to add reaction", details: err });
    }
};
export const removeReaction = async (req, res) => {
    try {
        const updatedThought = await Thought.findByIdAndUpdate(req.params.thoughtId, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { new: true });
        if (!updatedThought)
            return res.status(404).json({ error: "Thought not found" });
        return res.json(updatedThought);
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to remove reaction", details: err });
    }
};
