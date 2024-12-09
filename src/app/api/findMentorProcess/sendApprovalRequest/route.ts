import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import User from '@/app/DB/models/UserModel';

export async function POST(req: Request) {
    const { mentor, request } = await req.json();

    console.log("mentor, request", mentor, request);


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

    console.log("email,mainField, subField", email, mainField, subField);


    console.log('Sending approval request to mentor:', email);

    // יצירת קישור לאישור
    // const approvalLink = `${process.env.BASE_URL}/approve-mentor?requestId=${request._id}&mentorId=${mentor._id}`;

    const approvalLink ="http://localhost:3000/pages/user/login"


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
        subject: 'Learning Request Approval',
        text: `Hello ${mentor.firstName},\n\nYou have received a new learning request in the field of ${mainField} (${subField}).\nPlease click the link below to approve or decline the request.\n\nApproval link: ${approvalLink}\n\nThe request will expire after 24 hours.`,
        html: `
            <p>Hello ${mentor.firstName},</p>
            <p>You have received a new learning request in the field of <strong>${mainField}</strong> (<strong>${subField}</strong>).</p>
            <p>Please click the link below to approve or decline the request.</p>
            <p><a href="${approvalLink}">Approve/Decline Request</a></p>
            <p>The request will expire after 24 hours.</p>
        `,
    };

    try {
        //שמירה שהמנטור צריך לאשר
        mentorFromDB.learningApprovalPending = request;
        await mentorFromDB.save()

        //שליחת המייל
        await transporter.sendMail(mailOptions);
        console.log('Approval request sent successfully');

        return NextResponse.json({ success: true, message: 'Approval request sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending approval request:', error);

        return NextResponse.json({ success: false, message: 'Error sending the approval request. Please try again.' }, { status: 500 });
    }
}
