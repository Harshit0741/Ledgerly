const crypto = require("crypto")
const userModel = require("../models/user.model")
const accountModel = require("../models/account.model")

const TREASURY_EMAIL = "treasury@ledger.internal"

let cachedTreasuryAccountId = null

/**
 * Finds (or creates, on first use) the internal treasury user + account
 * that signup bonuses are debited from. Keeps the ledger's debit=credit
 * invariant intact instead of crediting accounts out of nowhere.
 */
async function getOrCreateTreasuryAccount() {
    if (cachedTreasuryAccountId) {
        return cachedTreasuryAccountId
    }

    let treasuryUser = await userModel.findOne({ email: TREASURY_EMAIL })

    if (!treasuryUser) {
        treasuryUser = await userModel.create({
            email: TREASURY_EMAIL,
            name: "System Treasury",
            password: crypto.randomBytes(32).toString("hex"), // never used to log in
            systemUser: true
        })
    }

    let treasuryAccount = await accountModel.findOne({ user: treasuryUser._id })

    if (!treasuryAccount) {
        treasuryAccount = await accountModel.create({ user: treasuryUser._id })
    }

    cachedTreasuryAccountId = treasuryAccount._id
    return treasuryAccount._id
}

module.exports = { getOrCreateTreasuryAccount }
