import Bookmark from "../models/bookmarkModel.js";
import mealPlan from "../models/mealplanModel.js";
import User from "../models/userModel.js";
import { generateMealPlan } from "../utils/generateMealplan.js";
import PDFDocument from "pdfkit";
import path from 'path';
import fs  from 'fs';

// create meal plan for the logged user using gemini ai model
export const createMealPlan = async(req,res) => {
    try {
        const { allergies , preferences , goal } = req.body;

        // find user with id to get age and gender
        const userDb = await User.findById(req.user._id);
        const { age , gender , country } = userDb;

        // generate meal plan 
        const aiPlan = await generateMealPlan({ age,gender,country,allergies,preferences,goal})

        // save meal plan in Db
        const plan = await mealPlan.create({ user:req.user._id,age,gender,allergies,preferences,goal,plan:aiPlan });
        res.status(200).json(plan);
       } catch (error) {
        res.status(500).json({
            "msg":"Unable to generate Meal Plan",
            error:error.message
        })
    }
}

// fetch all meal plan for user
export const fetchMealPlan = async(req,res) => {
    try {
        // fetch all the bookmarked mealplan plan for user
        const bookmarks = await Bookmark.find({ user:req.user._id});

        // creating a bookmark set of mealplan id
        const bookmarkSet = new Set(bookmarks.map(b => b.mealplan.toString()));
        
        // fetch all mealplan
        const mealplan = await mealPlan.find({user:req.user._id}).sort({ createdAt: -1 });

        // now add bookmark flag to each meal plan
        const response = mealplan.map(plan => ({
            ...plan.toObject(),isBookmarked:bookmarkSet.has(plan._id.toString())
        }));

        if(!mealplan || mealplan.length === 0) {
            return res.status(200).json({
                "msg":"User has no meal plan"
            })
        } 
        res.json(response);
    } catch (error) {
        res.status(500).json({
            error:"Unable to fetch meal plan of user"
        })
    }
}

// delete meal plan
export const deleteMealPlan = async(req,res) => {
    try {
        const deleted = await mealPlan.findByIdAndDelete({_id:req.params.id,user:req.user._id});
        if(!deleted) {
            return res.status(404).json({
                "msg":"Meal Plan doesn't exists"
            })
        }
        res.status(200).json({
            "msg":"Deleted meal plan successfully"
        })

    } catch (error) {
        res.status(500).json({
            error:"Unable to delete meal plan"
        })
    }
}


// export mealplan to pdf logic - using pdfkit
export const exportToPdf = async(req,res) => {


    try {
    const id =  req.params.id;
    const plan = await mealPlan.findOne({ user:req.user._id , _id:id});

    // check if plan exist or not
    if(!plan) {
        return res.json({
            "msg":"Meal Plan doesn't exists"
        })
    }

    // if exist then create a new pdf document
    const doc = new PDFDocument({ margin:50 , size:'A4'});

    // catch stream errors 
    doc.on("error", (err) => {
        console.error("PDF error: ", err)
    })

    // set the headers
    res.setHeader("Content-Type","application/pdf");
    res.setHeader("Content-Disposition","attachment; filename=mealplan.pdf");
    doc.pipe(res);

    // title define
    const title = 'MedNutri MealPlan';
    const titleSize = 20;

    // layout of title
    doc.font("Helvetica-Bold").fontSize(titleSize);
    const ytop = 50;

    // add title next to it
    doc.text(title,ytop,ytop,{
        align:"center"
    });

    // add date of generation
    const todayDate = new Date().toLocaleDateString("en-In",{
        "year":"numeric",
        "month":"long",
        "day":"numeric"
    });

    doc.moveDown(4);
    doc.font("Helvetica").fontSize(10).text(`Generated on : ${todayDate}`, doc.page.width - 180 , ytop + 50);

    doc.moveDown(5);
    doc.x = doc.page.margins.left;

    // User Details
    doc.font("Helvetica-Bold").fontSize(14).text("User Details: ");
    doc.moveDown(1);
    doc.font("Helvetica").fontSize(12);
    doc.text(`Goal:${plan.goal}`);
    doc.text(`Age: ${plan.age}`);
    doc.text(`Gender: ${plan.gender}`);
    doc.text(`Preferences: ${plan.preferences?.join(", ") || "None"}`);
    doc.text(`Allergies: ${plan.allergies?.join(", ") || "None"}`);
    
    doc.moveDown(2);

    // Meal Plan Body
    doc.font("Helvetica-Bold").fontSize(14).text("Meal Plan Details: ");
    doc.moveDown(1);
    doc.font("Helvetica").fontSize(12).text(plan.plan,{
        lineGap:4,
        paragraphGap:6,
    });

    doc.end();

    } catch (error) {
       console.error("Meal plan PDF error",error)

       if(!res.setHeader){
        res.json({
        "msg":"Failed to generate pdf",error:error.message
       }) 
       }
    }


}

