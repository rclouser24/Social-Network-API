import { Router } from "express";
import * as thoughtController from "../../controllers/thought-controller.js";
const router = Router();
router.get("/", thoughtController.getAllThoughts);
router.get("/:id", thoughtController.getThoughtById);
router.post("/", thoughtController.createThought);
router.put("/:id", thoughtController.updateThought);
router.delete("/:id", thoughtController.deleteThought);
router.post("/:thoughtId/reactions", thoughtController.addReaction);
router.delete("/:thoughtId/reactions/:reactionId", thoughtController.removeReaction);
export default router;
