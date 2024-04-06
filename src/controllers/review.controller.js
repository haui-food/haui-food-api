const httpStatus = require('http-status');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');
const { reviewMessage } = require('../messages');

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, reviewMessage().CREATE_SUCCESS, review));
});

const getReviews = catchAsync(async (req, res) => {
  const reviews = await reviewService.getReviewsByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, reviewMessage().FIND_LIST_SUCCESS, reviews));
});

const getReviewById = catchAsync(async (req, res) => {
  const review = await reviewService.getReviewById(req.params.reviewId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, reviewMessage().FIND_SUCCESS, review));
});

const updateReview = catchAsync(async (req, res) => {
  const review = await reviewService.updateReviewById(req.params.reviewId, req.body);
  res.status(httpStatus.OK).json(response(httpStatus.OK, reviewMessage().UPDATE_SUCCESS, review));
});

const deleteReview = catchAsync(async (req, res) => {
  const review = await reviewService.deleteReviewById(req.params.reviewId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, reviewMessage().DELETE_SUCCESS, review));
});

const exportExcel = catchAsync(async (req, res) => {
  const wb = await reviewService.exportExcel(req.query);
  wb.writeToBuffer().then((buffer) => {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + `products-hauifood.com-${Date.now()}.xlsx`);
    res.send(buffer);
  });
});

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  exportExcel,
};
