import nodemailer from "nodemailer";
import { EventEmitter } from "node:events";

export const emitter = new EventEmitter();

emitter.on("SendEmail", async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const mailOptions = {
            from: `"CodeGad" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };
        await transporter.sendMail(mailOptions);
        return { message: "Email sent successfully" };
    } catch (error) {
        console.log(error);
        return { message: "Internal server error" };
    }
})

