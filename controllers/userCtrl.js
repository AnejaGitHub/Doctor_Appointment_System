const userModel = require('../models/userModuls')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctorModle = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const moment = require('moment');
const doctorModel = require('../models/doctorModel');

//register callback
const registerController = async (req, res) => {
    try {
        const exisitingUser = await userModel.findOne({email:req.body.email})
        if(exisitingUser){
            return res.status(200).send({message:'Usr Already Exist', success:false})
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(201).send({message:'Register Successfully', success: true});

    } catch (error) {
        console.log(error);
        res.status(500).send({success:false, message: `Register Controller ${error.message}`})
    }
};


//login callback
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({email:req.body.email})
        if(!user){
            return res.status(200).send({message:'user not found', success:false})
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if(!isMatch){
            return res.status(200).send({message:'Invalid Email or Password', success:false})
        }
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        res.status(200).send({message:'Login Success', success: true, token })
    } catch (error) {
        console.log(error)
        res.status(500).send({success:false, message:`Error in login CTRL ${error.message}`})
    }
}

const authController = async (req, res) => {
    try {
        const user = await userModel.findById({_id:req.body.userId})
        user.password = undefined;
        if(!user){
            return res.status(200).send({
                message:'user not found',
                success:false,
            })
        } else {
            res.status(200).send({
                success:true,
                data:user,
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'auth error',
            success:false,
            error
        })
    }
};

// Applyy Doctor CTRL
const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModle({...req.body, status:'pending'});
        await newDoctor.save();
        const adminUser = await userModel.findOne({isAdmin:true});
        const notifcation = adminUser.notifcation
        notifcation.push({
            type: 'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: '/admin/doctors',
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, {notifcation})
        res.status(201).send({
            success:true,
            message: 'Doctor Account Applied Successfully',
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message: 'Error while applying for doctor'
        })
    }
}

//notification CTRL
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({_id:req.body.userId});
        const seennotification = user.seennotification
        const notifcation = user.notifcation
        seennotification.push(...notifcation)
        user.notifcation = []
        user.seennotification = notifcation
        const updatedUser = await user.save();
        res.status(200).send({
            success: true,
            message: 'All notification marked as read',
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:'Error in notification',
            success:false,
            error,
        })
    }
};

//delete all notification
const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({_id:req.body.userId});
        user.notifcation = []
        user.seennotification = []
        const updatedUser = await user.save();
        updatedUser.password = undefined
        res.status(200).send({
            success: true,
            message: 'All notification deleted',
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:'Unable to delete all notification',
            success:false,
            error,
        })
    }
};

//Get all doctors
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModle.find({status: 'approved'});
        res.status(200).send({
            success:true,
            message:'Doctors List Fetched Successfully',
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error while fetching Doctors',
        })
    }
}

// Get doctor by name
const getDoctorByNameController = async(req, res) => {
    try {
        console.log(req.body.query);
        const doctor = await doctorModle.find({firstName:req.body.query});
        console.log(doctor);
        console.log("someone wants to search a doctor by name");
        res.status(200).send({
            success:true,
            message:'Doctor Fetched Successfully',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error while fetching Doctor',
        })
    }
}

//BOOK APPOINTMENT CTRL
const bookAppointmentController = async (req, res) => {
    try {
        // console.log(req.body);
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
        req.body.time = moment(req.body.time, 'HH:mm').toISOString()
        req.body.status = 'pending'
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        // console.log(newAppointment);
        const doc = await doctorModel.findOne({_id: req.body.doctorId});
        const user = await userModel.findOne({_id: doc.userId});
        user.notifcation.push({
            type: 'New-appointment-request',
            message: `A new Appointment Request from ${req.body.userInfo}`,
            onClickPath: '/user/appointments',
        })
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Appointment Book SuccessFully',
        }); 
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message: 'Error while Booking appointment',
        })
    }
}

// check availability
const bookingAvailabilityController = async (req, res) => {
    try {
        const date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
        const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString()
        const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString()
        const doctorId = req.body.doctorId
        const appointment = await appointmentModel.find({
            doctorId,
            date,
            time: {
                $gte:fromTime,
                $lte: toTime,
            },
        });
        if(appointment.length > 0) {
            return res.status(200).send({
                message: 'Appointment is not available at this time',
                success: true,
            });
        } else {
            return res.status(200).send({
                success: true,
                message: 'Appointment available at this time',
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message: 'Error in Booking',
        })
    }
}


// user appointments 
const userAppointmentsController = async (req, res) => {
    try {
      const appointments = await appointmentModel.find({
        userId: req.body.userId,
      });
      res.status(200).send({
        success: true,
        message: "Users Appointments Fetch SUccessfully",
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error In User Appointments",
      });
    }
  };

module.exports = { 
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
};