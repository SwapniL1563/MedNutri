import mongoose  from "mongoose";

const connectDb = async(req,res) => {
   try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected successfully")
   } catch (error) {
     console.error("Unable to connect DB",error.message);
   }
}

export default connectDb;