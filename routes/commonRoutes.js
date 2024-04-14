const express = require('express')
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllUsersController } = require('../controllers/adminCtrl');

const router = express.Router()

//POST METHOD || USERS
router.get('/getDoctorByName', authMiddleware, getDoctorByNameController)



module.exports = router