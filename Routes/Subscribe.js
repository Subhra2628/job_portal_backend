const express = require("express");

const router = express.Router();

//import subsrcibe controller

const subscribe=require("../Controller/subscribe_email");

//route for subscribe
router.post("/subscribes",subscribe);

module.exports = router;