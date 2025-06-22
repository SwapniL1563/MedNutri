import React, { useContext, useState } from 'react'
import { UserContext } from '../context/mednutriContext.jsx'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {

    const { signup } = useContext(UserContext);
    const navigate = useNavigate();

    const [step,setStep] = useState(1);

    const [formData,setFormData] = useState({
        name:"",
        email:"",
        password:"",
        age:"",
        gender:"",
        country:"",
        preferences:"",
        allergies:"",
        consent:false
    });

    const handleChange = (e) => {
        const { name,value,type,checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:type === "checkbox" ? checked : value
        }))
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            ...formData,
            preferences:formData.preferences.split(","),
            allergies:formData.allergies.split(",")
        };

        try{
            await signup(data);
            navigate("/signin");
            toast.success("User created successfully!",{
                autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
            })
        } catch(err) {
           toast.error("Something went wrong!",{
            autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
           });
        }
    }

    const handleNext = (e) => {
         e.preventDefault()
         setStep(2)
    }



    return (
     <div className='min-h-screen w-full flex justify-center items-center gap-12 text-white relative overflow-hidden' id='signup'>
        <img src="/bg-img1-optimized.webp" alt="background-image" className="absolute right-0 top-0 h-full w-full opacity-100 z-0"  />


       <div className='z-10 w-1/3  flex-col items-start justify-center hidden lg:flex '>
        <p className="text-white italic text-[3.1rem] mb-7  leading-[3.5rem]">Eat smart. <br /> Live better. <br /> Only with <span className='text-[#3bd470] font-medium'> MedNutri.</span></p>
        <h2 className="text-white text-xl font-semibold mb-2">MedNutri Features:</h2>
        <ul className="text-slate-200 text-lg space-y-2">
        <li>• &nbsp; AI-powered, personalized meal plans</li>
        <li>• &nbsp; Schedule prescriptions & get smart reminders</li>
        <li>• &nbsp; Track macros, stay on target</li>
        <li>• &nbsp; Export meal plans as beautifully designed PDFs</li>
       </ul>
      </div>

       <div className='z-10 w-[90%]  md:w-1/3  flex-col justify-center items-center gap-3 flex '>
        <div className='z-10 border border-[#404040] bg-black/30 flex flex-col gap-2 items-center px-5 py-7 md:px-8  md:py-4 rounded-xl'>
        <h1 className='text-lg md:text-2xl mb-3 text-start'>Create a New Account</h1>
        
        {/* Conditional rendering of progress bar */}
        <div className="flex items-center justify-center gap-6 mb-3">
        <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-[#3bd470]' : 'bg-gray-400'}`}></div>
        <span className={`text-sm italic ${step === 1 ? 'text-white' : 'text-gray-400'}`}>Personal Details</span>
        </div>

        <span className="text-gray-500">—</span>

        <div className='flex items-center gap-2'>
        <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-[#3bd470]':'bg-gray-400'}`}></div>
        <span className={`text-sm  italic ${step === 1 ? 'text-white' : 'text-gray-400'}`}>MealPlan Details</span>
        </div>
        </div>
        
         {/* Personal details: Step 1 */}
        {step === 1 && ( 
        <form onSubmit={handleNext} className=' flex flex-col gap-2 mb-3 w-72 md:w-96'>
         <h2>Personal Details</h2>
         <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="text" name='name'  value={formData.name} placeholder='Enter name*' onChange={handleChange} required/>
         <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="email" name='email'  value={formData.email} placeholder='Enter email*' onChange={handleChange}  required />
         <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="password" name='password'  value={formData.password} placeholder='Enter password*' onChange={handleChange}  required />
         <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="number" name='age'  value={formData.age} placeholder='Enter age' onChange={handleChange} />
         <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="text" name='gender' value={formData.gender} placeholder='Gender' onChange={handleChange} />
         <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="text" name='country'  value={formData.country} placeholder='Country (eg.India)' onChange={handleChange} />
         <button className='h-12 bg-[#3bd470] hover:bg-[#34bf63] px-3 outline-none  text-[#171717] rounded'>Next</button>
       </form>
        )}
        
        {/* Mealplan details: Step 2 */}
        { step === 2 &&  <form onSubmit={handleSubmit} className=' flex flex-col gap-2 mb-3   w-72  md:w-96'>
         <h2 className='mb-2'>MealPlan Details</h2>
         <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="text" name='preferences'  value={formData.preferences} placeholder='preferences (eg.vegeterian)' onChange={handleChange} />
         <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="text" name='allergies'  value={formData.allergies} placeholder='allergies (eg.lactose)' onChange={handleChange} />
         <label className='flex items-start md:items-center md:justify-start gap-1 md:gap-3 text-start text-[0.85rem] md:text-[0.9rem] md:mb-1 mb-2 mt-4 md:mt-1'>
            <input className='h-auto md:h-6 bg-transparent outline-none focus:border-[#999898] border border-[#454545] w-4 md:w-3 mt-1' type="checkbox" name='consent' checked={formData.consent} onChange={handleChange} required/> I consent to receive reminders from MedNutri
         </label>
         <button className='h-12 bg-[#3bd470] hover:bg-[#34bf63] px-3 outline-none  text-[#171717] rounded' type='submit'>SignUp</button>
       </form>}
       </div>

       <p>Already have an account? <Link to='/signin' className='text-blue-400'>Signin Page</Link></p>
    </div>
     </div>
  )
}

export default Signup