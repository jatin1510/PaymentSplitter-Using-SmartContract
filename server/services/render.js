const axios = require('axios');
const { customer, admin, product, company } = require('../model/model');


exports.homeRoutes = (req, res) => {
    res.render('loginPage');
}

exports.home = (req, res) => {
    res.render('home');
}

exports.register = (req, res) => {
    res.render('registerPage');
}

exports.products = async (req, res) => {
    const id = req.query.id;
    if (!req.query.id) {
        product.find()
            .then(async (data) => {
                res.render('home', { product: data, role: req.role });
            })
    }
    else {
        product.findById(id)
            .then(async (data) => {
                res.render('product', { data });
            })
    }
}