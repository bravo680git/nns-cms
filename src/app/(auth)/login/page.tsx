"use client";

import { use, useState } from "react";
import { Button, Col, Form, Input, Layout, Row, Typography } from "antd";
import Image from "next/image";
import { authContext } from "@/context/authContext";
import LoginImg from "./assets/images/image.png";
import { authApi } from "@/service/api/auth";
import { useRouter } from "next/navigation";
import Card from "antd/es/card/Card";
import { colors } from "@/theme/constants";

function Login() {
    const [loginState, setLoginState] = use(authContext) ?? [];
    const { push } = useRouter();

    const [loading, setLoading] = useState(false);

    const handleLogin = (data: any) => {
        setLoading(true);
        authApi
            .login(data)
            .then((res) => {
                const token = res.data.access_token;
                const userInfo = res.data.user;
                localStorage.setItem("token", token);
                localStorage.setItem("user-info", JSON.stringify(userInfo));
                setLoginState?.({
                    isLoggedIn: true,
                    userInfo,
                });
                push("/");
            })
            .catch()
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Layout
            style={{
                height: "100vh",
                padding: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.border,
            }}
        >
            <Card
                style={{
                    width: "100%",
                    maxWidth: 1000,
                    backgroundColor: colors.bg,
                    height: "100%",
                    maxHeight: 600,
                }}
                bodyStyle={{
                    padding: 40,

                    height: "100%",
                }}
                bordered={false}
                type="inner"
            >
                <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{ height: "100%", width: "100%" }}
                >
                    <Col span={0} lg={14}>
                        <Image
                            width={260}
                            src={LoginImg}
                            alt="login-img"
                            style={{ margin: "0 auto", display: "block" }}
                        />
                    </Col>
                    <Col span={24} lg={10}>
                        <Typography.Title
                            level={2}
                            style={{ textAlign: "center" }}
                        >
                            Demo admin manager
                        </Typography.Title>
                        <Form
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ maxWidth: 500, margin: "0 auto" }}
                            onFinish={handleLogin}
                        >
                            <Form.Item
                                label="Email"
                                name="email"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    style={{ width: "100%" }}
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </Layout>
    );
}

export default Login;
