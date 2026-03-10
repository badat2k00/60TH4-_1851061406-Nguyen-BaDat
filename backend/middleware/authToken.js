const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
async function authToken(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(200).json({
        message: "Hãy đăng nhập",
        error: true,
        success: false,
      });
    }

    jwt.verify(token,process.env.TOKEN_SECRET_KEY,async function (err, decoded) {
        if (!err) {
          req.userId = decoded._id;
          return next();
        }
        if (err) {
          const decodedExpired = jwt.decode(token);
          const user = await userModel.findById(decodedExpired._id);

          if (!user || !user.refreshToken) {
            return res.status(401).json({
                message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
              });
          }
          try {
            const refreshDecoded = jwt.verify(user.refreshToken,process.env.REFRESH_TOKEN_SECRET_KEY);
            const newAccessToken = jwt.sign({ _id: refreshDecoded._id,email: refreshDecoded.email },
              process.env.TOKEN_SECRET_KEY,
              { expiresIn: "7h" }
            );

            res.cookie("accessToken", newAccessToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
              maxAge: 7 * 60 * 60 * 1000,
            });
            req.userId = refreshDecoded._id;
            next();
          } catch (err) {
            return res.status(401).json({
                message: "Vui lòng đăng nhập lại.",
              });
          }
        }
      }
    );
  } catch (err) {
    res.status(400).json({
      message: "Bạn cần đăng nhập để sử dụng tính năng này",
      data: [],
      error: true,
      success: false,
    });
  }
}

module.exports = authToken;
