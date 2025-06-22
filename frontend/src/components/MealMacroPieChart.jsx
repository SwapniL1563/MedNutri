import React from 'react';
import { UserContext } from '../context/mednutriContext';
import { Cell, Legend, Pie , PieChart} from 'recharts';

const MealMacroPieChart = ({latestMealplan,parseMealPlan}) => {
  
  return (
    <div className='bg-[#0F0F0F] rounded flex flex-col justify-center items-center shadow p-4 md:w-auto'>
        <h3 className='font-semibold text-lg md:text-xl text-gray-100'>Macro Distribution per <span className='text-[#3bd470]'>Day</span></h3>
        {latestMealplan && (
        <PieChart width={330} height={330}>
        <Pie
        data={[
          { name: 'Protein', value: Number(parseMealPlan(latestMealplan.plan)?.Summary?.['Total Protein (g)']) || 0 },
          { name: 'Carbs', value: Number(parseMealPlan(latestMealplan.plan)?.Summary?.['Total Carbohydrates (g)']) || 0 },
          { name: 'Fats', value: Number(parseMealPlan(latestMealplan.plan)?.Summary?.['Total Fats (g)']) || 0 },
        ]}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="fffff"
        label labelLine={false} stroke='none' 
        isAnimationActive={true} animationBegin={0} animationDuration={1500} animationEasing="ease-out">
        <Cell fill="#3bd470" />
        <Cell fill="#2EA957" />
        <Cell fill="#1F7C3E" />
      </Pie>
      <Legend />
      </PieChart>
      )}
      </div>
  )
}

export default MealMacroPieChart