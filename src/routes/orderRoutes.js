const express = require("express");
const auth = require("../middleware/auth");
const controller = require("../controllers/orderController");

const router = express.Router();
router.use(auth);
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.patch("/:id/status", controller.updateStatus);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
