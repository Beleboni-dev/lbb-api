import { Schema, model, Document } from "mongoose";

interface Review extends Document {
  movieId: string;
  userId: string;
  text: string;
  rating: number;
}

const reviewSchema: Schema = new Schema({
  movieId: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true },
});

export default model<Review>("Review", reviewSchema);
