"use client";

import { use, useState } from "react";
import { Button, Col, Form, Input, Layout, Row, Typography } from "antd";
import Image from "next/image";
import { authContext } from "@/context/authContext";
import LoginImg from "./assets/images/login-img.jpg";
import { authApi } from "@/service/api/auth";
import { useRouter } from "next/navigation";

function Login() {
    const [loginState, setLoginState] = use(authContext) ?? [];
    const { push } = useRouter();

    const [loading, setLoading] = useState(false);

    const handleLogin = (data: any) => {
        setLoading(true);
        authApi
            .login(data)
            .then((res) => {
                const token = res.data.token;
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
        <Layout style={{ height: "100vh", padding: 20 }}>
            <Row gutter={[16, 16]} align="middle" style={{ height: "100%" }}>
                <Col
                    span={0}
                    lg={14}
                    style={{ display: "flex", justifyContent: "center" }}
                >
                    <Image width={600} src={LoginImg} alt="login-img" />
                </Col>
                <Col span={24} lg={10}>
                    <Typography.Title level={2} style={{ textAlign: "center" }}>
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
        </Layout>
    );
}

export default Login;
