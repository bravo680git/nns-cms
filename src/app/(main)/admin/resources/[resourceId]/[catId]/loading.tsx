"use client";

import { Skeleton } from "antd";

function Loading() {
    return (
        <div data-component="Loading">
            <Skeleton active paragraph={{ rows: 0 }} />
            <Skeleton.Input active />
            <Skeleton.Input
                active
                block
                style={{ height: 240, marginTop: 16 }}
            />
            <Skeleton.Input
                active
                block
                style={{ height: 240, marginTop: 16 }}
            />
        </div>
    );
}

export default Loading;
