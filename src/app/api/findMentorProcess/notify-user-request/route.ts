import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import User from '@/app/DB/models/UserModel';

export async function POST(req: Request) {
    const { request, isApproved, mentor } = await req.json();

    if (!request || !request.studentId) {
        return NextResponse.json({ success: false, message: 'Request and student ID are required.' }, { status: 400 });
    }

    try {
        const student = await User.findById(request.studentId);
        if (!student) {
            return NextResponse.json({ success: false, message: 'Student not found.' }, { status: 404 });
        }

        const studentEmail = student.email;
        const studentName = student.firstName;

        const mainField = request.mainField;
        const subField = request.subField;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'brother.otpcode@gmail.com',
                pass: 'ghog ahvy isch skxg',
            },
        });

        let mailOptions;

        if (isApproved && mentor) {
            mailOptions = {
                from: process.env.GMAIL_USER,
                to: studentEmail,
                subject: 'Your Learning Request Was Approved!',
                text: `Hello ${studentName},\n\nGood news! Your request to learn ${mainField} (${subField}) has been approved.\nYour mentor is ${mentor.firstName} ${mentor.lastName}. Please contact them to arrange your lessons.\n\nThank you for choosing our service.`,
                html: `
                    <p>Hello ${studentName},</p>
                    <p>Good news! Your request to learn <strong>${mainField}</strong> (<strong>${subField}</strong>) has been approved.</p>
                    <p>Your mentor is <strong>${mentor.firstName} ${mentor.lastName}</strong>. Please contact them to arrange your lessons.</p>
                    <p>Thank you for choosing our service.</p>
                `,
            };
        } else {
            mailOptions = {
                from: process.env.GMAIL_USER,
                to: studentEmail,
                subject: 'No Mentor Found for Your Learning Request',
                text: `Hello ${studentName},\n\nUnfortunately, we couldn't find a suitable mentor for your request to learn ${mainField} (${subField}) at this time.\nPlease try submitting your request again or consider choosing a different field.\n\nThank you for your understanding.`,
                html: `
                    <p>Hello ${studentName},</p>
                    <p>Unfortunately, we couldn't find a suitable mentor for your request to learn <strong>${mainField}</strong> (<strong>${subField}</strong>) at this time.</p>
                    <p>Please try submitting your request again or consider choosing a different field.</p>
                    <p>Thank you for your understanding.</p>
                `,
            };
        }

        await transporter.sendMail(mailOptions);
        console.log('Notification email sent successfully');

        return NextResponse.json({ success: true, message: 'Notification email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error processing the request:', error);
        return NextResponse.json({ success: false, message: 'Error processing the request. Please try again.' }, { status: 500 });
    }
}
