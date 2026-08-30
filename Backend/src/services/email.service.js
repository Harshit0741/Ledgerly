const { Resend } = require("resend");

const {
    formatCurrency,
    formatDate,
    statusBadge,
    detailRow,
    renderEmail,
} = require("./email.templates");

console.log("📧 Initializing Resend email service...");

console.log(
    "📧 RESEND_API_KEY:",
    process.env.RESEND_API_KEY ? "✅ Set" : "❌ Missing"
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Core send function
const sendEmail = async (to, subject, text, html) => {
    try {
        console.log("📤 Preparing to send email...");
        console.log("📨 To:", to);
        console.log("📝 Subject:", subject);

        const { data, error } = await resend.emails.send({
            from: "Ledgerly <onboarding@resend.dev>",
            to: [to],
            subject,
            text,
            html,
        });

        if (error) {
            console.error("❌ Resend email error:");
            console.error(error);

            return;
        }

        console.log("✅ Email sent successfully!");
        console.log("📧 Resend Email ID:", data?.id);
    } catch (error) {
        console.error("❌ Error sending email:");
        console.error(error);
    }
};

/**
 * Welcome / registration email
 */
async function sendRegistrationEmail(userEmail, name) {
    const subject = "Welcome to Ledgerly!";

    const text = `Hello ${name},

Thank you for registering at Ledgerly. We're excited to have you on board!

Best regards,
The Ledgerly Team`;

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

    await sendEmail(userEmail, subject, text, html);
}

/**
 * Successful transaction email
 */
async function sendTransactionEmail(
    userEmail,
    name,
    amount,
    toAccount
) {
    const subject = "Transaction Successful!";

    const text = `Hello ${name},

Your transaction of $${amount} to account ${toAccount} was successful.

Best regards,
The Ledgerly Team`;

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
            ${detailRow(
                "Amount",
                `<span style="color:#16A34A;">${formatCurrency(amount)}</span>`
            )}
            ${detailRow("To Account", toAccount)}
            ${detailRow("Date & Time", formatDate())}
            ${detailRow(
                "Status",
                statusBadge("Completed", "success"),
                true
            )}
        `,
    });

    await sendEmail(userEmail, subject, text, html);
}

/**
 * Failed transaction email
 */
async function sendTransactionFailureEmail(
    userEmail,
    name,
    amount,
    toAccount
) {
    const subject = "Transaction Failed";

    const text = `Hello ${name},

We regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.

Best regards,
The Ledgerly Team`;

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
            ${detailRow(
                "Status",
                statusBadge("Failed", "failure"),
                true
            )}
        `,
    });

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail,
};