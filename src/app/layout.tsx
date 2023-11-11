import type { Metadata } from "next";
import { ConfigProvider, App } from "antd";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "../../lib/AntdRegistry";
import { AuthProvider, NotificationProvider } from "@/context";
import { themeConfig } from "@/theme/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Demo Admin-manager",
    description: "Content admin page for nns-demo web",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <StyledComponentsRegistry>
                    <ConfigProvider theme={themeConfig}>
                        <AuthProvider publicRoutes={["/login"]}>
                            <NotificationProvider>
                                {children}
                            </NotificationProvider>
                        </AuthProvider>
                    </ConfigProvider>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
