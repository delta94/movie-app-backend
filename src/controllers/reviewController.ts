/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Review, { IReview } from '../models/Review';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Movie from '../models/Movie';
import User from '../models/User';

const delete_review = async (req: Request, res: Response): Promise<void> => {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Your review has been deleted` });
};

const like_review = async (req: Request, res: Response): Promise<void> => {
    const likedReview = await Review.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } },
        { new: true },
    );
    res.status(200).json(likedReview);
};

const edit_review = async (req: Request, res: Response): Promise<void> => {
    const { content, rating } = req.body as IReview;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const updatedReview = await Review.findByIdAndUpdate(
        req.params.id,
        { content, rating },
        { new: true },
    );
    if (!updatedReview) {
        res.status(400).json({ message: 'Something went wrong...' });
        return;
    }
    res.status(200).json(updatedReview);
};

const post_review = async (req: Request, res: Response): Promise<void> => {
    const { content, rating } = req.body as IReview;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const reviewedMovie = await Movie.findOne({ _id: req.params.movieID });
    const fromUser = await User.findOne({ _id: req.params.userID });
    if (!reviewedMovie || !fromUser) {
        res.status(400).json({ message: 'Something went wrong' });
        return;
    }

    const newReview: IReview = new Review({
        movie: reviewedMovie._id,
        user: fromUser._id,
        content,
        rating,
        likes: 0,
    });

    const savedReview = await newReview.save();
    res.status(200).json({
        savedReview,
        message: `You have posted a review for ${reviewedMovie.title} (${reviewedMovie.year})`,
    });
};

const get_all_reviews = async (req: Request, res: Response): Promise<void> => {
    const reviews = await Review.find({});
    res.status(200).json(reviews);
};

export default {
    get_all_reviews,
    post_review,
    edit_review,
    like_review,
    delete_review,
};
