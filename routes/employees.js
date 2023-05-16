const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { all, add } = require('../controllers/employees');

// /api/employees/
router.get("/", auth, all);
// /api/employees/id
router.get("/:id", auth, () => console.log("get user"));
// /api/employees/add
router.post("/add", auth, add);
// /api/employees/remove/id
router.delete("/remove/id", auth, () => console.log("delete employee"));
// /api/employees/edit/id
router.put("/edit/id", auth, () => console.log("edit employee"));

module.exports = router;

// 1:53:18 видео 