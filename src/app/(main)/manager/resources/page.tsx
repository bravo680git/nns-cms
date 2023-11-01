"use client";

import {
    Button,
    Col,
    Input,
    Popconfirm,
    Row,
    Space,
    Table,
    Typography,
    notification,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { type ColumnsType } from "antd/es/table";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BsCheckLg } from "react-icons/bs";
import { GrFormClose } from "react-icons/gr";
import { managerCategoryApi } from "@/service/api/category";

type Item = Awaited<
    ReturnType<typeof managerCategoryApi.getList>
>["data"]["categories"][number];

function Resource() {
    const { push } = useRouter();
    const [notificationApi, notificationHolder] =
        notification.useNotification();

    const [data, setData] = useState<Item[]>();
    const [loading, setLoading] = useState(false);

    const columns: ColumnsType<Item> = [
        {
            key: "index",
            title: "No.",
            render(value, record, index) {
                return index + 1;
            },
        },
        {
            key: "name",
            dataIndex: "name",
            title: "Category name",
        },
        {
            key: "keys",
            dataIndex: "keys",
            title: "Category keys",
            render(value, record, index) {
                return Object.keys(record.key).join(", ");
            },
        },
        {
            key: "action",
            title: "Action",
            render(value, record, index) {
                return (
                    <Space>
                        <Button
                            icon={<HiOutlinePencilAlt />}
                            onClick={() =>
                                push(`/manager/resources/${record._id}`)
                            }
                        ></Button>
                    </Space>
                );
            },
        },
    ];

    const fetchData = useCallback(() => {
        managerCategoryApi
            .getList()
            .then((res) => {
                const categories = res.data.categories;
                setData(categories);
            })
            .catch();
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div data-component="Resource">
            <Typography.Title level={3}>Manage resources</Typography.Title>

            <Table columns={columns} dataSource={data} rowKey="_id" />
            {notificationHolder}
        </div>
    );
}

export default Resource;
