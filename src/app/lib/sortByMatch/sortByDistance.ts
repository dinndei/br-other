import IUser from "@/app/types/IUser";

// Function to calculate the total gap
export const sortByDistance = (user: IUser, mentors: IUser[]): IUser[] => {
    const sortedMentors = mentors.sort((a, b) => {
        return religionLevelValues[b.religionLevel] - religionLevelValues[a.religionLevel];
    });
   return sortedMentors;
}

// Sort the array from largest to smallest religion level
const sortedPeople = people.sort((a, b) => {
    return religionLevelValues[b.religionLevel] - religionLevelValues[a.religionLevel];
});
