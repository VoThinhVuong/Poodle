const express = require('express');
const generalController = require('../controllers/general.js');
const generalRouter = express.Router();

generalRouter.post('/login', generalController.loginReq);
generalRouter.post('/accountInfo', generalController.getAccountInfo);
generalRouter.post('/courseInfo', generalController.getCourseInfo);

module.exports = generalRouter;