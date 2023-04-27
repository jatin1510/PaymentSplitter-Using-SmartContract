const axios = require('axios');
const { customer, admin, product, company, customerProduct } = require('../model/model');
const { paymentSplitter, account0 } = require('../web3/web3')

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
    const customerId = req.query.customerId;
    if (!id && !customerId) {
        product.find()
            .then(async (data) => {
                if (await customerProduct.findOne({ email: req.email })) {
                    res.render('home', { product: data, role: req.role, flag1: 1, flag2: 0, customerId: req.id });
                }
                else {
                    res.render('home', { product: data, role: req.role, flag1: 0, flag2: 0, customerId: req.id });
                }
            })
    }
    else if (!customerId) {
        product.findById(id)
            .then(async (data) => {
                res.render('product', { product: data });
            })
    }
    else {
        customerProduct.find({ customerId: customerId })
            .then(async (data) => {
                var ls = [];
                var date = [];
                for (var i = 0; i < data.length; i++) {
                    const pro = await product.findById(data[i].productId);
                    await ls.push(pro);
                    await date.push(data[i].date);
                }
                res.render('home', { product: ls, date: date, flag1: data.length, flag2: 1 });
            })
    }
}

exports.companies = async (req, res) => {
    try {
        company.find()
            .then(async (data) => {
                var amount = [];
                var shareAmount = [];
                for (var i = 0; i < data.length; i++) {
                    amount.push(await paymentSplitter.methods.alreadyReceived(data[i].address).call());
                    shareAmount.push(await paymentSplitter.methods.payableAmount(data[i].address).call());
                }
                res.render('companies', { company: data, amount: amount, shareAmount: shareAmount });
            })
    } catch (err) {
        res.send(err);
    }
}

exports.productForm = async (req, res) => {
    try {
        res.render('productForm');
    } catch (err) {
        res.send(err);
    }
}

exports.companyForm = async (req, res) => {
    try {
        res.render('companyForm');
    } catch (err) {
        res.send(err);
    }
}

exports.deleteCompany = async (req, res) => {
    try {
        await axios.get(`http://localhost:3000/delete?companyId=${req.params.companyId}`).then(async (data) => {
            res.redirect('/companies');
        });
    } catch (err) {
        res.send(err);
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        await axios.get(`http://localhost:3000/delete?productId=${req.params.productId}`).then(async (data) => {
            res.redirect('/product');
        })
    } catch (err) {
        res.send(err);
    }
}