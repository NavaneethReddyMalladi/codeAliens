import { db } from "../database/db.js";
import { sendEmail } from "./mail.js";

const sendOtpToEmail = async (email) => {

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const otpExpiry = Date.now() + 15 * 60 * 1000;

    // Save user in DB here...
    // const updateOtp  = db.prepare(`update users set otp = ?, otpExpiry = ? where email = ?`)
    // const result = updateOtp.run(otp,otpExpiry,email);

    await sendEmail(
        email,
        "Email Verification OTP",
        otp
    );

    return {otp,otpExpiry};
}

export { sendOtpToEmail}