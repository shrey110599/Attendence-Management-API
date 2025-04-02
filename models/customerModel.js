const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
});

const customerSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    vatNumber: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String },
    currency: { type: String, required: true },
    defaultLanguage: { type: String, required: true },
    address: { type: addressSchema, required: true },
    billingAddress: { type: addressSchema, required: true }, 
    shippingAddress: { type: addressSchema, required: true },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
