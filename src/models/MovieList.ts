import mongoose, { Schema, Document } from 'mongoose';
import { IMovie } from './Movie';
import mongooseUniqueValidator from 'mongoose-unique-validator';

export interface IMovieList extends Document {
    title: string;
    description: string;
    movies: IMovie[];
}

const MovieListSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    movies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
});

MovieListSchema.plugin(mongooseUniqueValidator);

export default mongoose.model<IMovieList>('MovieList', MovieListSchema);
