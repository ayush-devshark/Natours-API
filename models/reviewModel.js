const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review can not be empty'] },
    rating: {
      type: Number,
      required: [true, 'A rating is required'],
      min: [1, 'Cannot be less than 1'],
      max: [5, 'Cannot be more than 5'],
    },
    createdAt: { type: Date, default: Date.now },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true }, // we want viruals to part of output when data outputed as JSON
    toObject: { virtuals: true }, // we want viruals to part of output when data outputed as Object
    id: false,
  } // schema option object
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // adds two extra query's one to tour and other to user
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });
  next();
});

// can be called directly on model
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // 'this' points to model
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    }, // group by tourid
  ]);

  // update tour model
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour); // this.constructor() points to Model
});

// findOneAndUpdate
// findOneAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this points to query
  this.revw = await this.findOne(); // we will get prev doc
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); Does not work here, Query has already been executed.
  await this.revw.constructor.calcAverageRatings(this.revw.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
