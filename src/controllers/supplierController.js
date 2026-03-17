const createCrudController = require("./crudFactory");
const Supplier = require("../models/Supplier");

module.exports = createCrudController(Supplier);
