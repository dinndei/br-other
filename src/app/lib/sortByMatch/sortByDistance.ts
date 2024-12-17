import IUser from "@/app/types/IUser";
import { calculatePoliticGap, calculateReligionGap } from "./calculateGaps";

// Function to calculate the total gap
export const sortByDistance = (user: IUser, mentors: IUser[]): IUser[] => {
    const mentorGaps = mentors.map(mentor => ({
        mentor,
        dist: calculatePoliticGap(
            user.typeUser.politicalAffiliation,
            mentor.typeUser.politicalAffiliation
        ) + calculateReligionGap(
            user.typeUser.religionLevel,
            mentor.typeUser.religionLevel
        ),
    }));

    // Sort mentors by distance
    mentorGaps.sort((a, b) => a.dist - b.dist);

    // Return sorted mentors
    return mentorGaps.map(item => item.mentor);
}
