import { dateFormat } from "../utils/dateFormat";

interface IThought extends Document {
    thoughtText: string;
    createdAt: Date;
    username: string;
    reactions: IReaction[];
    reactionCount: number;
  }
  

  const ThoughtSchema = new Schema<IThought>(
    {
      thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp: Date) => dateFormat(timestamp),
      },
      username: {
        type: String,
        required: true,
      },
      reactions: [ReactionSchema], 
    },
    {
      toJSON: {
        virtuals: true,
        getters: true,
      },
      id: false, 
    }
  );
  
  
  ThoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
  });
  
  
  const Thought = model<IThought>("Thought", ThoughtSchema);
  export default Thought;