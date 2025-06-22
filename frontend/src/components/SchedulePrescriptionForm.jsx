import axios from 'axios';
import React, { useContext, useState } from 'react'
import { UserContext } from '../context/mednutriContext';
import { ToastContainer, toast } from 'react-toastify';

const SchedulePrescriptionForm = () => {

  const { token } = useContext(UserContext);

  const [formData,setFormData] = useState({
    medications:"",
    dosage:"",
    frequency:"",
    timing:"",
    notes:"",
    email:""
  })

  const handleChange = (e) => {
      const { name , value } = e.target;

      setFormData({
        ...formData,
        [name]:value
      })
  };

  const handleSubmit = async(e) => {
    try {
        e.preventDefault();
        await axios.post("/api/prescription/create",
            formData,
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast('Scheduled presciption successfully!',{
          autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
        });
        setFormData({
          medications:"",
          dosage:"",
          frequency:"",
          timing:"",
          notes:"",
          email:""
        })
    } catch (error) {
        toast.error("Error scheduling Prescriptions",{
          autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
        })
    }
  }

  
  return (
    <div >
        <form onSubmit={handleSubmit} className='flex flex-col gap-1 text-[0.85rem] md:text-[1rem] text-white'>
        <h2 className='font-semibold mt-2 md:mt-0 md:mb-1 text-normal text-gray-300'>Enter Medication Details</h2>
        <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] w-full rounded' type="text" name='medications' value={formData.medications}  placeholder='Enter medications name (eg.Chrocin)' onChange={handleChange} required />
        <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="text" name='dosage' value={formData.dosage}  placeholder='Enter dosage (eg.1 tablet) ' onChange={handleChange} required /> 
        <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="text" name='frequency' value={formData.frequency}  placeholder='Enter frequency (eg.Daily)' onChange={handleChange} required />
        <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="text" name='timing' value={formData.timing}  placeholder='Enter medications time (eg.12:00) in 24hr format' onChange={handleChange} required />
        <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="email" name='email' value={formData.email}  placeholder='Enter a valid email' onChange={handleChange} required />
        <textarea className='h-14 px-3 py-2 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="text" name='notes' value={formData.notes}  placeholder='Enter medications notes' onChange={handleChange} />
        <button className='h-10 md:h-12 bg-[#3bd470] hover:bg-[#34bf63] px-3 outline-none font-semibold text-black rounded ' type='submit'>Schedule Prescription</button>
        </form>
    </div>
  )
}

export default SchedulePrescriptionForm