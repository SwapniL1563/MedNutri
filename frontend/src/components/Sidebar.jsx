import { ClipboardList, FileText, HandHeart, LayoutDashboard, Pill, User, X } from 'lucide-react'
import React, { useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/mednutriContext'

const Sidebar = ({ isOpen,onClose }) => {

    const { logout } = useContext(UserContext);
    const navigate = useNavigate();

    const links = [
      { name:"Dashboard", path:"/dashboard" , icon:<LayoutDashboard size={20} />} ,  
      { name:"Prescription", path:"/prescription" , icon:<Pill size={20} />} ,  
      { name:"Meal Plans", path:"/mealplan" , icon:<ClipboardList size={20} />} , 
      { name:"Profile", path:"/profile" , icon:<User size={20} />}    
    ]

    const logOut =  () => {
    logout()
    navigate("/");
  }

  return (
    <div  className={`fixed lg:relative top-0 left-0 bg-[#0F0F0F] w-72 p-4 z-50 transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 h-full md:h-auto`}>
        
        {/* Mobile close Button */}
        <div className="flex justify-end py-1 px-1 items-center mb-6  lg:hidden">
        {/* <div className="text-xl font-bold text-[#3bd470]">MedNutri</div> */}
        <button onClick={onClose}>
          <X className="text-white" />
        </button>
       </div>
      
      <Link to="/dashboard" className='mb-8 mt-1 flex items-center gap-2 w-[60%] md:w-[70%]'>
        <img src="/mednutri-logo.png" alt="" />
      </Link>
       <div className='flex flex-col'>
         <nav className='flex flex-col gap-2 mb-6 md:mb-4'>
        {links.map(({name,path,icon}) => (
            <NavLink key={name} to={path} onClick={onClose}  className={({isActive})=> `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1c1c1c] transition ${
                isActive ? 'bg-[#1c1c1c] text-[#3bd470]' : 'text-gray-100'
              }`}> {icon} {name} </NavLink>
        ))}
      </nav>

          <button className='bg-[#3bd470] hover:bg-[#34bf63] px-3 h-8  outline-none  text-[#171717]  font-medium rounded' onClick={logOut}>Logout</button>
        </div>   
    </div>
  )
}

export default Sidebar