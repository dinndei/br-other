import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import User from '@/app/DB/models/UserModel';

export async function POST(req: Request) {
    const { mentor, request } = await req.json();
    if (!mentor || !request) {
        return NextResponse.json({ success: false, message: 'Mentor and request are required.' }, { status: 400 });
    }

    const mentorFromDB = await User.findById(mentor._id);
        if (!mentorFromDB) {
            return NextResponse.json({ success: false, message: 'Mentor not found.' }, { status: 404 });
        }

    const email = mentor.email;
    const mainField = request.mainField;
    const subField = request.subField;

    const approvalLink ="https://br-other.vercel.app/pages/user/login"


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'brother.otpcode@gmail.com',
            pass: 'ghog ahvy isch skxg',
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'בקשה לאישור למידה',
        text: `שלום ${mentor.firstName},\n\nקיבלת בקשה חדשה ללמידה בתחום ${mainField} (${subField}).\nאנא לחץ על הקישור למטה כדי לאשר או לדחות את הבקשה.\n\nקישור לאישור: ${approvalLink}\n\nהבקשה תתפוגג לאחר 24 שעות.`,
        html: `
            <p>שלום ${mentor.firstName},</p>
            <p>קיבלת בקשה חדשה ללמידה בתחום <strong>${mainField}</strong> (<strong>${subField}</strong>).</p>
            <p>אנא לחץ על הקישור למטה כדי לאשר או לדחות את הבקשה.</p>
            <p><a href="${approvalLink}">אשר/דחה את הבקשה</a></p>
            <p>הבקשה תפוג לאחר 24 שעות.</p>
        `,
    };

    try {
        //שמירה שהמנטור צריך לאשר
        mentorFromDB.learningApprovalPending = request;
        await mentorFromDB.save()

        //שליחת המייל
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true, message: 'Approval request sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending approval request:', error);

        return NextResponse.json({ success: false, message: 'Error sending the approval request. Please try again.' }, { status: 500 });
    }
}
