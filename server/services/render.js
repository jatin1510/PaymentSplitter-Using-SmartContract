const axios = require('axios');

exports.homeRoutes = (req, res) =>
{
    res.render('loginPage');
}

exports.home = (req, res) =>
{
    res.render('home');
}

exports.register = (req, res) =>
{
    res.render('registerPage');
}