const nodemailer = require('nodemailer');
const {
    formatCurrency,
    formatDate,
    statusBadge,
    detailRow,
    renderEmail,
} = require('./email.templates');

// ============================================================
// EMAIL CONFIGURATION
// ============================================================

console.log('📧 Initializing email service...');
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
console.log('📧 CLIENT_ID:', process.env.CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('📧 CLIENT_SECRET:', process.env.CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('📧 REFRESH_TOKEN:', process.env.REFRESH_TOKEN ? '✅ Set' : '❌ Missing');

const transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },

    // Debugging
    logger: true,
    debug: true,

    // Prevent the request from hanging indefinitely
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
});

// ============================================================
// VERIFY EMAIL CONNECTION
// ============================================================

console.log('📧 Checking Gmail SMTP connection...');

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Gmail SMTP verification FAILED');
        console.error('❌ Error:', error);
        console.error('❌ Message:', error.message);
        console.error('❌ Code:', error.code);
        console.error('❌ Command:', error.command);
        console.error('❌ Response:', error.response);
    } else {
        console.log('✅ Gmail SMTP connection verified');
        console.log('📧 Email server is ready to send messages');
    }
});

// ============================================================
// CORE SEND FUNCTION
// ============================================================

const sendEmail = async (to, subject, text, html) => {
    console.log('');
    console.log('========================================');
    console.log('📤 EMAIL SEND STARTED');
    console.log('========================================');
    console.log('📨 To:', to);
    console.log('📝 Subject:', subject);
    console.log('📧 From:', process.env.EMAIL_USER);

    try {
        console.log('🔄 Calling transporter.sendMail()...');

        const info = await transporter.sendMail({
            from: `"Ledgerly" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log('');
        console.log('========================================');
        console.log('✅ EMAIL SENT SUCCESSFULLY');
        console.log('========================================');

        console.log('📨 Message ID:', info.messageId);
        console.log('📬 Accepted:', info.accepted);
        console.log('📭 Rejected:', info.rejected);
        console.log('📡 Response:', info.response);

        return info;

    } catch (error) {
        console.error('');
        console.error('========================================');
        console.error('❌ EMAIL SEND FAILED');
        console.error('========================================');

        console.error('❌ Error message:', error.message);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error command:', error.command);
        console.error('❌ Error response:', error.response);
        console.error('❌ Error responseCode:', error.responseCode);
        console.error('❌ Full error:', error);

        return null;
    }
};

// ============================================================
// WELCOME / REGISTRATION EMAIL
// ============================================================

async function sendRegistrationEmail(userEmail, name) {
    console.log('👤 Registration email requested');
    console.log('👤 User:', name);
    console.log('📨 Email:', userEmail);

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
    });

    console.log('📧 Sending registration email...');

    await sendEmail(userEmail, subject, text, html);

    console.log('✅ Registration email process completed');
}

// ============================================================
// SUCCESSFUL TRANSACTION EMAIL
// ============================================================

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    console.log('💸 Transaction success email requested');
    console.log('👤 User:', name);
    console.log('📨 Email:', userEmail);
    console.log('💰 Amount:', amount);
    console.log('🏦 To Account:', toAccount);

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
    });

    console.log('📧 Sending transaction success email...');

    await sendEmail(userEmail, subject, text, html);

    console.log('✅ Transaction success email process completed');
}

// ============================================================
// FAILED TRANSACTION EMAIL
// ============================================================

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    console.log('❌ Transaction failure email requested');
    console.log('👤 User:', name);
    console.log('📨 Email:', userEmail);
    console.log('💰 Amount:', amount);
    console.log('🏦 To Account:', toAccount);

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
    });

    console.log('📧 Sending transaction failure email...');

    await sendEmail(userEmail, subject, text, html);

    console.log('✅ Transaction failure email process completed');
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail,
};
