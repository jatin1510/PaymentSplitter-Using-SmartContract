const bcrypt = require('bcrypt');
const { customer, admin, product, company, customerProduct } = require('../model/model');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { paymentSplitter, account0, GAS_LIMIT } = require('../web3/web3');
const axios = require('axios');

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
                .then(async (data) => {
                    const token = await generateToken(data._id, data.email, "Customer");
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
                .then(async (data) => {
                    const token = await generateToken(data._id, user.email, "Admin");
                    res.cookie("jwt", token, { maxAge: cookie_expires_in, httpOnly: true });
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

// while payee add
// share of that payee should be <= amount of product which (s)he is going to be participate

exports.addProduct = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }

    const user = new product({
        productName: req.body.productName,
        amount: req.body.amount,
        image: req.body.image,
    })

    // save company in the database
    user
        .save(user)
        .then((data) => {
            res.redirect('/product');
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

    // console.log(req.body);
    // console.log(paymentSplitter);
    const address = req.body.address;
    const product1 = req.body.product;
    const share = req.body.share;

    const prod = await product.findOne({ productName: product1 });
    const id = prod._id;
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
                await product.findByIdAndUpdate(id, { amount: parseInt(prod.amount) + parseInt(share) }, { useFindAndModify: false });
                res.redirect('/companies');
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
}

exports.buyProdut = async (req, res) => {

    const productId = req.params.id
    const customerProd = new customerProduct({
        customerId: req.id,
        productId: productId,
    })


    customerProd
        .save(customerProd)
        .then(async (data) => {
            res.redirect('/product');
        })
}

exports.payNow = async (req, res) => {
    try {
        const productId = req.params.productId;
        company.find({ product: productId })
            .then(async (data) => {
                for (var i = 0; i < data.length; i++) {
                    // console.log(account0);
                    await paymentSplitter.methods.sendCompanyAmount(data[i].address).send({ from: account0, gas: GAS_LIMIT });
                }
                customerProduct.deleteOne({ customerId: req.id, productId: productId })
                    .then(async (data) => {
                        res.redirect(`/product`);
                    })
            });
    } catch (err) {
        res.send(err);
    }
};

exports.deleteIt = async (req, res) => {
    const companyId = req.query.companyId;
    const productId = req.query.productId;
    if (!productId) {
        try {
            const data = await company.findById(companyId);
            const pro = await customerProduct.findOne({ productId: data.product });
            console.log(data);
            if (!pro) {
                const am = await paymentSplitter.methods.payableAmount(data.address).call();
                await product.findByIdAndUpdate(data.product, { $inc: { amount: parseInt(am) * (-1) } });
                await paymentSplitter.methods.removeElement(data.address).send({ from: account0, gas: GAS_LIMIT });
                company.findByIdAndDelete(companyId)
                    .then(async (data) => {
                        res.send(data);
                    })
            } else {
                console.log("Company's payments are still pending.");
                res.send("Company's payments are still pending.");
            }
        } catch (err) {
            res.send(err);
        }
    }
    else {
        try {
            company.find({ product: productId })
                .then(async (data) => {
                    for (var i = 0; i < data.length; i++) {
                        console.log(data);
                        await axios.get(`http://localhost:3000/delete?companyId=${data[i]._id}`);
                    }
                    product.findByIdAndDelete(productId)
                        .then((data) => {
                            res.send(data);
                        })
                })
        } catch (err) {
            res.send(err);
        }
    }
};

exports.totalShare = async (req, res) => {
    // console.log(await paymentSplitter);
    try {

        res.send(await paymentSplitter.methods.totalShareAmounts().call());
    } catch (err) {
        res.send(err);
    }
};

exports.totalPaid = async (req, res) => {
    try {
        res.send(await paymentSplitter.methods.totalPaidAmount().call());
    } catch (err) {
        res.send(err);
    }
};

exports.payAll = async (req, res) => {
    try {
        await paymentSplitter.methods.payAll().send({ from: account0, gas: GAS_LIMIT });
        await customerProduct.deleteMany({});
        res.redirect('/companies');
    } catch (err) {
        res.send(err);
    }
}