const express = require("express");
const { getAllGroups, createGroup } = require("../controllers/groupController");
const router = express.Router();

router.get("/", getAllGroups);
router.post("/", createGroup);

module.exports = router;
