const httpStatus = require('http-status');

const { Review } = require('../models');
const ApiError = require('../utils/ApiError');
const { reviewMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');

const getReviewById = async (id) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, reviewMessage().NOT_FOUND);
  }
  return review;
};

const createReview = async (reviewBody) => {
  const newReview = await Review.create(reviewBody);
  return newReview;
};

const getReviewsByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Review);
  const { results, ...detailResult } = await apiFeature.getResults(query, [
    'userId',
    'productId',
    'orderId',
    'rating',
    'isReview',
    'comment',
  ]);
  return { reviews: results, ...detailResult };
};

const updateReviewById = async (reviewId, updateBody) => {
  const review = await getReviewById(reviewId);
  Object.assign(review, updateBody);
  await review.save();
  return review;
};

const deleteReviewById = async (reviewId) => {
  const review = await getReviewById(reviewId);
  await review.deleteOne();
  return review;
};

module.exports = {
  getReviewById,
  createReview,
  getReviewsByKeyword,
  updateReviewById,
  deleteReviewById,
};
