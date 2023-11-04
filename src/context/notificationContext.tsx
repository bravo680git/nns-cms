"use client";

import React, { createContext } from "react";
import { notification } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";

const notificationContext = createContext<NotificationInstance | undefined>(
    undefined
);

function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notificationApi, notificationContextHolder] =
        notification.useNotification();

    return (
        <>
            <notificationContext.Provider value={notificationApi}>
                {children}
            </notificationContext.Provider>
            {notificationContextHolder}
        </>
    );
}

export { notificationContext, NotificationProvider };
