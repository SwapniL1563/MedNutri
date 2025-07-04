import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"
import prescriptionRoutes from "./routes/prescriptionRoutes.js"
import mealplanRoutes from "./routes/mealplanRoutes.js"
import bookMarkRoutes from "./routes/bookMarkRoutes.js"
import cookieParser from 'cookie-parser'
import { scheduledAllReminders } from "./utils/reminderCron.js";

const PORT = 3000;
dotenv.config();

const app = express();

// middleware
app.use(cors({
  origin: 'https://mednutri-frontend.vercel.app',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api/prescription",prescriptionRoutes);
app.use("/api/mealplan",mealplanRoutes);
app.use("/api/bookmarks",bookMarkRoutes);

// server started
app.get("/",function(req,res){
  res.send("Server is Working!")
});

const startServer = async(req,res) => {
  try {
      await connectDb(); // connect to DB
      await scheduledAllReminders(); // schedule the prescription reminders 
      app.listen(PORT , () => {
      console.log(`Server is running on ${PORT} `);
      })
  } catch (error) {
      console.error("Unable to start server",error.message);
  }
} 

startServer();

