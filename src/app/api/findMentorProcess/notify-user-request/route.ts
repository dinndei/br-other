import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import User from '@/app/DB/models/UserModel';
import LearningRequestModel from '@/app/DB/models/LearningRequestModel';

export async function POST(req: Request) {
    const { request, isApproved, mentor } = await req.json();
    if (!request || !request.requesterId) {
        return NextResponse.json({ success: false, message: 'Request and student ID are required.' }, { status: 400 });
    }

    try {
        const student = await User.findById(request.requesterId);
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
                subject: 'הבקשה ללמידה אושרה!',
                text: `שלום ${studentName},\n\nיש לנו חדשות טובות! הבקשה שלך ללמוד ${mainField} (${subField}) אושרה.\nהמנטור שלך הוא ${mentor.firstName} ${mentor.lastName}. אנא צור קשר עם המנטור כדי לקבוע את שיעוריך.\n\nתודה שבחרת בשירות שלנו.`,
                html: `
                    <p>שלום ${studentName},</p>
                    <p>יש לנו חדשות טובות! הבקשה שלך ללמוד <strong>${mainField}</strong> (<strong>${subField}</strong>) אושרה.</p>
                    <p>המנטור שלך הוא <strong>${mentor.firstName} ${mentor.lastName}</strong>. אנא צור קשר עם המנטור כדי לקבוע את שיעוריך.</p>
                    <p>תודה שבחרת בשירות שלנו.</p>
                `,
            };
        } else {
            mailOptions = {
                from: process.env.GMAIL_USER,
                to: studentEmail,
                subject: 'לא נמצא מנטור מתאים לבקשת הלמידה שלך',
                text: `שלום ${studentName},\n\nלצערנו, לא מצאנו מנטור מתאים לבקשה שלך ללמוד ${mainField} (${subField}) בזמן זה.\nאנא נסה לשלוח את הבקשה שוב או שקול לבחור תחום אחר.\n\nתודה על ההבנה.`,
                html: `
                    <p>שלום ${studentName},</p>
                    <p>לצערנו, לא מצאנו מנטור מתאים לבקשה שלך ללמוד <strong>${mainField}</strong> (<strong>${subField}</strong>) בזמן זה.</p>
                    <p>אנא נסה לשלוח את הבקשה שוב או שקול לבחור תחום אחר.</p>
                    <p>תודה על ההבנה.</p>
                `,
            };

        }

        await transporter.sendMail(mailOptions);
        await LearningRequestModel.findByIdAndDelete(request._id);


        return NextResponse.json({ success: true, message: 'Notification email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error processing the request:', error);
        return NextResponse.json({ success: false, message: 'Error processing the request. Please try again.' }, { status: 500 });
    }
}
