export function generateSafeFileName(originalName: string): string {
  // הסרת תווים מיוחדים
  const sanitized = originalName
    .normalize('NFD') // נרמול כדי להפריד תווים דיאקריטיים
    .replace(/[\u0300-\u036f]/g, '') // הסרת דיאקריטיים
    .replace(/[^a-zA-Z0-9]/g, '_'); // שמירה על אותיות, ספרות וקו תחתון בלבד

  // הוספת חותמת זמן לייחודיות
  const timestamp = Date.now();

  // יצירת שם קובץ בטוח
  return `${sanitized}_${timestamp}`;
}