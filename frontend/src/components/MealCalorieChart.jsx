import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const MealCalorieChart = ({ mealData}) => {
  return (
    <div className='text-gray-100 w-full h-full flex flex-col items-center gap-2'>
        <h2 className='text-xl font-semibold'>Calorie Distribution per <span className='text-[#3bd470]'>Meal</span></h2>
        <ResponsiveContainer width="100%" height={300}>

            <BarChart data={mealData}>
                <CartesianGrid />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />    
                <Legend />
                <Bar dataKey="calories" fill="#3bd470" isAnimationActive={true} animationBegin={0} animationDuration={1500}
                animationEasing="ease-in-out"/> 
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

export default MealCalorieChart