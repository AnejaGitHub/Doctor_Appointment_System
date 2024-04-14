const doctorModel = require('../models/doctorModel')
// import { message } from 'antd';
const userModel = require('../models/userModuls')


// const getDoctorByNameController = async (req, res) => {
//     try {
//         const users = await userModel.find({});
//         res.status(200).send({
//             success:true,
//             message:'user data',
//             data:users,
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success:false,
//             message:'Error while fetching users',
//             error,
//         })
//     }
// }

const getDoctorByNameController = async(req, res) => {
    try {
        const doctors = await doctorModle.find({firstName:req.body.query});
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

module.exports = {getDoctorByNameController}