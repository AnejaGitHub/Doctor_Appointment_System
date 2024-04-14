import React from 'react'
import Layout from '../components/Layout'
import { Tabs, message, } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoading, showLoading } from '../redux/features/alertSlice'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
const dispatch = useDispatch();
const navigate = useNavigate();

  const { user } = useSelector(state => state.user);
  const handleMarkAllRead = async () =>{
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/get-all-notification', {userId:user._id},
      {
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      dispatch(hideLoading());
      if(res.data.success){
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong')
    }
  }
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/delete-all-notification', {userId:user._id}, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      dispatch(hideLoading());
      if(res.data.success){
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong in Notification');
    }
  }
  return (
    <Layout>
      <h4 className='p-3 text-center'>Notification Page</h4>
      <Tabs>
        <Tabs.TabPane tab='unRead' key={0}>
          <div className='d-flex justify-content-end'>
            <h4 className='p-2' onClick={handleMarkAllRead}
              style={{cursor:'pointer', color:'blueviolet'}}>
              Mark All Read
            </h4>
          </div>
          {
            user?.notifcation.map((notificationMgs) => (
              <div className='card' 
                style={{cursor:'pointer'}}
              >
                <div className='card-text' onClick={navigate(notificationMgs.onClickPath)}>
                  {notificationMgs.message}
                </div>
              </div>
            ))
          }
        </Tabs.TabPane>
        <Tabs.TabPane tab='Read' key={1}>
          <div className='d-flex justify-content-end'>
            <h4 className='p-2 text-primary' onClick={handleDeleteAllRead}
              style={{cursor:'pointer'}}
            >
              Delete All Read
            </h4>
          </div>
          {
            user?.seennotification.map((notificationMgs) => (
              <div className='card' 
                style={{cursor:'pointer'}}
              >
                <div className='card-text' onClick={navigate(notificationMgs.onClickPath)}>
                  {notificationMgs.message}
                </div>
              </div>
            ))
          }
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  )
}

export default NotificationPage
