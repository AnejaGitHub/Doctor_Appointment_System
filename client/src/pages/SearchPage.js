import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import { Row } from 'antd';
import DoctorList from '../components/DoctorList';

const HomePage  = () => {
  const [doctors, setDoctors] = useState([]);
   
//login user data
  const getUserData = async () => {
    try {
      const res =  await axios.get('/api/v1/user/getDoctorByName', {
        headers:{
          Authorization: "Bearer " + localStorage.getItem('token'),
        },
      });
      if(res.data.success){
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }


  useEffect(() => {
    
  }, [])
  return (
    <Layout>
      <h1 className='text Center'>Doctors</h1>
      <form action="/user/getDoctorByName" method="post">
        <label htmlFor="header-search">
            <span className="visually-hidden">Search Doctors</span>
        </label>
        <input
            type="text"
            id="header-search"
            placeholder="Search blog posts"
            name="query" 
        />
        <button type="submit">Search</button>
    </form>
      <Row>
        {doctors && doctors.map(doctor => (
          <DoctorList doctor={doctor}></DoctorList>
        ))}
      </Row>
    </Layout>
  )
}

export default HomePage
