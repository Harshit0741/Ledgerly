const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")


const app = express()

console.log("🌐 FRONTEND_URL:", process.env.FRONTEND_URL);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🔐 CORS request from:", origin);
      console.log("✅ Allowed frontend:", process.env.FRONTEND_URL);

      if (!origin || origin === process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
        console.log("❌ CORS BLOCKED:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

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
    console.error(err)

    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message })
    }

    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid identifier" })
    }

    const status = err.status || err.statusCode || 500
    res.status(status).json({
        message: status === 500 ? "Something went wrong" : err.message
    })
})

module.exports = app
