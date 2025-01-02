export enum ReligionLevel {
    Secular = "חילוני",
    Religious = "דתי",
    Orthodox = "חרדי",
    Other = "אחר"
}

// Map to numeric values
export const religionLevelValues: Record<ReligionLevel, number> = {
    [ReligionLevel.Secular]: 1,
    [ReligionLevel.Religious]: 2,
    [ReligionLevel.Orthodox]: 3,
    [ReligionLevel.Other]: 0, // ערך ברירת מחדל (או תוכלי להגדיר אותו איך שמתאים)
};