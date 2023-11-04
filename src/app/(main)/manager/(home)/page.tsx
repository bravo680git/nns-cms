"use client";

import { useState, useEffect } from "react";
import ApexChart, { type Props } from "react-apexcharts";
import { Col, Row, Typography } from "antd";
import { BiCategoryAlt } from "react-icons/bi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { resourceApi } from "@/service/api/resource";
import Loading from "./loading";
import { colors } from "@/theme/constants";

type DashboardData = Awaited<
    ReturnType<typeof resourceApi.getManagerDashboard>
>["data"];

function Home() {
    const [data, setData] = useState<DashboardData>();

    const options: Props["options"] = {
        labels: Object.keys(data?.contents ?? {}),
        plotOptions: {
            bar: {
                columnWidth: "40%",
                borderRadius: 4,
            },
            polarArea: {
                rings: {
                    strokeWidth: 0,
                },
                spokes: {
                    strokeWidth: 0,
                },
            },
        },
        legend: {
            position: "bottom",
        },
        grid: {
            strokeDashArray: 4,
            borderColor: colors["second-txt"],
        },
    };

    const series: Props["series"] = [
        {
            data: Object.values(data?.contents ?? {}),
            color: "#00f1ff",
            name: "Number of contents",
        },
    ];

    useEffect(() => {
        resourceApi
            .getManagerDashboard()
            .then((res) => {
                setData(res.data);
            })
            .catch(() => {
                setData({} as DashboardData);
            });
    }, []);

    if (!data) {
        return <Loading />;
    }

    return (
        <div data-component="Home">
            <Typography.Title style={{ marginBottom: 32 }} level={2}>
                Dashboard
            </Typography.Title>
            <Row gutter={[16, 16]}>
                <Col>
                    <div
                        style={{
                            width: 280,
                            height: 100,
                            borderRadius: 8,
                            background:
                                "linear-gradient( 135deg, #ABDCFFEE 10%, #0396FFEE 100%)",
                            padding: 16,
                            display: "flex",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 20,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                fontWeight: 600,
                            }}
                        >
                            <span style={{ fontSize: 32 }}>
                                {data.categories}
                            </span>
                            <span>Categories</span>
                        </div>
                        <span
                            style={{
                                fontSize: 60,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flex: 1,
                            }}
                        >
                            <BiCategoryAlt />
                        </span>
                    </div>
                </Col>
                <Col>
                    <div
                        style={{
                            width: 280,
                            height: 100,
                            borderRadius: 8,
                            background:
                                "linear-gradient( 135deg, #EE9AE5EE 10%, #5961F9EE 100%)",
                            padding: 16,
                            display: "flex",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 20,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                fontWeight: 600,
                            }}
                        >
                            <span style={{ fontSize: 32 }}>
                                {data.total_content}
                            </span>
                            <span>Content items</span>
                        </div>
                        <span
                            style={{
                                fontSize: 60,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flex: 1,
                            }}
                        >
                            <HiOutlineDocumentText />
                        </span>
                    </div>
                </Col>
            </Row>
            <Typography.Title level={4} style={{ marginTop: 24 }}>
                Number of contents
            </Typography.Title>
            <Row gutter={[16, 16]} align="middle">
                <Col span={24} lg={10}>
                    <ApexChart
                        type="polarArea"
                        options={options}
                        series={series[0]?.data as number[]}
                        height={400}
                    />
                </Col>
                <Col span={24} lg={14} style={{ overflowX: "scroll" }}>
                    <div style={{ width: "100%", minWidth: "600px" }}>
                        <ApexChart
                            type="bar"
                            options={options}
                            series={series}
                            height={400}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Home;
