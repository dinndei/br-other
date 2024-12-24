import { PoliticalAffiliation, politicalAffiliationValues } from "@/app/types/enums/politicalAffiliation";
import { ReligionLevel, religionLevelValues } from "@/app/types/enums/ReligionLevel";

// Function to calculate the political gap
export const calculatePoliticGap = (
    affiliation1: PoliticalAffiliation,
    affiliation2: PoliticalAffiliation
): number => {
    return Math.abs(
        politicalAffiliationValues[affiliation1] -
        politicalAffiliationValues[affiliation2]
    );
}

// Function to calculate the political gap
export const calculateReligionGap = (
    religion1: ReligionLevel,
    religion2: ReligionLevel
): number => {
    return Math.abs(
        religionLevelValues[religion1] -
        religionLevelValues[religion2]
    );
}


