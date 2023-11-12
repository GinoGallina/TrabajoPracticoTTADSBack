import { Review, IReviewDocument } from "../models/database/review.js";
import { Repository } from "../shared/repository.js";

export class ReviewRepository implements Repository<IReview> {
  public async findAll(): Promise<IReview[] | undefined> {
    return await Review.find({ state: "Active" });
  }

  public async findOne(item: { id: string }): Promise<IReview | undefined> {
    const _id = new Object(item.id);
    return (await Review.findOne({ _id })) || undefined;
  }

  public async add(review: IReview): Promise<IReview | undefined> {
    const newReview: IReviewDocument = new Review(review);
    return await newReview.save();
  }

  public async update(
    id: string,
    review: IReview
  ): Promise<IReview | undefined> {
    return (
      (await Review.findOneAndUpdate(
        {
          _id: id,
          state: "Active",
        },
        review,
        { new: true }
      )) || undefined
    );
  }

  public async delete(item: { id: string }): Promise<IReview | undefined> {
    return (
      (await Review.findByIdAndUpdate(
        { _id: item.id },
        { state: "Archived" },
        { new: true }
      )) || undefined
    );
  }
}
