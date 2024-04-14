import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Row } from 'antd';
import DoctorList from '../components/DoctorList';
import { Form, Input, Button, message } from 'antd';

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllDoctors();
  }, []); // Fetch all doctors only once on component mount

  const getAllDoctors = async () => {
    try {
      const res = await axios.get('/api/v1/user/getAllDoctors', {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const getDoctorsByName = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/v1/user/getDoctorByName', values, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
        console.log(res.data.data);
      } else {
        message.error(res.data.message)
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const onFinishHandler = async (values) => {
    getDoctorsByName(values);
  }

  return (
    <Layout>
      <div className='d-flex'>
        <h1 className='text-center'>Doctors</h1>
        <Form layout='horizontal' onFinish={onFinishHandler} className="searchBar m-4 mt-3">
          <Form.Item name="query">
            <Input type="text" placeholder="Search" />
          </Form.Item>
          <Button type='primary' htmlType='submit' loading={loading}>
            Search
          </Button>
        </Form>
      </div>
      <Row>
        {doctors.map(doctor => (
          <DoctorList key={doctor.id} doctor={doctor}></DoctorList>
        ))}
      </Row>
    </Layout>
  );
}

export default HomePage;
