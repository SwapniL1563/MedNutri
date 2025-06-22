import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/mednutriContext';

const NotFound = () => {
  const token = useContext(UserContext);
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-white bg-black px-4 text-center relative">
      <img src="/bg-img1-optimized.webp" alt="background-image" className="absolute right-0 top-0 h-full w-full opacity-100 z-0" loading="lazy" />

      <div className="flex flex-col items-center justify-center z-20 gap-2">
        <h1 className="text-5xl md:text-7xl font-bold text-[#3bd470]">404</h1>
        <h1 className="text-xl md:text-3xl font-bold text-gray-100">Page Not Found</h1>
        <p className="md:text-lg text-xs mb-4 text-gray-400 w-[80%] md:w-[55%]">Oops! The page you're looking for doesn't exist. No problem, go back to dashboard and Stay Healthy!</p>
        <Link to={token ? "/dashboard" : "signin" } className="bg-[#3bd470] hover:bg-[#2ea957] text-black font-semibold py-2 px-3 md:px-4 rounded text-sm md:text-base">
        Go Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
