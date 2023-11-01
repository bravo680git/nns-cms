"use client";
import { useContext } from "react";
import { redirect } from "next/navigation";
import { ROLES } from "./constants";
import { authContext } from "@/context/authContext";

function Home() {
    const [loginState] = useContext(authContext) ?? [];

    switch (loginState?.userInfo?.role) {
        case ROLES.admin:
            redirect("/admin");
        case ROLES.manager:
            redirect("/manager");

        default:
            redirect("/login");
    }
}

export default Home;
