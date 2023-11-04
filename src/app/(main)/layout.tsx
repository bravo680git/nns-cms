"use client";

import { authContext } from "@/context";
import { resourceApi } from "@/service/api/resource";
import { colors, utils } from "@/theme/constants";
import {
    Avatar,
    Button,
    Card,
    Layout,
    Menu,
    MenuProps,
    Space,
    Typography,
} from "antd";
import Dropdown from "antd/es/dropdown/dropdown";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { BsChevronBarLeft } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { MdDomain } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { ROLES } from "../constants";
import Link from "next/link";

function AppLayout({ children }: { children: React.ReactNode }) {
    const { push } = useRouter();
    const path = usePathname();
    const [loginState, setLoginState] = useContext(authContext) ?? [];
    const [isExpand, setIsExpand] = useState(true);
    const [isBreak, setIsBreak] = useState(false);
    const [pageInfo, setPageInfo] =
        useState<
            Awaited<
                ReturnType<typeof resourceApi.getByManagerToken>
            >["data"]["page"]
        >();

    const rolePath = loginState?.userInfo?.role
        ? `/${loginState.userInfo.role}`
        : "";

    const sidebarItems: MenuProps["items"] = [
        {
            key: `${rolePath}`,
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
        setIsExpand(false);
    };

    const handleLogout = () => {
        setLoginState && setLoginState({ isLoggedIn: false });
        push("/login");
    };

    const handleBreakpoint = (_isBreak: boolean) => {
        setIsExpand(!_isBreak);
        setIsBreak(_isBreak);
    };

    useEffect(() => {
        if (loginState?.userInfo?.role === "manager") {
            resourceApi
                .getByManagerToken()
                .then((res) => {
                    setPageInfo(res.data.page);
                })
                .catch();
        }
    }, [loginState?.userInfo?.role]);

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
                collapsedWidth={isBreak ? 0 : 80}
                breakpoint="md"
                onBreakpoint={handleBreakpoint}
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
                {pageInfo && isExpand && (
                    <div style={{ padding: "0 16px", textAlign: "center" }}>
                        <Typography.Title level={3}>
                            {pageInfo.name}
                        </Typography.Title>
                        <Typography.Link href={pageInfo.url}>
                            {pageInfo.url}
                        </Typography.Link>
                    </div>
                )}
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
                        justifyContent: "flex-end",
                    }}
                >
                    <Space size={16} style={{ marginRight: "auto" }}>
                        {isBreak && !isExpand && (
                            <Button
                                icon={<AiOutlineMenuUnfold />}
                                onClick={() => setIsExpand(!isExpand)}
                            ></Button>
                        )}
                        {pageInfo && !isExpand && (
                            <Link href={pageInfo.url}>
                                <Typography.Title
                                    level={3}
                                    style={{
                                        marginBottom: 0,
                                        textDecoration: "underline",
                                        color: colors.primary,
                                    }}
                                >
                                    {pageInfo.name}
                                </Typography.Title>
                            </Link>
                        )}
                    </Space>

                    <Dropdown
                        trigger={["click"]}
                        dropdownRender={() => (
                            <Card bodyStyle={{ padding: 12 }}>
                                <Typography.Title
                                    level={4}
                                    style={{ marginBottom: 0 }}
                                >
                                    {loginState?.userInfo?.name}
                                </Typography.Title>
                                <Typography.Text
                                    style={{ color: colors["second-txt"] }}
                                >
                                    {loginState?.userInfo?.email}
                                </Typography.Text>
                                <Button
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        marginTop: 10,
                                    }}
                                    icon={<BiLogOut />}
                                    type="text"
                                    size="large"
                                    danger
                                    onClick={handleLogout}
                                >
                                    Log out
                                </Button>
                            </Card>
                        )}
                    >
                        <Avatar
                            src={loginState?.userInfo?.avatar}
                            alt="user avatar"
                            style={{ cursor: "pointer" }}
                        ></Avatar>
                    </Dropdown>
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
