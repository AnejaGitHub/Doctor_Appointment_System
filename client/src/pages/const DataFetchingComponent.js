// Higher-level component responsible for fetching data
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import HomePage from './HomePage'; // Assuming your original component is named HomePage

const DataFetchingComponent = () => {
  const [doctors, setDoctors] = useState([]);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // Function to fetch all doctors
  const getAllDoctors = async () => {
    try {
      const res = await axios.get('/api/v1/user/getAllDoctors', {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
        setInitialFetchDone(true); // Set initial fetch done after fetching data
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }

  useEffect(() => {
    if (!initialFetchDone) {
      getAllDoctors();
    }
  }, [initialFetchDone]);

  return (
    <Layout>
      {/* Pass doctors data as props to HomePage */}
      <HomePage doctors={doctors} />
    </Layout>
  );
}

export default DataFetchingComponent;
