import React from 'react'
import { useNavigate } from 'react-router-dom';

const DoctorList = ({doctor}) => {
    const navigate = useNavigate();

  return (
    <div>
      <>
        <div className='card m-2' 
         style={{cursor:'pointer'}}
         onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}>
           <div className='card-header'>
             <h3 className=''>Dr. {doctor.firstName} {doctor.lastName}</h3>
           </div>
           <div className='card-body'>
             <p>
                <b>Specialization</b> {doctor.specialization}
             </p>
             <p>
                <b>Experience</b> {doctor.experience} years
             </p>
             <p>
                <b>Fees Per Consultation</b> Rs.{doctor.feesPerCunsaltation}/
             </p>
             <p>
                <b>Timings</b> {doctor.timings[0]} - {doctor.timings[1]}
             </p>
             
           </div>
        </div>
      </>
    </div>
  )
}

export default DoctorList
