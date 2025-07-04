import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/mednutriContext'
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import MealCalorieChart from '../components/MealCalorieChart.jsx';
import UpcomingPrescriptions from '../components/UpcomingPrescriptions.jsx';
import MealMacroPieChart from '../components/MealMacroPieChart.jsx';
import LatestMealPlan from '../components/LatestMealPlan.jsx';
import Header from '../components/Header.jsx';
import axiosInstance from '../utils/axiosInstance.jsx';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;


const Dashboard = () => {

  const { user,token,sidebarOpen,setSidebarOpen } =  useContext(UserContext);
  const [ mealplan,setMealplan ] = useState([]);
  const [ latestMealplan,setLatestMealplan ] = useState(null);

  useEffect(()=>{
        const fetchMealPlans = async() => {
          const res = await axiosInstance.get('/api/mealplan/fetch');
          if(Array.isArray(res.data) && res.data.length > 0){
            setMealplan(res.data);
            setLatestMealplan(res.data[0]);
          }
        }
        
        if(token){
        fetchMealPlans();
        }
    },[token]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#010103] text-gray-100 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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
  
  // get calories per meal
  const getMealCalorieData = (parsed) => {
  const summary = parsed?.Summary || {};
  return ['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(meal => ({
    name: meal,
    calories: parseInt(summary[`${meal} Calories`] || 0)
  }));
  };

  const parsed = latestMealplan && latestMealplan.plan ? parseMealPlan(latestMealplan.plan) : {};
  const mealCalorieData = parsed ? getMealCalorieData(parsed) : [];

  return (
    <div className='min-h-screen relative w-full overflow-x-hidden'>
       <img src="/bg-img1-optimized.webp" alt="background-image" className="absolute right-0 top-0 h-full w-full opacity-100 z-0" loading="lazy" />

     <div className='min-h-screen w-full flex relative z-10 '>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
      
      <div className='bg-black/80 w-full relative px-2 py-2 z-10 flex flex-col'>
       <Header/>
      
       <h1 className='text-gray-100 text-lg md:text-xl font-medium px-1 md:px-1 py-2'>Latest Meal Plan <span className='text-[#3bd470]'>Details</span></h1>

       <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 px-1 md:px-0'>
        {/* Latest Mealplan */}
        <LatestMealPlan parseMealPlan={parseMealPlan} latestMealplan={latestMealplan} />

        {/* Latest MealPlan Macro's Distribution */}
        <MealMacroPieChart  parseMealPlan={parseMealPlan} latestMealplan={latestMealplan}  />
        
        {/* Calories Distribution Per Meal */}
        <div className='bg-[#0F0F0F] rounded p-6 md:flex justify-center items-center w-full hidden'>
         <MealCalorieChart mealData={mealCalorieData} />
        </div>        
        
        {/* Upcoming Prescriptions */}
        <div className='bg-[#0F0F0F] rounded p-6 flex justify-center items-center sm:items-start w-full md:w-auto'>
          <UpcomingPrescriptions />
        </div>
        
        </div>
       </div>
    </div>
    </div>
  )
}

export default Dashboard;