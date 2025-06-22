import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Landing = () => {
  
  const navigate = useNavigate();
  const featuresRef = useRef(null);
  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center text-gray-100 relative'>

     <img src="/bg-img1-optimized.webp" alt="background-image" className="absolute right-0 top-0 h-full w-full opacity-100 z-0" />


     <div className='z-20 w-full  md:w-3/4 min-h-screen'>
        <nav className='px-2 md:px-0 py-4 flex items-center justify-between w-full'>
        <Link to="/dashboard" className='flex items-center gap-2'>
        <img src="/mednutri-logo.png" alt=""  className='w-36 md:w-40'/>
        </Link>

        <div className='md:flex  gap-4 justify-center items-center text-lg hidden'>
        <Link to="/" className='text-gray-400 hover:text-gray-100'>Home</Link>
        <button onClick={() => {featuresRef.current?.scrollIntoView({ behavior:'smooth'})}} className='text-gray-400 hover:text-gray-100'>Features</button>
        <Link to="/signup" className='text-gray-400 hover:text-gray-100'>Start Journey</Link>
        </div>

        <button onClick={() => navigate("/signup")} className='bg-[#3bd470] hover:bg-[#34bf63] px-3 h-8 text-xs md:text-sm  outline-none  text-[#171717]  font-medium rounded'>Get Started</button>
        </nav>

        <div className='w-full flex flex-col relative'>
            <div className='w-full  flex flex-col gap-5 justify-center items-center px-10 py-14 mb-4'>
                <h2 className='font-medium text-4xl md:text-7xl w-full md:w-[65%] text-center'>Your Complete <span className='text-[#3bd470] italic  font-[400]'>Health</span> Assistant</h2>
                <p className='text-sm md:text-base md:w-1/2 text text-center text-gray-400'>AI-generated meal plans, smart prescription reminders and personalized insights to keep your wellness effortlessly.</p>
                <div className="flex gap-2">
                   <button onClick={() => navigate("/signup")} className='bg-[#3bd470] hover:bg-[#34bf63] px-5 md:px-7 h-9 md:h-10 text-sm md:text-base outline-none  text-[#171717]  font-medium rounded'>Get Started</button>
                   <button onClick={() => navigate("/signin")} className='bg-black/20 hover:bg-black/40 border border-gray-400 px-5 md:px-7 h-9 md:h-10 text-sm md:text-base  outline-none  text-gray-100 font-medium rounded text-'>Dashboard</button>
                </div>
            </div>

            <div className='md:flex justify-center hidden opacity-90 '>
               <video src="/landing-video.mp4" autoPlay muted loop className='border border-gray-800 rounded-xl shadow-lg'></video>
            </div>


            <div className='md:mt-16 flex flex-col gap-3 px-2 md:px-0' ref={featuresRef}>
               <h2 className='text-2xl md:text-3xl font-medium text-[#3bd470] italic'>Features</h2>
               <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                  {[{ title: "AI Generated MealPlan", desc: "Generate balanced meal plans as per preferences, goal with nutritional value per meal using AI and export them to PDF." },
                    { title: "Smart Prescription Reminders", desc: "Schedule your prescriptions and get notified with reminders using mail, making sure prescriptions are taken on time." },
                    { title: "Personal Dashboard", desc: "View health metrics,generated meal plans, and upcoming prescriptions all in one place." }].map((item,index)=> (
                       <div key={index} className='bg-black/10 flex flex-col px-3 md:px-4 py-6 md:py-10 gap-4 md:gap-6 border border-gray-800 hover:bg-gradient-to-l from-[#3bd470]/5 to-bg-black/20 rounded-xl items-center transition duration-200'>
                         <h2 className='text-[#3bd470] text-[1.05rem] md:text-xl font-semibold text-center'>{item.title}</h2>
                         <p className='text-gray-400 mb-10 text-sm md:text-base w-4/5 md:w-[75%]'>{item.desc}</p>
                       </div>
                    ))}
               </div>
            </div>

            <div className='mt-16 flex flex-col gap-3 relative rounded-xl px-2 md:px-0'>
                <img src="/bg-img1-optimized.webp" alt="background-image" className="absolute right-0 top-0 h-full w-full opacity-100 z-0 rounded-xl px-2 md:px-0"/>
                <div className="bg-black/20 z-20 text-gray-100  py-14 px-4 text-center rounded-xl border border-gray-800">
                <h2 className="text-xl md:text-3xl font-bold mb-4">Start Your <span className='italic text-[#3bd470] font-[400]'>Health</span> Journey Today</h2>
                <p className="mb-6 text-gray-400 text-sm md:text-base">Join MedNutri and take control of your nutrition & medication.</p>
                <Link to="/signup" className="bg-[#3bd470] text-black px-5 md:px-6 py-2 md:py-3 rounded font-semibold hover:opacity-90 transition">Create an Account</Link>
                </div>
            </div>

            <footer className="bg-black/10 text-gray-400 py-4 px-4 text-center mt-10 text-[0.75rem] md:text-base">
            © {new Date().getFullYear()} MedNutri . All rights reserved. Made by Swapnil with 💚
          </footer>
       </div>
    </div>
    </div>
  )
}

export default Landing