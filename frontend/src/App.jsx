import React, { Suspense, useContext } from "react"
import { BrowserRouter , Routes, Route, Navigate} from "react-router-dom"
import { UserContext, UserContextProvider } from "./context/mednutriContext.jsx"
import Landing from "./pages/Landing.jsx"

const Signin = React.lazy(()=> import("./pages/Signin.jsx"));
const Signup = React.lazy(()=> import("./pages/Signup.jsx"));
const Dashboard = React.lazy(()=> import ("./pages/Dashboard.jsx")); 
const MealPlan = React.lazy(() => import("./pages/MealPlan.jsx"));
const Prescription = React.lazy(() => import("./pages/Prescription.jsx"));
const Profile = React.lazy(() => import("./pages/Profile.jsx"));
import { ToastContainer } from "react-toastify"
import NotFound from "./pages/Not Found.jsx";

function App() {

  // protected routes
  const ProtectedRoutes = ({ children }) => {
    const { token }= useContext(UserContext);
    return token ? children : <Navigate to="/signin" />
  }

  return (
    <UserContextProvider>
      <BrowserRouter>
        <ToastContainer/>
        <Suspense fallback={ <div className="text-white bg-black h-screen w-full flex justify-center items-center">Loading...</div> }>
          <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/dashboard" element={<ProtectedRoutes><Dashboard/></ProtectedRoutes>}/>
          <Route path="/mealplan" element={<ProtectedRoutes><MealPlan/></ProtectedRoutes>}/>
          <Route path="/prescription" element={<ProtectedRoutes><Prescription/></ProtectedRoutes>}/>
          <Route path="/profile" element={<ProtectedRoutes><Profile/></ProtectedRoutes>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
        </Suspense>
      </BrowserRouter>
    </UserContextProvider>
  )
}

export default App
