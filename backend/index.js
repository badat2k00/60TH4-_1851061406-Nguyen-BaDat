const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
const bodyParser = require('body-parser')
const serverless = require("serverless-http")

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}))

let authRouter = require('./routes/oauth')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

connectDB()

app.get("/test", (req, res) => {
    res.json({ success: true })
})
app.use("/api", router)
app.use('/oauth', authRouter)

// ✅ Local: chạy với port | Vercel: export serverless
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8080
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
}

module.exports = serverless(app)