import React, { useContext, useEffect } from 'react'
import { UserContext } from '../context/mednutriContext'
import { Bookmark, FileText, Menu, Trash2, User } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import GenerateMealPlanForm from '../components/GenerateMealPlanForm'
import { toast, ToastContainer } from 'react-toastify'
import Header from '../components/Header'

const MealPlan = () => {
  const { user , token , sidebarOpen , setSidebarOpen , mealPlan , setMealPlan , bookmarked , setBookmarked} = useContext(UserContext);

    const fetchMealPlanswithFlags = async () => {
      try {
          // fetch bookmark mealplan
          const res = await axios.get("/api/bookmarks",{
          headers:{
            Authorization:`Bearer ${token}`
          }})

          const bookmarkData = Array.isArray(res.data) ? res.data : [];
          setBookmarked(bookmarkData);
         
          // fetch all mealplan 
          const mealplanRes = await axios.get(`/api/mealplan/fetch`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
          });

          // now add isBookmarked flag
          const mealplanWithFlag = mealplanRes.data.map((plan) => {
            const isBookmarked = bookmarkData.some((b) => b.mealplan && b.mealplan._id === plan._id);
            return { ...plan , isBookmarked };
          });

          setMealPlan(mealplanWithFlag);

      } catch (error) {
        toast.error("Error fetching bookmarked mealplan",{
          autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
        });
      }
    }

    const handleDelete = async(id) => {
      try {
        await axios.delete(`/api/mealplan/delete/${id}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
          toast("Deleted mealplan successfully!",{
            autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
          });

        fetchMealPlanswithFlags();
      } catch (error) {
        toast.error("Error Deleting MealPlan",{
          autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
        })
      }
    }

    const handleExportToPDF = async (id) => {
      try {
        const url =  `/api/mealplan/${id}/pdf?token=${token}`
        window.open(url,"_blank") 
      } catch (error) {
        toast.error("Error exporting to PDF",{
          autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
        })
      }
    }

    const toggleBookmark = async (id,isBookmarked) => {
      try {
        if(isBookmarked){
          await axios.delete(`/api/bookmark/${id}`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          });
            toast("Removed Bookmark Successfully!",{
            autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
            });
          } else {
          await axios.post(`/api/bookmark/${id}`,{},{
            headers:{
              Authorization:`Bearer ${token}`
            }
          });
            toast("Bookmarked Successfully!",{
            autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
            });
          }


          fetchMealPlanswithFlags()
        } catch (error) {
          toast.error("Error adding / removing Bookmark",{
            autoClose:1000,className: "bg-[#0F0F0F] text-[#3bd470]", 
          });
      }
    }
  
  // fetch mealplan on mount or token change
  useEffect(()=> {
      
    if(token){
        fetchMealPlanswithFlags();
      }
    },[token]);

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

    if(!user) {
      return <div className='w-full h-screen text-white bg-black flex justify-center items-center'>
        <h2>Loading...</h2>
      </div>
    }
  return (
    <div className='min-h-screen relative w-full'>
     <img src="/bg-img1-optimized.webp" alt="background-image" className="absolute right-0 top-0 h-full w-full opacity-100 z-0" />

       <div className='min-h-screen flex relative w-full'>
         <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
         <div className='bg-black/80 w-full relative flex flex-col  gap-2 px-2 py-2 z-10'>
         <Header/>

         <h1 className='text-gray-100 text-lg md:text-xl font-medium md:px-0 y-2 md:py-0'>Generate <span className='text-[#3bd470]'>MealPlans</span></h1>

         <div className='grid md:grid-cols-2 gap-2'>
          <GenerateMealPlanForm onMealPlanGenerated={fetchMealPlanswithFlags}/>
         </div>

         <h1 className='text-gray-100 text-lg md:text-xl font-medium px-1 md:px-1 pt-5 md:pt-0 md:py-0 mt-2'>All <span className='text-[#3bd470]'>Meal Plans</span></h1>

         {/* MealPlans Card */}
         <div className='text-gray-100 grid grid-cols-1 md:grid-cols-2 gap-2'>
          { mealPlan.length === 0 ? ( <div>
            <h2>No MealPlan Found</h2>
          </div>) : (
             mealPlan.map((item) => {
                const parsed = parseMealPlan(item.plan)

                return (
                  <div key={item._id} className='w-full bg-[#0F0F0F] grid md:grid-cols-2 gap-2 p-2 md:p-4 rounded'>
                    {['Breakfast','Lunch','Snacks','Dinner'].map((section)=> (
                     <div key={section} className='bg-[#0F0F0F] flex flex-col gap-2 border-white/5 border border-rounded p-5 rounded '>
                       {/* Get Meal Plan by sceyion */}
                      <h2 className='font-semibold text-[#3bd470] text-lg'>{section}</h2>
                      <div className='flex flex-col justify-between gap-5 h-full'>
                        <ul className='text-[0.8rem] md:text-[0.9rem] flex flex-col gap-0.5'>
                        { (parsed[section].map((item,index)=> (
                          <li key={index}>• {item}</li>
                        ))) }
                        </ul>

                       {/* Get Calories per section */}
                       { parsed?.Summary?.[`${section} Calories`] && (
                        <p className='text-[0.85rem] md:text-[0.95rem]'><span className='font-semibold text-[#3bd470]'>{section} Calories</span> : {parsed.Summary[`${section} Calories`]}</p>
                       )}
                      </div>
                     </div>
                    ))}
                     
                    {/* Summary of total calories and macros */}
                    <div className='flex flex-col justify-center mt-2 text-[0.8rem] md:text-[0.95rem] p-4'>
                      <h2 className='font-semibold text-[#3bd470] mb-2 text-[0.9rem] md:text-[0.9rem]'>Summary of Total Nutritional Value:</h2>
                       <p>Total Calories: {parsed.Summary?.[`Total Calories`] || 'N/A'}</p>
                       <p>Total Protein: {parsed.Summary?.[`Total Protein (g)`] || 'N/A'}</p>
                       <p>Total Carbohydrates: {parsed.Summary?.[`Total Carbohydrates (g)`] || 'N/A'}</p>
                       <p>Total Fats: {parsed.Summary?.[`Total Fats (g)`] || 'N/A'}</p>
                    </div>
                    <div className='flex flex-col justify-center w-full text-gray-100'>
                     <button onClick={() => toggleBookmark(item._id,item.isBookmarked)} className={`h-10 mt-2 backdrop-blur transition border border-white/20 px-4 outline-none rounded font-semibold flex items-center justify-center text-black gap-2 ${item.isBookmarked ? 'bg-[#F5CE16]' : 'bg-[#3bd470]'}`}><Bookmark className='w-4 h-4' />{ item.isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}</button>
                     <button onClick={() => handleDelete(item._id)} className='h-10 mt-2 backdrop-blur bg-[#3bd470] hover:bg-[#2EA957] border border-white/20 text-black  px-4 outline-none rounded font-semibold flex items-center justify-center gap-2'><Trash2 className="w-4 h-4" />Delete MealPlan</button>
                     <button onClick={() => handleExportToPDF(item._id)} className='h-10 mt-2 backdrop-blur bg-black/10 hover:bg-white/5 transition border border-white/20 px-4 outline-none rounded font-semibold flex items-center justify-center gap-2'><FileText className="w-4 h-4b" />Export to PDF</button>
                    </div>
                  </div>
                )
           })
          )
          }
         </div>
         
         <h1 className='text-gray-100 text-lg md:text-xl font-medium md:px-0 y-2 md:py-0'>BookMarked <span className='text-[#3bd470]'>MealPlans</span></h1>

         {/*Bookmarked MealPlans Card */}
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

export default MealPlan