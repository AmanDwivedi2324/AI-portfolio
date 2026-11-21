import { createContext } from "react";

/** { user, status: "checking" | "signedIn" | "signedOut", signIn, signOut, updateSession } */
export const AuthContext = createContext(null);
