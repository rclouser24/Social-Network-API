import express from "express";
import mongoose from "mongoose";
import apiRoutes from "./routes/api";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(apiRoutes);

mongoose
  .connect("mongodb://localhost:27017/socialNetworkDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});