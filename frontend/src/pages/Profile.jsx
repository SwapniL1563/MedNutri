import React, { useContext, useEffect } from 'react'
import { UserContext } from '../context/mednutriContext';
import Sidebar from '../components/Sidebar';
import { Menu, User } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import axiosInstance from '../utils/axiosInstance';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
   const { user,token,sidebarOpen,setSidebarOpen,prescriptions,setPrescriptions,mealPlan,setMealPlan,bookmarked,setBookmarked } = useContext(UserContext);

     const fetchMealPlanswithFlags = async () => {
      try {
          // fetch bookmark mealplan
          const res = await axiosInstance.get('/api/bookmarks')

          const bookmarkData = Array.isArray(res.data) ? res.data : [];
          setBookmarked(bookmarkData);
         
          // fetch all mealplan 
          const mealplanRes = await axiosInstance.get('/api/mealplan/fetch');

          // now add isBookmarked flag
          const mealplanWithFlag = mealplanRes.data.map((plan) => {
            const isBookmarked = bookmarkData.some((b) => b.mealplan && b.mealplan._id === plan._id);
            return { ...plan , isBookmarked };
          });

          setMealPlan(mealplanWithFlag);

      } catch (error) {
        toast.error("Error fetching bookmarked mealplan",{
          autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", });
      }
    }

  useEffect(() => {
  const fetchPrescriptions = async () => {
    try {
      const res = await axiosInstance.get('/api/prescription/get');
      setPrescriptions(res.data);
    } catch (err) {
      toast.error("Error fetching prescriptions",{
        autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
      });
    }
  };

  if (token) {
    fetchPrescriptions();
    fetchMealPlanswithFlags();
  }
}, [token]);
  
   // parse the mealplan
  const parseMealPlan = (text) => {
  const sections = {};
  let currentSection = null;

  text.split('\n').forEach(line => {
    line = line.trim();

    if (line.endsWith(':')) {
      currentSection = line.slice(0, -1);
      sections[currentSection] = [];
    } else if (line.startsWith('•') && currentSection) {
      sections[currentSection].push(line.slice(1).trim());
    } else if (line.startsWith('-')) {
      const [label, value] = line.slice(1).split(':');
      if (!sections['Summary']) sections['Summary'] = {};
      sections['Summary'][label.trim()] = value?.trim();
    }
  });

  return sections;
  };

  if (!user) {
  return (
    <div className="w-full h-screen text-white bg-black flex justify-center items-center">
      <h2>Loading profile...</h2>
    </div>
  );
  }
  return (
    <div className='min-h-screen relative w-full '>
       <img src="/bg-img1-optimized.webp" alt="background-image" className="absolute right-0 top-0 h-full w-full opacity-100 z-0" />


      <div className='min-h-screen flex relative w-full'>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

      <div className='bg-black/80 w-full relative flex flex-col  gap-2 px-2 py-2 z-10'>
       <Header/>
       
       <div className='text-gray-100 grid md:grid-cols-2 gap-2'>
         <div className='bg-[#0F0F0F] py-5 md:py-6 px-6 flex flex-col gap-3 md:gap-2 rounded'>
           <h2 className='font-semibold text-[#3bd470] text-lg'>Personal Information: </h2>
            <div className='grid frid-cols-1 md:grid-cols-2 gap-2 text-sm md:text-base'>
              <h2>Name: {user.name}</h2>
              <h2>Age: {user.age}</h2>
              <h2>Gender: {user.gender}</h2>
              <h2>Email: {user.email}</h2>
              <h2>Country: {user.country}</h2>
            </div>
         </div>

         <div className='bg-[#0F0F0F] py-5 md:py-6  px-6 flex flex-col gap-3 md:gap-2 rounded'>
           <h2 className='font-semibold text-[#3bd470] md:text-lg'>Health Information: </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm md:text-base'>
              <h2>Total Prescriptions: {prescriptions.length}</h2>
              <h2>Total MealPlans: {mealPlan.length}</h2>
              <h2>Status: Active ✅</h2>
              <h2>Bookmarked MealPlans: {bookmarked.length}</h2>
              <h2>Upcoming Prescription: {prescriptions[0]?.medications || 'None'}</h2>
            </div>
         </div>
       </div>

      <h1 className='text-gray-100 text-lg md:text-xl font-medium px-1 md:px-1 pt-5  md:pt-0 md:py-0 mt-2'>Bookmarked <span className='text-[#3bd470]'>Mealplan</span></h1>
      
      <div className='text-gray-100 grid grid-cols-1 md:grid-cols-2 gap-2'>
          { Array.isArray(bookmarked) && bookmarked.length > 0 ?  (
             bookmarked.map((item) => {
                const parsedBookmarked = parseMealPlan(item.mealplan?.plan || '');

                return (
                  <div key={item._id} className='w-full bg-[#0F0F0F] grid md:grid-cols-2 gap-2 p-2 md:p-4 rounded'>
                    {['Breakfast','Lunch','Snacks','Dinner'].map((section)=> (
                     <div key={section} className='bg-[#0F0F0F] flex flex-col gap-2 border-white/5 border border-rounded p-5 rounded '>
                       {/* Get Meal Plan by sceyion */}
                      <h2 className='font-semibold text-[#3bd470] text-lg'>{section}</h2>
                      <div className='flex flex-col justify-between gap-5 h-full'>
                        <ul className='text-[0.8rem] md:text-[0.9rem] flex flex-col gap-0.5'>
                        { Array.isArray(parsedBookmarked[section]) && (parsedBookmarked[section].map((item,index)=> (
                          <li key={index}>• {item}</li>
                        ))) }
                        </ul>

                       {/* Get Calories per section */}
                       { parsedBookmarked?.Summary?.[`${section} Calories`] && (
                        <p className='text-[0.85rem] md:text-[0.95rem]'><span className='font-semibold text-[#3bd470]'>{section} Calories</span> : {parsedBookmarked.Summary[`${section} Calories`]}</p>
                       )}
                      </div>
                     </div>
                    ))}
                     
                    {/* Summary of total calories and macros */}
                    <div className='flex flex-col justify-center mt-2 text-[0.8rem] md:text-[0.95rem] p-4'>
                      <h2 className='font-semibold text-[#3bd470] mb-2 text-[0.9rem] md:text-[0.9rem]'>Summary of Total Nutritional Value:</h2>
                       <p>Total Calories: {parsedBookmarked.Summary?.[`Total Calories`] || 'N/A'}</p>
                       <p>Total Protein: {parsedBookmarked.Summary?.[`Total Protein (g)`] || 'N/A'}</p>
                       <p>Total Carbohydrates: {parsedBookmarked.Summary?.[`Total Carbohydrates (g)`] || 'N/A'}</p>
                       <p>Total Fats: {parsedBookmarked.Summary?.[`Total Fats (g)`] || 'N/A'}</p>
                    </div>
                  </div>
                )
           })
          ) :(<div className='flex '>
            <h2>No Bookmarked Mealplan Found.</h2>
            </div>) 
            }
         </div>
      </div>
      </div>
    </div>
  )
}

export default Profile