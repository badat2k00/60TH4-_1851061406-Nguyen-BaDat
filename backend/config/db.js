const mongoose = require("mongoose")

let cached = global.mongoose || { conn: null, promise: null }
global.mongoose = cached

async function connectDB() {
    // ✅ Nếu đã có connection rồi thì dùng lại, không tạo mới
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        })
    }

    try {
        cached.conn = await cached.promise
        console.log("MongoDB connected")
    } catch (err) {
        cached.promise = null  // ✅ Reset để lần sau thử lại
        console.log(err)
        throw err
    }

    return cached.conn
}

module.exports = connectDB