import React, { useContext, useState } from 'react'
import { UserContext } from '../context/mednutriContext'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signin = () => {

  const { signin } = useContext(UserContext);
  const navigate = useNavigate();

  const [ formData,setFormData ] = useState({
    email:"",
    password:""
  })

  const handleChange = (e) => {
    const { name,value } = e.target;
    setFormData({
        ...formData,
        [name]:value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email,password } = formData
    try {
        await signin({email,password});
        navigate("/dashboard");
        toast("Signin successfully!",{
          autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
        })
    } catch (err) {
          toast.error("Invalid Credentials!",{
          autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
         })
    }
  }

  return (
    <div className='min-h-screen bg-black w-full flex justify-center items-center gap-12 text-white relative overflow-hidden' id='signin'>
       <img src="/bg-img1-optimized.webp" alt="background-image" className="absolute right-0 top-0 h-full w-full opacity-100 z-0" />

      
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

      <div className='z-10 border border-[#404040] bg-black/30 flex flex-col gap-10 items-center px-6 py-7 md:px-8 md:py-10 rounded-xl'>
        <h1 className='text-xl md:text-2xl '>Sign In to <span className='text-[#3bd470]  font-medium'> MedNutri</span></h1>
        <form onSubmit={handleSubmit} className=' flex flex-col gap-3 w-72 md:w-96'>
        <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="email" name='email' value={formData.email} placeholder='email' onChange={handleChange} required />
        <input className='h-12 px-3 bg-transparent outline-none focus:border-[#999898] border border-[#454545] rounded' type="password" name='password' value={formData.password} placeholder='password' onChange={handleChange} required />

        <button className='h-12 bg-[#3bd470] hover:bg-[#34bf63] px-3 outline-none  text-[#171717] rounded' type='submit'>Sign In</button>

      </form>
      <p>Don't have an account? <Link to="/signup" className='text-blue-400'>Create one</Link></p>
      </div>
    </div>
  )
}

export default Signin