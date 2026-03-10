const mongoose = require("mongoose")


async function connectDB(){
    try{
        // await mongoose.connect(process.env.MONGODB_URI)

        await mongoose.connect("mongodb+srv://dat:datbeo2000@cluster1.qps1vaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1")
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDB