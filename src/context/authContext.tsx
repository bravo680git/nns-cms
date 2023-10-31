"use client";

import { usePathname, useRouter } from "next/navigation";
import React, {
    type Dispatch,
    type SetStateAction,
    useState,
    useEffect,
} from "react";
import { createContext } from "react";

type LoginState = {
    isLoggedIn: boolean;
    userInfo?: {
        name: string;
        avatar: string;
        email: string;
    };
};

const authContext = createContext<
    [LoginState, Dispatch<SetStateAction<LoginState>>] | undefined
>(undefined);
const ContextProvider = authContext.Provider;

function AuthProvider({
    children,
    publicRoutes,
}: {
    children: React.ReactNode;
    publicRoutes: string[];
}) {
    const path = usePathname();
    const { push } = useRouter();

    const [loginState, setLoginState] = useState<LoginState>({
        isLoggedIn: true,
    });

    useEffect(() => {
        if (!loginState.isLoggedIn) {
            push("/login");
        }
    }, [loginState.isLoggedIn, push]);

    return (
        <ContextProvider value={[loginState, setLoginState]}>
            {publicRoutes.includes(path) || loginState.isLoggedIn
                ? children
                : null}
        </ContextProvider>
    );
}

export { authContext, AuthProvider };
