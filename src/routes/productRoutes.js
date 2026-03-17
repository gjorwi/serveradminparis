const express = require("express");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const controller = require("../controllers/productController");

const router = express.Router();

router.use(auth);
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", upload.array("images", 3), controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
