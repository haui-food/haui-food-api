const { Contact } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { contactMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');

const getContactByEmail = async (email) => {
  const contact = await Contact.findOne({ email });
  return contact;
};

const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    throw new ApiError(httpStatus.NOT_FOUND, contactMessage().NOT_FOUND);
  }
  return contact;
};

const createContact = async (contactBody) => {
  const contact = await Contact.create(contactBody);
  return contact;
};

const getContactsByKeyword = async (query) => {
  const apiFeature = new ApiFeature(Contact);
  const { results, ...detailResult } = await apiFeature.getResults(query, ['fullname', 'email', 'phone', 'message']);
  return { contacts: results, ...detailResult };
};

const deleteContactById = async (contactId) => {
  const contact = await getContactById(contactId);
  await contact.deleteOne();
  return contact;
};

module.exports = {
  getContactByEmail,
  createContact,
  getContactById,
  getContactsByKeyword,
  deleteContactById,
};
