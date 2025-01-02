
export interface UserForResetStore {
    usernameForReset: string | null;
    setUsernameForReset: (usernameForReset: string | null) => void;
    emailForReset: string | null;
    setEmailForReset: (emailForReset: string | null) => void;

}