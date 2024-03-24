const httpStatus = require('http-status');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');
const { contactService } = require('../services');
const { contactMessage } = require('../messages');

const createContact = catchAsync(async (req, res) => {
  const contact = await contactService.createContact(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, contactMessage().SEND_SUCCESS, contact));
});

const getContacts = catchAsync(async (req, res) => {
  const contacts = await contactService.getContactsByKeyword(req.query);
  res.status(httpStatus.OK).json(response(httpStatus.OK, contactMessage().FIND_LIST_SUCCESS, contacts));
});

const getContact = catchAsync(async (req, res) => {
  const contact = await contactService.getContactById(req.params.contactId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, contactMessage().FIND_SUCCESS, contact));
});

const deleteContact = catchAsync(async (req, res) => {
  const contact = await contactService.deleteContactById(req.params.contactId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, contactMessage().DELETE_SUCCESS, contact));
});

module.exports = {
  createContact,
  getContacts,
  getContact,
  deleteContact,
};
