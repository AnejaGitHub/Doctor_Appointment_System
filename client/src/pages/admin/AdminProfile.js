import React, { useEffect, useState, } from 'react'
import Layout from '../../components/Layout'
import { useDispatch, useSelector, } from 'react-redux'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Row, Col, Form, Input, TimePicker, message } from 'antd'
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading, } from '../../redux/features/alertSlice';

const AdminProfile = () => {
  const { user } = useSelector(state => state.user)
  const [admin, setAdmin ] = useState(null)
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //update doc form handler
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/doctor/updateProfile',
       {...values, userId:user._id, }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      dispatch(hideLoading());
      if(res.data.success){
        message.success(res.data.message);
        navigate('/');
      } else {
        message.error(res.data.success);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went Wrong')
    }
  }

  //getDoc Details
  const getAdminInfo = async () => {
    try {
        const res = await axios.post('/api/v1/admin/profile', 
        {userId: params.id},
        {
            headers: {
                Authorization : `Bearer ${localStorage.getItem('token')}`,
            }
        })
        if(res.data.success){
            setAdmin(res.data.data)
        }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    getAdminInfo();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <h1>Manage Profile</h1>
      {admin &&  (
        <><Form layout='vertical' onFinish={handleFinish} className='m-3' 
          initialValues={{
            ...admin,
          }}>
          <h4 className=''>Personal Details : </h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label='First Name' name='firstName' required rule={[{ required: true }]}>
                <Input type='text' placeholder='your name' />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label='Last Name' name='lastName' required rule={[{ required: true }]}>
                <Input type='text' placeholder='your last name' />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label='Email' name='email' required rule={[{ required: true }]}>
                <Input type='text' placeholder='your email address' />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={24} lg={8}></Col>
            <Col xs={24} md={24} lg={8}>
              <button className='btn btn-primary form-btn' type='submit'>Update</button>
            </Col>
          </Row>
        </Form></>
      )}
    </Layout>
  )
}

export default AdminProfile
