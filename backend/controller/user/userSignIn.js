const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const jwt = require('jsonwebtoken');
async function userSignInController(req, res) {
    try {   
        const { email, password } = req.body;
        const user = await userModel.findOne({ email});

        if (!user) {
            throw new Error("Không tìm thấy tài khoản");
        }
        if(email==user.email && user.isGoogle==true){
            throw new Error("Email đã được đăng ký bằng Google");
        }
        const checkPassword = await bcrypt.compare(password, user.password);
        console.log(checkPassword)
        if (checkPassword) {
            const tokenData = {
                _id: user._id,
                email: user.email,
            };

            const accessToken = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '7h' });
            const refreshToken = jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });
           
            user.refreshToken = refreshToken;
            await user.save();

            const accessTokenOption = {
                httpOnly: true,
                secure: true,

            };

            
            res.cookie("accessToken", accessToken, accessTokenOption);

            res.status(200).json({
                refreshToken:refreshToken,
                accessToken:accessToken,
                message: "Đăng nhập thành công",
                success: true,
                error: false
            });

        } 
        else {
            throw new Error("Mật khẩu không đúng .Vui lòng nhập lại mật khẩu");

            // throw new Error("Mật khẩu không đúng .Vui lòng nhập lại mật khẩu");
        }

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userSignInController;




/* nếu thiết bị + IP + status thành công => lần sau đăng nhập 
Ko cần verify nữa 

Thiết lập status : detail true (email+ password true)
Thiết bị đúng ; IP sai ; status : detail đúng :
Gửi email xác nhận hoặc mã pin 

Thiết bị sai , IP đúng , status :detail đúng :
Vẫn cho đăng nhập 

Thiết bị sai ,IP sai ,detail đúng 
Gửi email xác nhận 

Thiết bị đúng ,IP đúng ,detail sai
+Cách xử lý 
Nhập mã pin:Sai mã pin quá 5 lần khóa 

hoặc chọn forgot password(gửi email xác nhận OTP , nhập sai quá 5 lần => khóa không cho nhận OTP 

) 

Thiết bị sai ,IP sai ,detail sai 



// thummarkJS =>get frontend=>fingerprint 



*/