import { connectToDB } from "@/app/DB/connection/connectToDB";
import Field from "@/app/DB/models/FieldToDBModel";
import {  NextResponse } from "next/server";

const fieldsData = [
    { mainField: "הוראה", subFields: ["מתמטיקה", "אנגלית", "היסטוריה", "פיזיקה", "כימיה", "ביולוגיה", "ספרות", "חינוך מיוחד"] },
    { mainField: "הנדסה", subFields: ["הנדסת תוכנה", "הנדסת מכונות", "הנדסה אזרחית", "הנדסת חשמל", "הנדסת תעשייה וניהול", "הנדסה ביו-רפואית"] },
    { mainField: "רפואה", subFields: ["רפואה כללית", "אורתופדיה", "קרדיולוגיה", "רפואת ילדים", "גינקולוגיה", "נוירולוגיה"] },
    { mainField: "טכנולוגיה", subFields: ["פיתוח אתרים", "אבטחת מידע", "בינה מלאכותית", "פיתוח אפליקציות", "מדעי הנתונים"] },
    { mainField: "משפטים", subFields: ["משפט פלילי", "משפט אזרחי", "דיני עבודה", "דיני משפחה", "זכויות אדם"] },
    { mainField: "עסקים", subFields: ["שיווק דיגיטלי", "ניהול פרויקטים", "יזמות", "חשבונאות", "פיננסים"] },
    // הוספת שאר התחומים מהרשימה
];

export async function POST() {
    try {
        await connectToDB();

        // מנקה את הטבלה לפני שמירה מחדש (אופציונלי)
        await Field.deleteMany({});

        // הכנסת תחומים למסד הנתונים
        await Field.insertMany(fieldsData);

        console.log('Fields seeded successfully');
        return NextResponse.json({ message: 'Fields seeded successfully', success: true }, { status: 201 });

    } catch (error) {
        console.error('Error seeding fields:', error);
        return NextResponse.json({ message: 'Error seeding fields', success: false, error: error }, { status: 500 });

    }
}
