const Customer = require("../models/customerModel");

// @desc    Create a new customer
// @route   POST /api/customers
const createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({ message: "✅ Customer created successfully", customer });
  } catch (error) {
    res.status(400).json({ message: "❌ Failed to create customer", error: error.message });
  }
};

// @desc    Get all customers
// @route   GET /api/customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to fetch customers", error: error.message });
  }
};

// @desc    Get a single customer
// @route   GET /api/customers/:id
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "❌ Customer not found" });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to fetch customer", error: error.message });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: "❌ Customer not found" });
    res.status(200).json({ message: "✅ Customer updated successfully", customer });
  } catch (error) {
    res.status(400).json({ message: "❌ Failed to update customer", error: error.message });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: "❌ Customer not found" });
    res.status(200).json({ message: "✅ Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to delete customer", error: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
