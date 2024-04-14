const doctorModel = require('../models/doctorModel')
// import { message } from 'antd';
const userModel = require('../models/userModuls')


const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).send({
            success:true,
            message:'user data',
            data:users,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while fetching users',
            error,
        })
    }
}

const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        res.status(200).send({
            success:true,
            message:'Doctors Data List',
            data:doctors,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while fetching doctors',
            error,
        })
    }
}

//Doctor Account status
const changeAccountStatusController = async ( req, res) => {
    try {
        const {doctorId, status } = req.body
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, {status})
        const user = await userModel.findOne({ _id:doctor.userId});
        const notifcation = user.notifcation;
        notifcation.push({
            type: 'doctor-account-request-updated',
            message:`Your Doctor Account Reques Has ${status}`,
            onClickPath: '/notification',
        });
        user.isDoctor = status === 'approved' ? true : false;
        await user.save();
        res.status(201).send({
            success:true,
            message: 'Account Status Updated',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Account Status',
            error,
        })
    }
}

//get admin info
const getAdminInfoController = async (req, res) => {
    try {
        const admin = await userModel.findOne({userId: req.body.userId})
        res.status(201).send({
            success: true,
            message:'Admin Details fetch Success',
            data:admin,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message:'Error in Fetching Admin Details',
        })
    }
}

module.exports = {getAllUsersController, getAllDoctorsController, changeAccountStatusController, getAdminInfoController}