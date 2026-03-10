const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs');

async function userSignUpController(req,res){
    try{
        const { email, password, name} = req.body

        const user = await userModel.findOne({email})
        if(user){
            throw new Error("Email này đã được đăng ký.Vui lòng nhập email khác")
        }
        // if(!email){
        //    throw new Error("Vui lòng nhập email")
        // }
        // if(!password){
        //     throw new Error("Vui lòng nhập mật khẩu")
        // }
        // if(!name){
        //     throw new Error("Vui lòng nhập tên")
        // }
        
       
        const hashPassword = await bcrypt.hash(password, 10);

        if(!hashPassword){
            throw new Error("")
        }

        
        const payload = {
            ...req.body,
            role : "GENERAL",
            originpassword:password,
            password : hashPassword,
            isGoogleLink:false
        }

        const userData = new userModel(payload)
        const saveUser = await userData.save()

        res.status(201).json({
            data : saveUser,
            success : true,
            error : false,
            message : "Tài khoản được tạo thành công"
        })


    }catch(err){
        res.json({
            message : err.message || err ,
            error : true,
            success : false,
        })
    }
}

module.exports = userSignUpController