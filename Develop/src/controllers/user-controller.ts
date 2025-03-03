import { Request, Response } from "express";
import { User } from "../models/User.js";
import { Thought } from "../models/Thought.js";

export const getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find().populate("thoughts").populate("friends");
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: "Failed to retrieve users", details: err });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.params.id).populate("thoughts").populate("friends");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Failed to retrieve user", details: err });
  }
};

export const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const newUser = await User.create(req.body);
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(400).json({ error: "Failed to create user", details: err });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    return res.json(updatedUser);
  } catch (err) {
    return res.status(400).json({ error: "Failed to update user", details: err });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await Thought.deleteMany({ _id: { $in: user.thoughts } });
    return res.json({ message: "User and associated thoughts deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete user", details: err });
  }
};

export const addFriend = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Failed to add friend", details: err });
  }
};

export const removeFriend = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Failed to remove friend", details: err });
  }
};