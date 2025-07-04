import axiosInstance from "../utils/axiosInstance";
import { createContext, useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;


// creating context
export const UserContext = createContext();

// creating global states and passing them to children
export const UserContextProvider = ({ children }) => {
    const [ user,setUser ] = useState(null);
    const [ token,setToken ] = useState(localStorage.getItem('token') || '');
    const [ sidebarOpen , setSidebarOpen ] = useState(false);
    const [ prescriptions,setPrescriptions ] = useState([]);
    const [ mealPlan,setMealPlan ] = useState([]);
    const [ bookmarked,setBookmarked] = useState([]);

    // signin 
    const signin = async ({email,password}) => {
       const res = await axiosInstance.post('/api/auth/signin', { email, password });
       setToken(res.data.token);
       localStorage.setItem('token',res.data.token);
    }

    // signup
    const signup = async (formData) => {
        const res = await axiosInstance.post('/api/auth/signup', formData);
        setToken(res.data.token);
        localStorage.setItem('token',res.data.token);
    }

    // logout
    const logout = async() => {
        setToken('');
        setUser(null);
        localStorage.removeItem('token');
    }
    
    // if token added or changes
    useEffect(()=> {
        if(token) {
            axiosInstance.get('/api/auth/profile')
            .then((res) => setUser(res.data))
            .catch(()=> {
                setUser(null);
                setToken('');
                localStorage.removeItem('token');
            })
        }
    },[token])

    return ( 
    <UserContext.Provider value={{ user,setUser,token,setToken,signin,signup,logout,sidebarOpen,setSidebarOpen , prescriptions,setPrescriptions,mealPlan,setMealPlan,bookmarked,setBookmarked}}>
        { children }
    </UserContext.Provider> 
    )
}