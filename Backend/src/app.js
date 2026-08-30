const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")


const app = express()

console.log("🌐 FRONTEND_URL:", process.env.FRONTEND_URL);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
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

app.get("/test-email-connection", async (req, res) => {
    const dns = require("dns");

    console.log("🧪 Testing Gmail SMTP connection...");

    dns.lookup("smtp.gmail.com", { all: true }, (err, addresses) => {
        if (err) {
            console.error("❌ DNS ERROR:", err);
            return res.status(500).json({
                success: false,
                error: err.message,
            });
        }

        console.log("📡 Gmail IPs:", addresses);

        res.json({
            success: true,
            message: "DNS resolution works",
            addresses,
        });
    });
});

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
