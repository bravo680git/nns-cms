"use client";

import { Col, Row, Skeleton } from "antd";

function Loading() {
    return (
        <div>
            <Row justify="end">
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
