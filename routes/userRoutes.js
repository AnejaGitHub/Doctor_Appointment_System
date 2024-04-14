const express = require('express')
const { 
    loginController, 
    registerController, 
    authController, 
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDoctorsController,
    bookAppointmentController,
    bookingAvailabilityController,
    userAppointmentsController,
    getDoctorByNameController,
} = require('../controllers/userCtrl')
const authMiddleware = require("../middlewares/authMiddleware");

//router object 
const router = express.Router()

//routes
//LOGIN || POST
router.post('/login', loginController);

//REGISTER || POST
router.post('/register', registerController);

//Auth || POST
router.post('/getUserdata', authMiddleware, authController);

//Apply Doctor || Post
router.post('/apply-doctor', authMiddleware, applyDoctorController)

//Notification || Post
router.post('/get-all-notification', authMiddleware, getAllNotificationController)

//Notification delete || Post
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController)

//GET ALL DOC
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController)

//BOOK APPOINTMENT
router.post('/book-appointment', authMiddleware, bookAppointmentController);

//CHECK AVAILABILITY
router.post('/booking-availability', authMiddleware, bookingAvailabilityController);

//Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);

// Search doctor by name
router.post('/getDoctorByName', authMiddleware, getDoctorByNameController)

router.get('/searchPage', authMiddleware, getDoctorByNameController)

module.exports = router