
const BRAND = {
    name: "Ledgerly",
    accent: "#0F172A",   // deep navy
    accentSoft: "#1E293B",
    success: "#16A34A",
    successBg: "#F0FDF4",
    danger: "#DC2626",
    dangerBg: "#FEF2F2",
    neutralBg: "#F8FAFC",
    border: "#E2E8F0",
    textPrimary: "#0F172A",
    textMuted: "#64748B",
    white: "#FFFFFF",
};

function formatCurrency(amount) {
    const num = Number(amount);
    return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(date = new Date()) {
    return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}


function statusBadge(label, status) {
    const colors = {
        success: { bg: BRAND.successBg, fg: BRAND.success },
        failure: { bg: BRAND.dangerBg, fg: BRAND.danger },
        info: { bg: "#EFF6FF", fg: "#2563EB" },
    }[status] || { bg: BRAND.neutralBg, fg: BRAND.textMuted };

    return `
    <span style="display:inline-block;padding:6px 14px;border-radius:999px;background-color:${colors.bg};color:${colors.fg};font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
        ${label}
    </span>`;
}

function detailRow(label, value, isLast = false) {
    return `
    <tr>
        <td style="padding:12px 0;border-bottom:${isLast ? "none" : `1px solid ${BRAND.border}`};font-size:14px;color:${BRAND.textMuted};">
            ${label}
        </td>
        <td style="padding:12px 0;border-bottom:${isLast ? "none" : `1px solid ${BRAND.border}`};font-size:14px;color:${BRAND.textPrimary};font-weight:600;text-align:right;">
            ${value}
        </td>
    </tr>`;
}

/**
 * @param {Object} opts
 * @param {string} opts.preheader - hidden preview text shown in inbox list
 * @param {string} opts.heading - big heading inside the card
 * @param {string} opts.badgeHtml - optional status badge under the heading
 * @param {string} opts.bodyHtml - main message paragraph(s)
 * @param {string} [opts.detailsHtml] - optional receipt/details table
 * @param {string} [opts.ctaLabel] - optional button label
 * @param {string} [opts.ctaUrl] - optional button link
 * @param {string} [opts.accentColor] - color used for the top bar + heading
 */
function renderEmail({
    preheader = "",
    heading,
    badgeHtml = "",
    bodyHtml,
    detailsHtml = "",
    ctaLabel,
    ctaUrl,
    accentColor = BRAND.accent,
}) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.neutralBg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <!-- Preheader (hidden preview text) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.neutralBg};padding:40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:${BRAND.white};border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.08);">

                    <!-- Top accent bar -->
                    <tr>
                        <td style="height:4px;background-color:${accentColor};font-size:0;line-height:0;">&nbsp;</td>
                    </tr>

                    <!-- Logo / brand header -->
                    <tr>
                        <td style="padding:32px 40px 0 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td>
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width:32px;height:32px;background-color:${BRAND.accent};border-radius:8px;text-align:center;vertical-align:middle;">
                                                    <span style="color:${BRAND.white};font-size:16px;font-weight:800;line-height:32px;">L</span>
                                                </td>
                                                <td style="padding-left:10px;">
                                                    <span style="font-size:17px;font-weight:800;color:${BRAND.textPrimary};letter-spacing:-0.01em;">${BRAND.name}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main content -->
                    <tr>
                        <td style="padding:28px 40px 8px 40px;">
                            <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.3;color:${BRAND.textPrimary};font-weight:700;">
                                ${heading}
                            </h1>
                            ${badgeHtml ? `<div style="margin-bottom:16px;">${badgeHtml}</div>` : ""}
                            <div style="font-size:15px;line-height:1.6;color:${BRAND.textMuted};">
                                ${bodyHtml}
                            </div>
                        </td>
                    </tr>

                    ${detailsHtml ? `
                    <!-- Details / receipt card -->
                    <tr>
                        <td style="padding:8px 40px 8px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.neutralBg};border-radius:12px;padding:20px 20px;">
                                <tr>
                                    <td style="padding:0 4px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            ${detailsHtml}
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>` : ""}

                    ${ctaLabel && ctaUrl ? `
                    <!-- CTA button -->
                    <tr>
                        <td style="padding:28px 40px 8px 40px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="border-radius:10px;background-color:${BRAND.accent};">
                                        <a href="${ctaUrl}" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:700;color:${BRAND.white};text-decoration:none;border-radius:10px;">
                                            ${ctaLabel}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>` : ""}

                    <!-- Divider -->
                    <tr>
                        <td style="padding:28px 40px 0 40px;">
                            <div style="height:1px;background-color:${BRAND.border};"></div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:20px 40px 32px 40px;">
                            <p style="margin:0 0 6px 0;font-size:12px;line-height:1.6;color:${BRAND.textMuted};">
                                This is an automated message from ${BRAND.name}. Please do not reply to this email.
                            </p>
                            <p style="margin:0;font-size:12px;line-height:1.6;color:${BRAND.textMuted};">
                                &copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

module.exports = {
    BRAND,
    formatCurrency,
    formatDate,
    statusBadge,
    detailRow,
    renderEmail,
};