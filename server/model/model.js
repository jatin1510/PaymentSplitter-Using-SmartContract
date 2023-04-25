const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true }
});

const customerSchema = new Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true }
});

const productSchema = new Schema({
    productName: { type: String, required: true },
    image: {type: String},
    amount: { type: Number, required: true },
});

const companySchema = new Schema({
    address: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
});

const customer = mongoose.model('Customer', customerSchema);
const admin = mongoose.model('Admin', adminSchema);
const product = mongoose.model('Product', productSchema);
const company = mongoose.model('Company', companySchema);

module.exports = { customer, admin, product, company };