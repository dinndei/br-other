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

