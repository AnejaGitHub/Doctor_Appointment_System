import React, { useEffect, useState, } from 'react';
import Layout from '../../components/Layout'
import axios from 'axios'
import { render } from '@testing-library/react';
import { Table, message } from 'antd';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  // get users
  const getDoctors = async () => {
    try {
      const res = await axios.get('/api/v1/admin/getAllDoctors',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(res.data.success){
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);

    }
  }

  //Handle Account
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post('/api/v1/admin/changeAccountStatus', 
      {doctorId: record._id,userId: record.userId, status:status}, 
      {
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      if(res.data.success){
        message.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  }

  useEffect(() => {
    getDoctors();
  }, []);

  // antD table col
  const columns = [
    {
      title:'Doctor',
      dataIndex: 'isDoctor',
      render: (text, record) => <span>{record.firstName} {record.lastName}</span>,
    },
    {
      title:'Status',
      dataIndex: 'status',
    },
    {
      title:'Phone',
      dataIndex: 'phone',
    },
    {
      title:'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className='d-flex'>
          {record.status === 'approved' ? (
            <button className='btn btn-danger' 
              onClick={() => handleAccountStatus(record, 'reject')}>
              Reject
            </button>
          ) : (
            <button className='btn btn-success'
              onClick={() => handleAccountStatus(record, 'approved')}>
            Approve</button>
          )}
        </div>
      )
    },
  ]

  return (
    <Layout>
      <h1 className='text-center m-2'>Doctors</h1>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  )
}

export default Doctors
