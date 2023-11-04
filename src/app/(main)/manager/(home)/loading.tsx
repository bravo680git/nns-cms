"use client";

import { Col, Row, Skeleton } from "antd";

function Loading() {
    return (
        <div data-component="Loading">
            <Skeleton active paragraph={{ rows: 0 }} />
            <Row wrap gutter={[16, 16]}>
                <Col flex="240px">
                    <Skeleton.Input active block style={{ height: 100 }} />
                </Col>
                <Col flex="240px">
                    <Skeleton.Input active block style={{ height: 100 }} />
                </Col>
            </Row>
            <Skeleton
                active
                paragraph={{ rows: 0 }}
                style={{ marginTop: 16 }}
            />
            <Row gutter={[16, 16]}>
                <Col span={24} lg={10}>
                    <Skeleton.Input active block style={{ height: 400 }} />
                </Col>
                <Col span={24} lg={14}>
                    <Skeleton.Input active block style={{ height: 400 }} />
                </Col>
            </Row>
        </div>
    );
}

export default Loading;
