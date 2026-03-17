const createCrudController = require("./crudFactory");
const Sale = require("../models/Sale");

module.exports = createCrudController(Sale);
