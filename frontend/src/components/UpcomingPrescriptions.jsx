import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/mednutriContext'
import axios from 'axios';
import { toast } from 'react-toastify';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const UpcomingPrescriptions = () => {
    const { token } = useContext(UserContext);
    const [ prescriptions,setPrescriptions ] = useState([]);

    useEffect(()=> {
        const fetchPrescriptions = async() => {
        try {
            const res = await axios.get(`${BASE_URL}/api/prescription/get`, {
                headers:{ 
                    Authorization:`Bearer ${token}`
                }
            })

            const now = new Date();
            const nowHours = now.getHours();
            const nowMin = now.getMinutes();


            
            const upcoming = res.data.filter((item) => {
               const timeStr = String(item.timing); 
               const [ hour , min ] = timeStr.split(":").map(Number);
               return hour > nowHours || ( hour === nowHours && min > nowMin);
            });
            setPrescriptions(upcoming.slice(0,2));

        }
        catch (error) {
            toast.error("Error fetching Prescriptions",{
            autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
            });
        };
        }
        if(token) {
            fetchPrescriptions();
        }
    },[token])
    return (
      <div className='flex flex-col md:py-1 justify-center  md:items-center md:gap-2'>
        <h2 className='text-gray-100 font-semibold md:text-xl '>Upcoming <span className='text-[#3bd470]'>Prescriptions</span></h2>
        <p className='text-gray-100 mb-1 md:mb-2 text-sm md:text-normal' > Only prescriptions scheduled later today are shown here.</p>
        <div className='text-gray-100 flex'>
            { prescriptions.length === 0 ? (
                <p className='text-gray-100 text-xl'>No prescriptions Scheduled</p>
            ) : ( <div className='grid md:grid-cols-2 '>
               { prescriptions.map((item,index) => (
                <ul key={index} className='flex flex-col  px-1 py-3 md:p-6 text-normal md:text-lg gap-1 md:gap-1'>
                    <li><span className='text-[#3bd470]'>Medications: </span>{item.medications}</li>
                    <li><span className='text-[#3bd470]'>Dosage: </span>{item.dosage}</li>
                    <li><span className='text-[#3bd470]'>Timing: </span>{item.timing}</li>
                </ul>
            ))}
            </div> )
            } 
        </div>
      </div>
  )
}

export default UpcomingPrescriptions