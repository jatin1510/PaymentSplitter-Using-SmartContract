const bcrypt = require('bcrypt');
const { customer, admin, product, company } = require('../model/model');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const CONTACT_ABI = require('../../config.js');
const CONTACT_ADDRESS = require('../../config.js');
const Web3 = require('web3');
require('dotenv').config({ path: 'config.env' });

// Interaction with contract
if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider);
} else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
}
const GAS_LIMIT = 1000000;
var account0;
web3.eth.getAccounts().then(function (result) {
    account0 = result[0];
})
const paymentSplitter = new web3.eth.Contract(CONTACT_ABI.CONTRACT_ABI, CONTACT_ADDRESS.CONTRACT_ADDRESS);

const cookie_expires_in = 24 * 60 * 60 * 1000;

const generateToken = async (id, email, role) => {
    return await jwt.sign(
        { id, email, role },
        process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// login
exports.findPerson = async (req, res) => {
    const email = req.body.email;
    const role = req.body.role;
    const password = req.body.password;

    console.log(email, role, password);
    if (role == "Customer") {
        await customer.find({ email: email })
            .then(async (data) => {
                if (!data) {
                    res
                        .status(404)
                        .send({ message: `Not found user with email: ${email} ` });
                } else {
                    if (!bcrypt.compareSync(password, data[0].password)) {
                        res
                            .status(500)
                            .send({ message: `Password Invalid` });
                        return;
                    }
                    // create token
                    const token = await generateToken(data[0]._id, email, role);
                    res.cookie("jwt", token, { maxAge: cookie_expires_in, httpOnly: true });
                    // console.log(data);
                    res.redirect('/product');

                }
            })
            .catch((err) => {
                res
                    .status(500)
                    .send({ message: `Error retrieving user with email ${email}` });
            });
    }
    else {
        await admin.find({ email: email })
            .then(async (data) => {
                if (!data) {
                    // Make new webpage for all not found errors
                    res
                        .status(404)
                        .send({ message: `Not found admin with email: ${email} ` });
                } else {
                    // create token
                    const token = await generateToken(data[0]._id, email, role);
                    res.cookie("jwt", token, { maxAge: cookie_expires_in, httpOnly: true });
                    // console.log(data);
                    res.redirect('/product');
                }
            })
            .catch((err) => {
                res
                    .status(500)
                    .send({ message: `Error retrieving user with email ${email}` });
            });
    }
};

exports.alreadyLoggedIn = async (req, res) => {
    const _id = req.id;
    const email = req.email;
    const role = req.role;
    console.log(email, role, _id);

    if (role == "Customer") {
        await customer.findById(_id)
            .then((data) => {
                if (!data) {
                    res
                        .status(404)
                        .send({ message: `Not found user with email: ${email} ` });
                } else {
                    // res.render('studentProfile', { student: data });
                    // res.send(data);
                    res.redirect('/product');
                    
                }
            })
            .catch((err) => {
                console.log(err);
                res
                    .status(500)
                    .send({ message: `Error retrieving user with email ${email}` });
            });
    }
    else {
        await admin.findById(_id)
            .then(async (data) => {
                if (!data) {
                    // Make new webpage for all not found errors
                    res
                        .status(404)
                        .send({ message: `Not found admin with email: ${email} ` });
                } else {
                    // res.send(data);
                    res.redirect('/product');

                }
            })
            .catch((err) => {
                res
                    .status(500)
                    .send({ message: `Error retrieving user with email ${email}` });
            });
    }
};

// register
exports.registerCustomer = async (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }

    console.log(req.body);
    await bcrypt.hash(req.body.password, saltRounds)
        .then((hashedPassword) => {
            // new company
            const user = new customer({
                email: req.body.email,
                password: hashedPassword,
                address: req.body.address,
                customerName: req.body.customerName,
            })

            // save company in the database
            user
                .save(user)
                .then((data) => {
                    const token = generateToken(data._id, data.email, "Customer");
                    res.cookie("jwt", token, { maxAge: cookie_expires_in, httpOnly: true });
                    // res.send(user);
                    res.redirect('/product');


                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || 'Some error occured  while creating a create operation',
                    });
                });
        })
        .catch(err => {
            console.log('Error:', err);
        })
}

// Register company
exports.registerAdmin = async (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }

    await bcrypt.hash(req.body.password, saltRounds)
        .then((hashedPassword) => {
            // new company
            const user = new admin({
                email: req.body.email,
                password: hashedPassword,
                address: req.body.address,
            })

            // save company in the database
            user
                .save(user)
                .then((data) => {
                    const token = generateToken(data._id, user.email, "Admin");
                    res.cookie("jwt", token, { maxAge: cookie_expires_in, httpOnly: true });
                    res.send(user);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || 'Some error occured  while creating a create operation',
                    });
                });
        })
        .catch(err => {
            console.log('Error:', err);
        })
}

// while payee add
// share of that payee should be <= amount of product which (s)he is going to be participate

exports.addProduct = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }

    console.log(req.body);
    const user = new product({
        productName: req.body.productName,
        amount: req.body.amount,
    })

    // save company in the database
    user
        .save(user)
        .then((data) => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occured  while creating a create operation',
            });
        });
};

exports.addCompany = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }

    console.log(req.body);
    const address = req.body.address;
    const id = req.body.product;
    const share = req.body.share;

    const prod = await product.findById(id);
    // console.log(id)
    // if (share <= prod.amount) {
    try {
        console.log(account0);
        console.log(typeof share);
        // console.log(paymentSplitter.methods);
        await paymentSplitter.methods.addCompany(address, parseInt(share)).send({ from: account0, gas: GAS_LIMIT });

        console.log(prod);
        const user = new company({
            address: address,
            product: id,
        })

        // save company in the database
        user
            .save(user)
            .then(async (data) => {
                console.log(await paymentSplitter.methods.payableAmount(address).call());
                await product.findByIdAndUpdate(id, { amount: prod.amount + share }, { useFindAndModify: false });
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || 'Some error occured  while creating a create operation',
                });
            });
    }
    catch (err) {
        res.send(err);
    }
    // }
    // else {
    //     res.send('Share should be less than product amount');
    // }
};








// Interaction with contract
// if (typeof web3 !== 'undefined') {
//     var web3 = new Web3(web3.currentProvider);
// } else {
//     var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
// }

// var account0;
// web3.eth.getAccounts().then(function (result)
// {
//     account0 = result[0];
// })
// const paymentSplitter = new web3.eth.Contract(CONTACT_ABI.CONTRACT_ABI, CONTACT_ADDRESS.CONTRACT_ADDRESS);

// exports.totalShare = async (req, res) =>
// {
//     // console.log(await paymentSplitter);
//     res.send(await paymentSplitter.methods.totalShareAmounts().call());
// };

// exports.totalPaid = async (req, res) =>
// {
//     // console.log(await paymentSplitter);
//     res.send(await paymentSplitter.methods.totalPaidAmount().call());
// };

// exports.payableAmount = async (req, res) =>
// {
//     console.log(await paymentSplitter);
//     res.send(await paymentSplitter.methods.payableAmount("0x8fE55e5D2957d800b130d3337D8a7804Ab6Ad237").call());
// };

// exports.addCompany = async (req, res) =>
// {
//     // console.log(await paymentSplitter);
//     await paymentSplitter.methods.addCompany("0x8fE55e5D2957d800b130d3337D8a7804Ab6Ad237", 100).send({ from: account0, gas: 1000000 });
//     res.redirect('/totalShare');
// };

// exports.alreadyReceived = async (req, res) =>
// {
//     res.send(await paymentSplitter.methods.alreadyReceived("0x8fE55e5D2957d800b130d3337D8a7804Ab6Ad237").call());
// };

// exports.sendCompany = async (req, res) =>
// {
//     await paymentSplitter.methods.sendCompanyAmount("0x8fE55e5D2957d800b130d3337D8a7804Ab6Ad237").send({ from: account0, gas: 1000000 });
//     res.redirect('/alreadyReceived');
// };