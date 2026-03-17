const express = require("express");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getSettings, updateSettings } = require("../controllers/settingsController");

const router = express.Router();
router.use(auth);
router.get("/", getSettings);
router.put("/", upload.single("logo"), updateSettings);

module.exports = router;
