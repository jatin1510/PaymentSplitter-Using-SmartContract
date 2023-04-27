const express = require('express');
const route = express.Router();
const services = require('../services/render');
const controller = require('../controller/controller');
const { authorization, authorizationAdmin } = require('../middleware/middleware');

route.get('/', services.homeRoutes);
route.get('/registerCustomer', services.register);

route.post('/login', controller.findPerson);
route.get('/profile', authorization, controller.alreadyLoggedIn);

route.post('/registerAdmin', controller.registerAdmin);
route.post('/registerCustomer', controller.registerCustomer);

// Route for communicating with contracts
route.get('/totalShare', controller.totalShare);
// route.get('/totalPaid', controller.totalPaid);
// route.get('/payableAmount', controller.payableAmount);
// route.get('/addCompany', controller.addCompany);
// route.get('/alreadyReceived', controller.alreadyReceived);
// route.get('/sendCompany', controller.sendCompany);

// development (TODO: Authorize)
route.get('/productForm', authorizationAdmin,services.productForm);
route.get('/companyForm', authorizationAdmin,services.companyForm);
route.post('/addProduct', authorizationAdmin, controller.addProduct);
route.post('/addCompany', authorizationAdmin, controller.addCompany);
route.get('/product', authorization, services.products);
route.get('/buy/:id', authorization, controller.buyProdut);
route.get('/payNow/:productId', authorization, controller.payNow);
route.get('/companies', authorizationAdmin, services.companies);
route.get('/delete',controller.deleteIt);
route.get('/deleteCompany/:companyId',authorizationAdmin,services.deleteCompany);

module.exports = route;