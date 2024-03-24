const express = require('express');
const { contactController } = require('../../controllers');
const { auth, authorize } = require('../../middlewares/auth.middleware');

const contactRouter = express.Router();
contactRouter.use(auth);
contactRouter.use(authorize('admin'));

contactRouter.route('/').get(contactController.getContacts).post(contactController.createContact);

contactRouter.route('/:contactId').get(contactController.getContact).delete(contactController.deleteContact);

module.exports = contactRouter;
