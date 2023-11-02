"use client";

import { Col, Row, Skeleton } from "antd";

function Loading() {
    return (
        <div>
            <Skeleton active paragraph={{ rows: 0 }} />
            <Row gutter={16} justify="start" align="bottom">
                <Col span={6}>
                    <Skeleton active paragraph={{ rows: 0 }} />
                    <Skeleton.Input block active />
                </Col>
                <Col span={6}>
                    <Skeleton active paragraph={{ rows: 0 }} />
                    <Skeleton.Input block active />
                </Col>
                <Col>
                    <Skeleton.Avatar
                        active
                        style={{ borderRadius: 4 }}
                        shape="square"
                    />
                </Col>
            </Row>
            <Row justify="end" style={{ marginTop: 16 }}>
                <Skeleton.Button active />
            </Row>
            <Skeleton.Input
                style={{ height: "50vh", marginTop: 16 }}
                active
                block
            />
            <Row style={{ marginTop: 16 }} gutter={8} justify="end">
                <Col>
                    <Skeleton.Avatar
                        active
                        style={{ borderRadius: 4 }}
                        shape="square"
                    />
                </Col>
                <Col>
                    <Skeleton.Avatar
                        active
                        style={{ borderRadius: 4 }}
                        shape="square"
                    />
                </Col>
                <Col>
                    <Skeleton.Avatar
                        active
                        style={{ borderRadius: 4 }}
                        shape="square"
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Loading;
