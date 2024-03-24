const { Contact } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { contactMessage } = require('../messages');

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

const getContactsByKeyword = async (requestQuery) => {
  const { limit = 10, page = 1, keyword = '', sortBy = 'createdAt:desc' } = requestQuery;

  const skip = +page <= 1 ? 0 : (+page - 1) * +limit;
  let sort = sortBy.split(',').map((sortItem) => {
    const [field, option = 'desc'] = sortItem.split(':');
    return [field, option === 'desc' ? -1 : 1];
  });

  const contacts = await Contact.find({
    $or: [
      { fullname: { $regex: new RegExp(keyword, 'i') } },
      { email: { $regex: new RegExp(keyword, 'i') } },
      { phone: { $regex: new RegExp(keyword, 'i') } },
    ],
  })
    .limit(limit)
    .skip(skip)
    .sort(sort);

  const totalSearch = await Contact.countDocuments({
    $or: [
      { fullname: { $regex: new RegExp(keyword, 'i') } },
      { email: { $regex: new RegExp(keyword, 'i') } },
      { phone: { $regex: new RegExp(keyword, 'i') } },
    ],
  });

  const detailResult = {
    limit: +limit,
    totalResult: totalSearch,
    totalPage: Math.ceil(totalSearch / +limit),
    currentPage: +page,
    currentResult: contacts.length,
  };

  return { contacts, ...detailResult };
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
