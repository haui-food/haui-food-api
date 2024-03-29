const moment = require('moment');
const excel4node = require('excel4node');
const httpStatus = require('http-status');

const { env } = require('../config');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { userMessage } = require('../messages');
const ApiFeature = require('../utils/ApiFeature');

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select('+password');
  return user;
};

const getUserById = async (id) => {
  const user = await User.findById(id).select('+password');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, userMessage().NOT_FOUND);
  }
  return user;
};

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, userMessage().EXISTS_EMAIL);
  }
  const user = await User.create(userBody);
  user.password = undefined;
  return user;
};

const getUsersByKeyword = async (query) => {
  const apiFeature = new ApiFeature(User);
  const { results, ...detailResult } = await apiFeature.getResults(query, ['fullname', 'email', 'phone']);
  return { users: results, ...detailResult };
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, userMessage().EXISTS_EMAIL);
  }
  Object.assign(user, updateBody);
  await user.save();
  user.password = undefined;
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  await user.deleteOne();
  return user;
};

const lockUserById = async (userId) => {
  const user = await getUserById(userId);
  Object.assign(user, { isLocked: !user.isLocked });
  await user.save();
  return user;
};

const createAdmin = async () => {
  const { email, password, fullname } = env.admin;
  let admin = await User.findOne({ email });

  if (!admin) {
    await User.create({ fullname, email, password, role: 'admin' });
  } else {
    admin.fullname = fullname;
    admin.email = email;
    admin.password = password;
    admin.role = 'admin';
    await admin.save();
  }
};

const exportExcel = async (query) => {
  const apiFeature = new ApiFeature(User);
  query.page = 1;
  query.limit = 1000;
  const { results } = await apiFeature.getResults(query, ['fullname', 'email', 'phone']);
  const wb = new excel4node.Workbook();

  const ws = wb.addWorksheet('Users');

  const headerStyle = wb.createStyle({
    font: {
      color: '#FFFFFF',
      bold: true,
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: '#1ABD76',
    },
  });

  ws.column(1).setWidth(28);
  ws.column(2).setWidth(23);
  ws.column(3).setWidth(33);
  ws.column(4).setWidth(20);
  ws.column(5).setWidth(10);
  ws.column(6).setWidth(10);
  ws.column(7).setWidth(10);
  ws.column(8).setWidth(10);
  ws.column(9).setWidth(15);
  ws.column(10).setWidth(25);
  ws.column(11).setWidth(25);

  ws.cell(1, 1).string('ID').style(headerStyle);
  ws.cell(1, 2).string('Fullname').style(headerStyle);
  ws.cell(1, 3).string('Email').style(headerStyle);
  ws.cell(1, 4).string('Phone').style(headerStyle);
  ws.cell(1, 5).string('Role').style(headerStyle);
  ws.cell(1, 6).string('Gender').style(headerStyle);
  ws.cell(1, 7).string('Locked').style(headerStyle);
  ws.cell(1, 8).string('Verify').style(headerStyle);
  ws.cell(1, 9).string('Date of birth').style(headerStyle);
  ws.cell(1, 10).string('Last acctive').style(headerStyle);
  ws.cell(1, 11).string('Created At').style(headerStyle);

  results.forEach((user, index) => {
    ws.cell(index + 2, 1).string(user._id.toString());
    ws.cell(index + 2, 2).string(user.fullname);
    ws.cell(index + 2, 3).string(user.email);
    ws.cell(index + 2, 4).string(user.phone?.toString() || '');
    ws.cell(index + 2, 5).string(user.role);
    ws.cell(index + 2, 6).string(user.gender);
    ws.cell(index + 2, 7).string(user.isLocked ? 'Yes' : 'No');
    ws.cell(index + 2, 8).string(user.isVerify ? 'Yes' : 'No');
    ws.cell(index + 2, 9).string(moment(user.dateOfBirth).format('DD/MM/YYYY'));
    ws.cell(index + 2, 10).string(moment(user.lastAcctive).format('HH:mm:ss - DD/MM/YYYY'));
    ws.cell(index + 2, 11).string(moment(user.createdAt).format('HH:mm:ss - DD/MM/YYYY'));
  });

  return wb;
};

module.exports = {
  getUserByEmail,
  createUser,
  getUserById,
  getUsersByKeyword,
  updateUserById,
  deleteUserById,
  lockUserById,
  createAdmin,
  exportExcel,
};
