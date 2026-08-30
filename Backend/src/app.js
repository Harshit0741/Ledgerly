const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")


const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    credentials: true,
}))

app.use(express.json())
app.use(cookieParser())


const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require("./routes/transaction.routes")



app.get("/", (req, res) => {
    res.send("Ledger Service is up and running")
})

app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)

app.use("/api", (req, res) => {
    res.status(404).json({ message: "Not found" })
})

app.use((err, req, res, next) => {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.error("❌ EXPRESS ERROR")
    console.error("❌ Method:", req.method)
    console.error("❌ URL:", req.originalUrl)
    console.error("❌ Error name:", err.name)
    console.error("❌ Error message:", err.message)
    console.error("❌ Error stack:", err.stack)
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: err.message,
        })
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid identifier",
        })
    }

    const status = err.status || err.statusCode || 500

    res.status(status).json({
        message: status === 500 ? "Something went wrong" : err.message,
        ...(process.env.NODE_ENV !== "production" && {
            error: err.message,
            stack: err.stack,
        }),
    })
})

module.exports = app