import { Schema, model } from "mongoose";
import { ReactionSchema } from "./Reaction.js";
const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [ReactionSchema],
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
});
ThoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});
export const Thought = model("Thought", ThoughtSchema);
