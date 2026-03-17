const createCrudController = require("./crudFactory");
const Customer = require("../models/Customer");

module.exports = createCrudController(Customer);
