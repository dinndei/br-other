export enum PoliticalAffiliation {
    HardRight = "HardRight",
    Right = "Right",
    CenterRight = "CenterRight",
    CenterLeft = "CenterLeft",
    Left = "Left",
    HardLeft = "HardLeft"
}


// Map to numeric values
export const politicalAffiliationValues: Record<PoliticalAffiliation, number> = {
    [PoliticalAffiliation.HardRight]: 1,
    [PoliticalAffiliation.Right]: 2,
    [PoliticalAffiliation.CenterRight]: 3,
    [PoliticalAffiliation.CenterLeft]: 4,
    [PoliticalAffiliation.Left]: 5,
    [PoliticalAffiliation.HardLeft]: 6,
};

// Function to calculate the gap
function calculateGap(
    affiliation1: PoliticalAffiliation,
    affiliation2: PoliticalAffiliation
): number {
    return Math.abs(
        politicalAffiliationValues[affiliation1] -
        politicalAffiliationValues[affiliation2]
    );
}

// Example usage
const gap = calculateGap(PoliticalAffiliation.HardRight, PoliticalAffiliation.HardLeft);
console.log("Gap:", gap); // Output: Gap: 5