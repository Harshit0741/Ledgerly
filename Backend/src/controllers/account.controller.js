const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const treasuryService = require("../services/treasury.service");
const mongoose = require("mongoose");

const SIGNUP_BONUS_AMOUNT = Number(process.env.SIGNUP_BONUS_AMOUNT || 100)


async function createAccountController(req, res) {

    const user = req.user;

    const account = await accountModel.create({
        user: user._id
    })

    if (SIGNUP_BONUS_AMOUNT > 0) {
        try {
            const treasuryAccountId = await treasuryService.getOrCreateTreasuryAccount()

            const session = await mongoose.startSession()
            session.startTransaction()

            const transaction = (await transactionModel.create([ {
                fromAccount: treasuryAccountId,
                toAccount: account._id,
                amount: SIGNUP_BONUS_AMOUNT,
                idempotencyKey: `signup-bonus-${account._id}`,
                status: "PENDING"
            } ], { session }))[ 0 ]

            await ledgerModel.create([ {
                account: treasuryAccountId,
                amount: SIGNUP_BONUS_AMOUNT,
                transaction: transaction._id,
                type: "DEBIT"
            } ], { session })

            await ledgerModel.create([ {
                account: account._id,
                amount: SIGNUP_BONUS_AMOUNT,
                transaction: transaction._id,
                type: "CREDIT"
            } ], { session })

            await transactionModel.findOneAndUpdate(
                { _id: transaction._id },
                { status: "COMPLETED" },
                { session }
            )

            await session.commitTransaction()
            session.endSession()
        } catch (err) {
            console.error("Failed to credit signup bonus:", err.message)
        }
    }

    res.status(201).json({
        account
    })

}

async function getUserAccountsController(req, res) {

    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    })
}

async function getAccountBalanceController(req, res) {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}


module.exports = {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController
}