const express = require("express");
const auth = require("../middleware/auth");
const controller = require("../controllers/customerController");

const router = express.Router();
router.use(auth);
router.get("/", controller.list);
router.patch("/:id/facturas/:facturaId/abono", controller.addInvoicePayment);
router.patch("/:id/facturas/:facturaId/cancelar", controller.cancelInvoice);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
