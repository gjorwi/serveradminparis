const express = require("express");
const auth = require("../middleware/auth");
const controller = require("../controllers/reportController");

const router = express.Router();
router.use(auth);
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
