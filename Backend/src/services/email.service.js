const nodemailer = require('nodemailer');
const {
    formatCurrency,
    formatDate,
    statusBadge,
    detailRow,
    renderEmail,
} = require('./email.templates');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,

    family: 4,

    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },

    logger: true,
    debug: true,

    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Core send function
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Ledgerly" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

/**
 * Welcome / registration email
 */
async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Ledgerly!';

    const text = `Hello ${name},\n\nThank you for registering at Ledgerly. We're excited to have you on board!\n\nBest regards,\nThe Ledgerly Team`;

    const html = renderEmail({
        preheader: `Welcome to Ledgerly, ${name}. Your account is ready.`,
        heading: `Welcome aboard, ${name.split(" ")[0]} 👋`,
        badgeHtml: statusBadge("Account Created", "success"),
        bodyHtml: `
            <p style="margin:0 0 12px 0;">
                Thank you for creating a Ledgerly account. You're all set to start managing your money, tracking balances, and sending transfers securely.
            </p>
            <p style="margin:0;">
                If you didn't create this account, please contact our support team immediately.
            </p>
        `,
        detailsHtml: `
            ${detailRow("Account Holder", name)}
            ${detailRow("Email", userEmail)}
            ${detailRow("Joined On", formatDate(), true)}
        `,
        // ctaLabel: "Go to Dashboard",
        // ctaUrl: "#",
        // accentColor: "#0F172A",
    });

    await sendEmail(userEmail, subject, text, html);
}

/**
 * Successful transaction email
 */
async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Successful!';

    const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} was successful.\n\nBest regards,\nThe Ledgerly Team`;

    const html = renderEmail({
        preheader: `Your transfer of ${formatCurrency(amount)} was successful.`,
        heading: "Transfer Successful",
        badgeHtml: statusBadge("Completed", "success"),
        bodyHtml: `
            <p style="margin:0;">
                Hi ${name.split(" ")[0]}, your transfer has been processed and completed successfully. Here's a summary of your transaction:
            </p>
        `,
        detailsHtml: `
            ${detailRow("Amount", `<span style="color:#16A34A;">${formatCurrency(amount)}</span>`)}
            ${detailRow("To Account", toAccount)}
            ${detailRow("Date & Time", formatDate())}
            ${detailRow("Status", statusBadge("Completed", "success"), true)}
        `,
        // ctaLabel: "View Transaction History",
        // ctaUrl: "#",
        // accentColor: "#16A34A",
    });

    await sendEmail(userEmail, subject, text, html);
}

/**
 * Failed transaction email
 */
async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Failed';

    const text = `Hello ${name},\n\nWe regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.\n\nBest regards,\nThe Ledgerly Team`;

    const html = renderEmail({
        preheader: `Your transfer of ${formatCurrency(amount)} could not be completed.`,
        heading: "Transfer Failed",
        badgeHtml: statusBadge("Failed", "failure"),
        bodyHtml: `
            <p style="margin:0 0 12px 0;">
                Hi ${name.split(" ")[0]}, we weren't able to complete your recent transfer. No funds have been deducted from your account.
            </p>
            <p style="margin:0;">
                Please try again in a few minutes. If the issue persists, reach out to our support team for help.
            </p>
        `,
        detailsHtml: `
            ${detailRow("Amount", formatCurrency(amount))}
            ${detailRow("To Account", toAccount)}
            ${detailRow("Date & Time", formatDate())}
            ${detailRow("Status", statusBadge("Failed", "failure"), true)}
        `,
        // ctaLabel: "Retry Transfer",
        // ctaUrl: "#",
        // accentColor: "#DC2626",
    });

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};
