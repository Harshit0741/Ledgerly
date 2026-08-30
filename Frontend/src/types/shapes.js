/**
 *
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} email
 * @property {string} name
 *
 * @typedef {"ACTIVE"|"FROZEN"|"CLOSED"} AccountStatus
 *
 * @typedef {Object} Account
 * @property {string} _id
 * @property {string} user
 * @property {AccountStatus} status
 * @property {string} currency
 * @property {string} createdAt
 *
 * @typedef {"PENDING"|"COMPLETED"|"FAILED"|"REVERSED"} TransactionStatus
 *
 * @typedef {Object} Transaction
 * @property {string} _id
 * @property {string} fromAccount
 * @property {string} toAccount
 * @property {number} amount
 * @property {TransactionStatus} status
 * @property {string} [idempotencyKey]
 */

export const ACCOUNT_STATUSES = ["ACTIVE", "FROZEN", "CLOSED"];
export const TRANSACTION_STATUSES = ["PENDING", "COMPLETED", "FAILED", "REVERSED"];
