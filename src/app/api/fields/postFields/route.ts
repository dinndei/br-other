import { connectToDB } from "@/app/DB/connection/connectToDB";
import Field from "@/app/DB/models/FieldToDBModel";
import { NextResponse } from "next/server";

const fieldsData = [
    { mainField: "הוראה", subFields: ["מתמטיקה", "אנגלית", "היסטוריה", "פיזיקה", "כימיה", "ביולוגיה", "ספרות", "חינוך מיוחד", "הוראת שפות", "מתודולוגיות הוראה", "תכניות לימוד מותאמות אישית"] },
    { mainField: "הנדסה", subFields: ["הנדסת תוכנה", "הנדסת מכונות", "הנדסה אזרחית", "הנדסת חשמל", "הנדסת תעשייה וניהול", "הנדסה ביו-רפואית", "הנדסת חומרים", "הנדסת אנרגיה", "מערכות מידע", "הנדסת מערכות"] },
    { mainField: "רפואה", subFields: ["רפואה כללית", "אורתופדיה", "קרדיולוגיה", "רפואת ילדים", "גינקולוגיה", "נוירולוגיה", "רפואה פנימית", "רפואה דחופה", "כירורגיה", "רפואה משפחתית"] },
    { mainField: "טכנולוגיה", subFields: ["פיתוח אתרים", "אבטחת מידע", "בינה מלאכותית", "פיתוח אפליקציות", "מדעי הנתונים", "DevOps", "למידה עמוקה", "אינטרנט של הדברים (IoT)", "בלוקצ'יין", "עיבוד תמונה"] },
    { mainField: "משפטים", subFields: ["משפט פלילי", "משפט אזרחי", "דיני עבודה", "דיני משפחה", "זכויות אדם", "דיני חוזים", "קניין רוחני", "משפט מסחרי", "משפט בינלאומי", "גישור ובוררות"] },
    { mainField: "עסקים", subFields: ["שיווק דיגיטלי", "ניהול פרויקטים", "יזמות", "חשבונאות", "פיננסים", "מסחר אלקטרוני", "ייעוץ עסקי", "ניהול סיכונים", "ניהול מותגים", "ניהול משאבי אנוש"] },
    { mainField: "אמנות", subFields: ["ציור", "פיסול", "צילום", "אנימציה", "אומנות דיגיטלית", "עיצוב פנים", "עיצוב אופנה", "מוזיקה", "תיאטרון", "כתיבה יוצרת"] },
    { mainField: "ספורט", subFields: ["כדורגל", "כדורסל", "טניס", "שחייה", "ריצה", "יוגה", "כושר גופני", "פילאטיס", "קרוספיט", "אגרוף"] },
    { mainField: "מדעי החברה", subFields: ["פסיכולוגיה", "סוציולוגיה", "מדעי המדינה", "תקשורת", "קרימינולוגיה", "כלכלה", "גיאוגרפיה", "יחסים בינלאומיים", "לימודי מגדר", "אנתרופולוגיה"] },
    { mainField: "מדעי הטבע", subFields: ["כימיה", "פיזיקה", "ביולוגיה", "גיאולוגיה", "מטאורולוגיה", "מדעי הים", "אקולוגיה", "זואולוגיה", "בוטניקה", "אסטרונומיה"] },
    { mainField: "חינוך", subFields: ["חינוך מיוחד", "ניהול מערכות חינוך", "יועצות חינוכיות", "חינוך בלתי פורמלי", "טיפול באומנות", "פסיכולוגיה חינוכית", "פיתוח תכניות לימוד", "הוראת ילדים מחוננים", "הוראת מבוגרים", "חינוך סביבתי"] },
    { mainField: "ספרות ושפות", subFields: ["עברית", "אנגלית", "ערבית", "רוסית", "ספרדית", "צרפתית", "סינית", "יפנית", "גרמנית", "איטלקית"] },
    { mainField: "קולינריה", subFields: ["בישול מקצועי", "אפייה", "קונדיטוריה", "מטבח אסייתי", "מטבח ים תיכוני", "מטבח טבעוני", "שוקולד", "יין וסומליה", "עיצוב מנות", "בישול גורמה"] },
    { mainField: "תרבות ופנאי", subFields: ["תיירות", "הפקת אירועים", "צילום חובבני", "קולנוע", "אסטרונומיה חובבנית", "תחביבים יצירתיים", "טיולים", "ספרים וספרות", "משחקי קופסה", "גינון"] },
    { mainField: "מדעי המחשב", subFields: ["תכנות", "מבני נתונים ואלגוריתמים", "למידת מכונה", "מערכות הפעלה", "רשתות מחשבים", "סייבר", "בסיסי נתונים", "אבטחת אפליקציות", "ניהול מערכות מידע", "תכנות מתקדם"] },
];

export async function POST() {
    try {
        await connectToDB();

        const newFields = [];

        for (const field of fieldsData) {
            // בדיקה אם הרשומה כבר קיימת לפי mainField
            const existingField = await Field.findOne({ mainField: field.mainField });

            if (existingField) {
                // הוספת subFields חדשים אם הם לא קיימים
                const newSubFields = field.subFields.filter(subField => !existingField.subFields.includes(subField));
                if (newSubFields.length > 0) {
                    existingField.subFields.push(...newSubFields);
                    await existingField.save();
                    console.log(`Updated field: ${field.mainField} with new subFields.`);
                }
            } else {
                // יצירת רשומה חדשה
                newFields.push(field);
            }
        }

        // הוספת רשומות חדשות
        if (newFields.length > 0) {
            await Field.insertMany(newFields);
            console.log(`Added new fields: ${newFields.map(f => f.mainField).join(", ")}`);
        }

        return NextResponse.json({ message: 'Fields updated successfully', success: true }, { status: 201 });

    } catch (error) {
        console.error('Error updating fields:', error);
        return NextResponse.json({ message: 'Error updating fields', success: false, error: error }, { status: 500 });
    }
}
