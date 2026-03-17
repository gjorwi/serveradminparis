const createCrudController = require("./crudFactory");
const ReportSnapshot = require("../models/ReportSnapshot");

module.exports = createCrudController(ReportSnapshot);
