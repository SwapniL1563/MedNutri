import React, { useContext } from 'react'
import { UserContext } from '../context/mednutriContext'
import { Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { setSidebarOpen , user } = useContext(UserContext);
  return (
    <div>
        {/* Mobile Header */}
      <div className="lg:hidden pt-5 px-1 flex flex-col justify-between  mb-2">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="text-gray-100" />
          </button>
           <div className='flex flex-col mt-4'>
           <h1 className='text-gray-100 font-semibold md:text-xl'>Hey there, {user.name || 'User'}!</h1>
           <p className='text-sm  md:text-normal text-gray-400'>Welcome back, we are happy to have you here.</p>
           </div>
        </div>


      {/*Desktop Header */}
      <div className='md:flex justify-between items-center w-full py-4 px-1 mb-2 hidden '>
         <div className='w-[90%] flex flex-col gap-1 '>
           <h1 className='text-gray-100 font-semibold md:text-xl'>Hey there, {user.name || 'User'}!</h1>
           <p className='text-gray-400'>Welcome back, we are happy to have you here.</p>
         </div>

        <Link to="/profile">
        <div className="flex items-center justify-center gap-2">
        <div className="w-7 h-7 rounded-full border text-gray-100 flex items-center justify-center"><User/></div>
        <span className="text-gray-100 font-semibold">{ user.name }</span>
        </div>
        </Link>
        </div>
    </div>
  )
}

export default Header