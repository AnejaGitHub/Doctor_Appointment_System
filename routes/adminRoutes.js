const express = require('express')
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController, getAdminInfoController } = require('../controllers/adminCtrl');

const router = express.Router()

//GET METHOD || USERS
router.get('/getAllUsers', authMiddleware, getAllUsersController)

//GET METHOD || DOCTORS
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController)

//POST  ACCOUNT STATUS
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController)

//Post get profile
router.post('/getAdminInfo', authMiddleware, getAdminInfoController)

module.exports = router