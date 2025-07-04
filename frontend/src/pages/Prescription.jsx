import React, { useContext, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, User } from 'lucide-react';
import { UserContext } from '../context/mednutriContext.jsx';
import SchedulePrescriptionForm from '../components/SchedulePrescriptionForm.jsx';
import axios from 'axios';
import UpcomingPrescriptions from '../components/UpcomingPrescriptions.jsx';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header.jsx';
import axiosInstance from '../utils/axiosInstance.jsx';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Prescription = () => {
  const { user,token,sidebarOpen,setSidebarOpen,prescriptions,setPrescriptions } = useContext(UserContext);
  
  useEffect(() => {
    const fetchPrescriptions = async () => {
     try {
      const res = await axiosInstance.get('/api/prescription/get')
      setPrescriptions(res.data);
    }
     catch(error) {
        toast.error("Error Fetching Prescriptions",{
          autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
        })
     }}
    if(token){
      fetchPrescriptions();
    }
    },[token]);

    const handleDelete = async (id) => {
      try {
        await axiosInstance.delete(`/api/prescription/delete/${id}`);

        toast("Deleted prescription successfully!",{
          autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
        })
        setPrescriptions(prescriptions.filter((pres) => pres._id !== id));
      } catch (error) {
        toast.error("Unable to delete Prescription",{
          autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
        });
      }
    }

    if(!user) {
      return <div className='w-full h-screen text-white bg-black flex justify-center items-center'>
        <h2>Loading...</h2>
      </div>
    }

  return (
    <div className='min-h-screen relative w-full '>
       <img src="/bg-img1-optimized.webp" alt="background-image" className="absolute right-0 top-0 h-full w-full opacity-100 z-0" />


      <div className='min-h-screen flex relative w-full'>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

      <div className='bg-black/80 w-full relative flex flex-col  gap-2 px-2 py-2 z-10'>
       <Header/>

      <h1 className='text-gray-100 text-lg md:text-xl font-medium md:px-1 md:px-0 y-2 md:py-0'>Schedule <span className='text-[#3bd470]'>Prescriptions</span></h1>

      <div className='grid md:grid-cols-2 gap-2'>

      <div className='text-white rounded-lg shadow-md hidden md:flex flex-col justify-start gap-2 '>
        <div className='bg-[#101010] px-6 py-6'>
        <h2 className='text-lg font-semibold mb-1 text-[#3bd470]'>Prescription Summary</h2>
        <p>Total Prescriptions: {prescriptions.length}</p>
        <p>Reminder Active: ✅</p>
        <p>Tips: Take medicine with food if advised.</p>
        </div>

        <div className='w-full bg-[#101010] md:py-3  px-2 hidden md:flex justify-center'>
          <UpcomingPrescriptions />
        </div>
      </div>

      <SchedulePrescriptionForm />
      </div>
       
       
      <h1 className='text-gray-100 text-lg md:text-xl font-medium px-1 md:px-1 pt-5  md:pt-0 md:py-0 mt-2'>All <span className='text-[#3bd470]'>Prescriptions</span></h1>
      
      {/* Fetch Meaplans */}
      <div className='grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2'>
       {prescriptions.length === 0 ? ( <div className='h-36'><h2 className='text-white px-1 py-2'>No Prescriptions Found</h2></div> ) : (  prescriptions.map((item) => (
          <ul key={item._id} className='p-4 md:p-8 gap-1 flex flex-col bg-[#0f0f0f] text-gray-100 text-[0.9rem] md:text-[1.rem] rounded w-full'>
            <li className='font-medium text-white'>Medication: <span className='text-[#3bd470] font-semibold'>{item.medications}</span></li>
            <li className='font-medium text-white'>Dosage: {item.dosage}</li>
            <li className='font-medium text-white'>Frequency: {item.frequency}</li>
            <li className='font-medium text-white'>Timing: {item.timing}</li>
            <li className='font-medium text-white'>Note: {item.notes}</li>
            <button onClick={() => handleDelete(item._id) } className='h-6 mt-4 bg-[#3bd470] hover:bg-[#34bf63] px-2 outline-none text-sm  text-[#171717] '>Delete</button>

          </ul>
        )))
      }
      </div>
      </div>
      </div>
    </div>
  )
}

export default Prescription