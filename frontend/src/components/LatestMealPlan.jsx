import React from 'react'

const LatestMealPlan = ({parseMealPlan,latestMealplan}) => {
 return (
    <div>
         { 
          latestMealplan ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 md:w-auto'>
              {['Breakfast','Lunch','Snacks','Dinner'].map((meal)=> (
                <div key={meal} className='bg-[#0F0F0F] rounded py-4 px-2 md:py-4 md:px-5 overflow-hidden'>
                  <h2 className='md:text-xl font-medium text-[#3bd470] '>{meal}</h2>
                  <ul className='list-disc text-[0.7rem] md:text-[0.85rem] pl-3 text-gray-100 '>
                    { parseMealPlan(latestMealplan.plan)[meal]?.map((item,index)=> (
                      <li className='mb-1 mt-1' key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ): ( <div className='h-56 bg-[#0f0f0f] flex justify-center items-center text-white'>
            <h2 className='font-semibold text-xl'>No Mealplans yet</h2>
            </div>)
        }
    </div>
  )
}

export default LatestMealPlan