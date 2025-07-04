import { useContext, useState } from 'react'
import { UserContext } from '../context/mednutriContext'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
const BASE_URL = import.meta.env.VITE_BACKEND_URL

const GenerateMealPlanForm = ({ onMealPlanGenerated }) => {

  const { token } = useContext(UserContext);

  const [ formData , setFormData ] = useState({
    preferences:"",
    allergies:"",
    goal:""
  });

  const handleChange = (e) => {
    const { name , value } = e.target;
    setFormData({
        ...formData,
        [name]:value
    })
  }

  const handleSubmit = async(e) => {
    try {
       e.preventDefault();

       const data = {
         ...formData,
         preferences:formData.preferences.split(","),
         allergies:formData.allergies.split(",")
       }
        await axiosInstance.post('/api/mealplan/create', data);
        
        // refresh the fetch meal plan
        if(onMealPlanGenerated) { 
            onMealPlanGenerated(); 
        };

        toast("MealPlan Generated Successfully!",{
          autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
        });
        
        setFormData({
            preferences:'',allergies:'',goal:''
        })
    } catch (error) {
        toast.error("Error Generating MealPlan",{
          autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
        });
    }
  }


  return (
    <div>
    <form onSubmit={handleSubmit} className='flex flex-col gap-1 text-[0.85rem] md:text-[1rem] text-white'>
     <h2 className='font-semibold mt-2 md:mt-0 md:mb-1 text-normal text-gray-300'>Enter MealPlan Details</h2>
     <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="text" name='preferences' value={formData.preferences}  placeholder='Enter mealplan preferences (eg.vegeterian)' onChange={handleChange} required />
     <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="text" name='allergies' value={formData.allergies}  placeholder='Enter allergies (eg.milk)' onChange={handleChange} required /> 
          <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="text" name='goal' value={formData.goal}  placeholder='Enter goal (eg.weight loss)' onChange={handleChange} required /> 
     <button className='h-10 md:h-12 bg-[#3bd470] hover:bg-[#34bf63] px-3 outline-none font-semibold text-black rounded ' type='submit'>Generate MealPlan</button>
    </form>
    <ToastContainer/>
    </div>
  )
}

export default GenerateMealPlanForm