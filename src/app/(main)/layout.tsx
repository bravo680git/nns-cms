"use client";

import React, { useState, useContext } from "react";
import { Button, Layout, Menu, MenuProps } from "antd";
import { RxDashboard } from "react-icons/rx";
import { FiUsers } from "react-icons/fi";
import { MdDomain } from "react-icons/md";
import { BsChevronBarLeft } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { colors, utils } from "@/theme/constants";
import { usePathname, useRouter } from "next/navigation";
import { authContext } from "@/context/authContext";
import { ROLES } from "../constants";

function AppLayout({ children }: { children: React.ReactNode }) {
    const { push } = useRouter();
    const path = usePathname();
    const [loginState, setLoginState] = useContext(authContext) ?? [];
    const [isExpand, setIsExpand] = useState(true);

    const rolePath = loginState?.userInfo?.role
        ? `/${loginState.userInfo.role}`
        : "";

    const sidebarItems: MenuProps["items"] = [
        {
            key: `${rolePath}/`,
            label: "Dashboard",
            icon: <RxDashboard />,
        },
        {
            key: `${rolePath}/resources`,
            label: "Resources",
            icon: <MdDomain />,
        },
    ];

    if (loginState?.userInfo?.role === ROLES.admin) {
        sidebarItems.push({
            key: "/admin/users",
            label: "Users",
            icon: <FiUsers />,
        });
    }

    const handleNavigate: MenuProps["onClick"] = (e) => {
        push(e.key);
    };

    const handleLogout = () => {
        setLoginState && setLoginState({ isLoggedIn: false });
        push("/login");
    };

    return (
        <Layout style={{ height: "100vh" }}>
            <Layout.Sider
                style={{
                    backgroundColor: colors.bg,
                    borderRight: utils.border,
                    position: "relative",
                }}
                width={280}
                collapsible
                trigger={null}
                collapsed={!isExpand}
                collapsedWidth={80}
            >
                <div
                    style={{
                        width: "calc(100% - 32px)",
                        aspectRatio: 1,
                        backgroundColor: "#ccc",
                        borderRadius: 8,
                        margin: "16px",
                    }}
                ></div>
                <Menu
                    items={sidebarItems}
                    mode="inline"
                    style={{ padding: "0 16px" }}
                    onClick={handleNavigate}
                    selectedKeys={[path]}
                />
                <Button
                    icon={<BsChevronBarLeft />}
                    type="text"
                    style={{
                        position: "absolute",
                        bottom: 16,
                        right: 20,
                        transform: !isExpand ? "rotateY(180deg)" : "",
                        transition: "all 0.5s",
                    }}
                    size="large"
                    onClick={() => setIsExpand(!isExpand)}
                ></Button>
            </Layout.Sider>
            <Layout>
                <Layout.Header
                    style={{
                        backgroundColor: colors.bg,
                        borderBottom: utils.border,
                        height: 56,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 16px",
                    }}
                >
                    <Button
                        style={{ marginLeft: "auto" }}
                        icon={<BiLogOut />}
                        type="text"
                        size="large"
                        danger
                        onClick={handleLogout}
                    ></Button>
                </Layout.Header>
                <Layout.Content
                    style={{
                        padding: 16,
                        height: `calc(100vh - 56px)`,
                        overflowY: "scroll",
                    }}
                >
                    {children}
                </Layout.Content>
            </Layout>
        </Layout>
    );
}

export default AppLayout;
