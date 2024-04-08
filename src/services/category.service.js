const moment = require('moment');
const excel4node = require('excel4node');
const httpStatus = require('http-status');
const axios = require('axios');
const XLSX = require('xlsx');
const util = require('util');

const { Category } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiFeature = require('../utils/ApiFeature');
const { categoryMessage } = require('../messages');
const cacheService = require('../services/cache.service');
const objectToString = require('../utils/objectToString');

const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, categoryMessage().NOT_FOUND);
  }
  return category;
};

const createCategory = async (categoryBody) => {
  const { name } = categoryBody;
  const category = await Category.findOne({ name });
  if (category) {
    throw new ApiError(httpStatus.BAD_REQUEST, categoryMessage().ALREADY_EXISTS);
  }
  const newCategory = await Category.create(categoryBody);
  return newCategory;
};

const getCategoriesByKeyword = async (query) => {
  const key = objectToString(query);
  const categoriesCache = cacheService.get(key);
  if (categoriesCache) return categoriesCache;

  const apiFeature = new ApiFeature(Category);
  const { results, ...detailResult } = await apiFeature.getResults(query, ['name', 'slug']);
  cacheService.set(key, { categories: results, ...detailResult });

  return { categories: results, ...detailResult };
};

const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  Object.assign(category, updateBody);
  await category.save();
  return category;
};

const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  await category.deleteOne();
  return category;
};

const exportExcel = async (query) => {
  const apiFeature = new ApiFeature(Category);
  query.page = 1;
  query.limit = 1000;
  const { results } = await apiFeature.getResults(query, ['name', 'slug']);
  const wb = new excel4node.Workbook();

  const ws = wb.addWorksheet('Categories');

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
  ws.column(3).setWidth(40);
  ws.column(4).setWidth(25);
  ws.column(5).setWidth(25);

  ws.cell(1, 1).string('ID').style(headerStyle);
  ws.cell(1, 2).string('Name').style(headerStyle);
  ws.cell(1, 3).string('image').style(headerStyle);
  ws.cell(1, 4).string('Last acctive').style(headerStyle);
  ws.cell(1, 5).string('Created At').style(headerStyle);
  results.forEach((category, index) => {
    ws.cell(index + 2, 1).string(category._id.toString());
    ws.cell(index + 2, 2).string(category.name);
    ws.cell(index + 2, 3).string(category.image);
    ws.cell(index + 2, 4).string(moment(category.lastAcctive).format('DD/MM/YYYY - HH:mm:ss'));
    ws.cell(index + 2, 5).string(moment(category.createdAt).format('DD/MM/YYYY - HH:mm:ss'));
  });

  return wb;
};

const importCategoriesFromExcelFile = async (fileUrl) => {
  let categories = [];
  const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
  const workbook = XLSX.read(response.data, { type: 'buffer' });
  const sheetNameList = workbook.SheetNames;
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

  for (let row of rows) {
    const category = new Category({
      name: row['Name'],
      image: row['Image'],
      slug: row['Slug'],
    });
    await category.save();
    categories.push(category);
  }

  return categories;
};
module.exports = {
  getCategoryById,
  createCategory,
  getCategoriesByKeyword,
  updateCategoryById,
  deleteCategoryById,
  exportExcel,
  importCategoriesFromExcelFile,
};
