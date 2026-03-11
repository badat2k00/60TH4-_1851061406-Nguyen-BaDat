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
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

let authRouter = require('./routes/oauth')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api", router)
app.use('/oauth', authRouter)

connectDB()

module.exports = serverless(app)