const userModel = require("../../models/userModel")
async function searchUser(req,res){
try {
const {query}=req.body
 const queryRegex = query.split(' ').join('.*');
        const regex = new RegExp(queryRegex,'i')

        const user = await userModel.find({
            "$or" : [
                {
                    name :  { $regex: regex }
                },
                {
                    email: {$regex: regex }
                }
            ]
        })
          const filteredUsers = user.filter(user => user.role !== "ADMIN");

        res.json({
            data: filteredUsers,
            message: "Find User Successfully",
            error: false,
            success: true
        });

} catch (error) {
    
}
}


module.exports = searchUser