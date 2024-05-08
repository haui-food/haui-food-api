const moment = require('moment');
const excel4node = require('excel4node');
const httpStatus = require('http-status');

const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiFeature = require('../utils/ApiFeature');
const { STYLE_EXPORT_EXCEL } = require('../constants');
const cacheService = require('../services/cache.service');
const objectToString = require('../utils/objectToString');
const { productMessage, authMessage } = require('../messages');

const createProduct = async (productBody) => {
  const product = await Product.create(productBody);
  return product;
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .select('name description image price slug shop category')
    .populate([
      {
        path: 'shop',
        select: 'fullname email phone description address avatar background',
      },
      {
        path: 'category',
        select: 'name slug image',
      },
    ]);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, productMessage().NOT_FOUND);
  }

  return product;
};

const getProductsByKeyword = async (requestQuery) => {
  const key = objectToString(requestQuery);

  const productsCache = cacheService.get(key);

  if (productsCache) return productsCache;

  const { limit = 10, page = 1, keyword = '', sortBy = 'createdAt:desc', shop, category } = requestQuery;

  const sort = sortBy.split(',').map((sortItem) => {
    const [field, option = 'desc'] = sortItem.split(':');
    return { [field]: option === 'desc' ? -1 : 1 };
  });

  const sortObject = Object.assign(...sort);

  const query = {
    $and: [
      {
        $or: [
          { name: { $regex: new RegExp(keyword, 'i') } },
          { slug: { $regex: new RegExp(keyword, 'i') } },
          { description: { $regex: new RegExp(keyword, 'i') } },
        ],
      },
    ],
  };

  console.log(shop, category);

  if (shop) {
    query.$and.push({ shop });
  }

  if (category) {
    query.$and.push({ category });
  }

  const skip = +page <= 1 ? 0 : (+page - 1) * +limit;

  const products = await Product.find(query)
    .select('name description image price slug shop category')
    .populate([
      {
        path: 'shop',
        select: 'fullname email phone description address avatar background',
      },
      {
        path: 'category',
        select: 'name slug image',
      },
    ])
    .skip(skip)
    .limit(limit)
    .sort(sortObject);

  const totalSearch = await Product.countDocuments(query);

  const detailResult = {
    limit: +limit,
    totalResult: totalSearch,
    totalPage: Math.ceil(totalSearch / +limit),
    currentPage: +page,
    currentResult: products.length,
  };

  cacheService.set(key, { products, ...detailResult });

  return { products, ...detailResult };
};

const getMyProducts = async (query, shop) => {
  const apiFeature = new ApiFeature(Product);

  query.shop = shop;

  const { results, ...detailResult } = await apiFeature.getResults(query, ['name', 'description']);

  return { products: results, ...detailResult };
};

const updateProductById = async (productId, updateBody, shop) => {
  const product = await getProductById(productId);

  if (updateBody.shop !== shop) {
    throw new ApiError(httpStatus.FORBIDDEN, authMessage().FORBIDDEN);
  }

  Object.assign(product, updateBody);
  await product.save();

  return product;
};

const deleteProductById = async (productId, shop) => {
  const product = await getProductById(productId);

  if (product.shop !== shop) {
    throw new ApiError(httpStatus.FORBIDDEN, authMessage().FORBIDDEN);
  }

  await product.deleteOne();

  return product;
};

const exportExcel = async (query) => {
  const apiFeature = new ApiFeature(Product);

  query.page = 1;
  query.limit = 1000;

  const { results } = await apiFeature.getResults(query, ['name', 'description', 'slug', 'price']);
  const wb = new excel4node.Workbook();

  const ws = wb.addWorksheet('Products');

  const headerStyle = wb.createStyle(STYLE_EXPORT_EXCEL);

  ws.column(1).setWidth(28);
  ws.column(2).setWidth(23);
  ws.column(3).setWidth(33);
  ws.column(4).setWidth(20);
  ws.column(5).setWidth(40);
  ws.column(6).setWidth(25);
  ws.column(7).setWidth(25);
  ws.column(8).setWidth(25);
  ws.column(9).setWidth(25);
  ws.column(10).setWidth(25);

  ws.cell(1, 1).string('ID').style(headerStyle);
  ws.cell(1, 2).string('Name').style(headerStyle);
  ws.cell(1, 3).string('Slug').style(headerStyle);
  ws.cell(1, 4).string('Description').style(headerStyle);
  ws.cell(1, 5).string('Price').style(headerStyle);
  ws.cell(1, 6).string('Image').style(headerStyle);
  ws.cell(1, 7).string('ShopId').style(headerStyle);
  ws.cell(1, 8).string('CategoryId').style(headerStyle);
  ws.cell(1, 9).string('Last acctive').style(headerStyle);
  ws.cell(1, 10).string('Created At').style(headerStyle);

  results.forEach((product, index) => {
    ws.cell(index + 2, 1).string(product._id.toString());
    ws.cell(index + 2, 2).string(product.name);
    ws.cell(index + 2, 3).string(product.slug);
    ws.cell(index + 2, 4).string(product.description);
    ws.cell(index + 2, 5).number(product.price);
    ws.cell(index + 2, 6).string(product.image);
    ws.cell(index + 2, 7).string(product.shop.toString());
    ws.cell(index + 2, 8).string(product.category.toString());
    ws.cell(index + 2, 9).string(moment(product.lastAcctive).format('DD/MM/YYYY - HH:mm:ss'));
    ws.cell(index + 2, 10).string(moment(product.createdAt).format('DD/MM/YYYY - HH:mm:ss'));
  });

  return wb;
};

module.exports = {
  exportExcel,
  createProduct,
  getMyProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductsByKeyword,
};
