const nodemailer = require("nodemailer");
const userModel = require("../../../models/userModel");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "vnfarmgl@gmail.com",
    pass: "vmesaehxdzlcgvev",
  },
   tls: {
    rejectUnauthorized: false, // bỏ qua self-signed cert
  },
});

async function sendPassword(req, res) {
  try{
    const email=req.body.email;
    console.log(email)
    const user = await userModel.findOne({email:email});
    if(!user){
      return  res.json({
            message:"Không tìm thấy tài khoản do email không đăng ký ",
            success:false,
            error:true
        })
    }
    if(user.password===null){
        return res.json({
            message:"Tài khoản này không dùng mật khẩu .Bạn có thể đăng nhập bằng Google",
            success:false,
            error:true
        })
    }
    

    console.log(user.email)
    await transporter.sendMail({
      to: email, 
      subject: "Cấp mật khẩu",
      text: "Cấp lại Mật khẩu ", 
      html: `Mật khẩu của bạn là ${user.originpassword}.Vui lòng lại đăng nhập tại <a href="http://localhost:3000/login">Đăng nhập</a>` , 
    });
    return res.json({
        message:"Gửi email thành công",
        success:true,
        error:false
    })

}catch(err){
    console.error(err);
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
}
}
module.exports = sendPassword;
