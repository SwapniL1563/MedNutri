import Bookmark from "../models/bookmarkModel.js";
import mealPlan from "../models/mealplanModel.js";


// adding bookmark logic
export const addBookmark = async(req,res) => {
    const id  = req.params.id;
    try{
       const mealplan = await mealPlan.findOne({ _id: id, user: req.user._id });
       if (!mealplan) {
        return res.status(404).json({ msg: "Meal Plan not found" });
       }
       const bookmarkExist = await Bookmark.findOne({ user:req.user._id,mealplan:id });
       // if bookmark already exist then
       if(bookmarkExist) {
        return res.json({
            "msg":"Already Bookmarked"
        });
       }

       // if not then add bookmark to mealplan
       const bookmark = await Bookmark.create({
           user:req.user._id,mealplan:id
       });

       res.json({
        "msg":"Bookmark added"
       })
    } catch(error){
        res.json({
          error:"Failed to add book mark"
        , error: error.message });
    }
};


// remove the existing bookmark logic
export const removeBookmark = async(req,res) => {
    const  id  = req.params.id;

    try {
        const deletedBookmark = await Bookmark.findOneAndDelete({ user:req.user._id, mealplan:id });
        // if bookmark not found then
        if(!deletedBookmark) {
            return res.json({
                "msg":"Bookmark Not found!"
            });
        }

        // if deleted successfully then
        res.json({
            "msg":"Bookmark removed successfully!"
        });

    } catch (error) {
        res.json({
            "msg":"Failed to remove bookmark" , error:error.message
        });
    }
}

// fetch all the bookmarked mealplan for the logged in user logic
export const getBookmarks = async(req,res) => {
    try {
        const bookmarks = await Bookmark.find({ user:req.user._id }).populate('mealplan');
        if(!bookmarks || bookmarks.length === 0){
            return res.json({
                "msg":"No bookmark added"
            })
        }
        
        // only valid bookmarks to show
        const validBookmarks = bookmarks.filter(b => b.mealplan !== null);
        return res.json(validBookmarks);
    } catch (error) {
        res.json({
            "msg":"Failed to fetch the bookmarks", error:error.message
        });
    }
}