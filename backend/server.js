import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"
import prescriptionRoutes from "./routes/prescriptionRoutes.js"
import mealplanRoutes from "./routes/mealplanRoutes.js"
import bookMarkRoutes from "./routes/bookMarkRoutes.js"
import { scheduledAllReminders } from "./utils/reminderCron.js";

// import { sendSMS } from "./utils/msg91.js";
// import { sendEmailReminder } from "./utils/email.js";
// import { sendSMS } from "./utils/fast2sms.js";
// import { sendSMS } from "./utils/vonage.js";
// import { sendSMS } from "./utils/twilio.js";
// import { sendWhatsappMsg } from "./utils/twilio-whatsapp.js";

const PORT = 3000;

const app = express();

dotenv.config();

// middleware
app.use(cors({
  origin: 'http://localhost:5173', // or wherever your frontend runs
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/prescription",prescriptionRoutes);
app.use("/api/mealplan",mealplanRoutes);
app.use("/api",bookMarkRoutes);

// server started
app.get("/",function(req,res){
  res.send("Server is Working!")
});

// // creating new user
// app.post("/create", async(req,res) => {
//   const { name,email,password,phone,age,gender,country,allergies,preferences,consent} = req.body;
//   const user = await User.create({
//     name,email,password,phone,age,gender,allergies,preferences,consent
//   });
//   res.json({user,"msg":"User created successfully"});
// })

// // fetch all the users
// app.get("/getuser" , async(req,res) => {
//    const users = await User.find({});
//    res.json(users);
// });

// // deleting user
// app.delete("/delete/:id", async(req,res) => {
//   await User.findByIdAndDelete(req.params.id);
//   res.json({
//     "msg":"User deleted successfully"
//   })
// });

// // updating user
// app.put("/update/:id", async(req,res) => {
//   const user = await User.findById(req.params.id);
//   user.name = req.body.name || user.name;
//   user.email = req.body.email || user.email;
//   user.phone = req.body.phone || user.phone;

//   const updatedUser = await user.save();
//   res.json({ updatedUser,
//     "msg":"User updated successfully"
//   })
// })


// app.get("/test",async(req,res) => {
//   await sendWhatsappMsg("+919321145169","HI THERE");
//   res.json({
//     "msg":"wp msg sent"
//   });
// });


// app.post('/test-sms', async (req, res) => {
//   let { to, otp } = req.body;

//   // Ensure otp is a string of digits
//   otp = String(otp).trim();

//   if (!/^\d+$/.test(otp)) {
//     return res.status(400).json({
//       success: false,
//       error: 'OTP should be numeric',
//     });
//   }

//   try {
//     await sendSMS({ to, otp });
//     res.json({ success: true, msg: 'SMS sent!' });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// app.post("/test", async (req, res) => {
//   const { to, text } = req.body;
//   try {
//     await sendEmailReminder(to, "MedNutri Reminder", text);
//     res.json({ success: true, message: "Email sent!" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });




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

