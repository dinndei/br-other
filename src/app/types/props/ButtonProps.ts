export interface ButtonProps {
    children: React.ReactNode; // טקסט או תוכן בתוך הכפתור
    onClick?: () => void; // פעולה שתתבצע בלחיצה
    type?: 'button' | 'submit' | 'reset'; // סוג הכפתור
    disabled?: boolean; // האם הכפתור מושבת
    className?: string; // מחלקות עיצוב נוספות
  }