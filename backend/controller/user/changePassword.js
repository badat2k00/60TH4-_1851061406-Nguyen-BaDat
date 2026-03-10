const userModel = require("../../models/userModel");
const bcrypt = require('bcryptjs');

async function changePassword(req, res) {
    try {
        const sessionUser = req.userId; 
        const { userId, originpassword, newPassword } = req.body;
        console.log(originpassword,newPassword)
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        const isPasswordMatch = await bcrypt.compare(originpassword, user.password);
        if (!isPasswordMatch) {
            throw new Error("Mật khẩu cũ không chính xác");
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedNewPassword = await bcrypt.hashSync(newPassword, salt);

        const payload = {
            password: hashedNewPassword, 
        };

        const updateUser = await userModel.findByIdAndUpdate(userId, payload, { new: true });

        res.json({
            data: updateUser,
            message: "Đổi mật khẩu thành công",
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = changePassword;
