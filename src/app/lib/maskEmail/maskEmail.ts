export const maskEmail = (email: string): string => {
    const [localPart, domain] = email.split('@'); // מפריד בין החלק שלפני ה-@ והחלק שאחרי
    const visiblePart = localPart.slice(0, 3); // שלושת התווים הראשונים
    const maskedPart = '*'.repeat(localPart.length - 3); // כוכביות במקום שאר התווים
    return `${visiblePart}${maskedPart}@${domain}`;
};