"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import {
    Button,
    Col,
    Input,
    Popconfirm,
    Row,
    Space,
    Table,
    Typography,
} from "antd";
import { type ColumnsType } from "antd/es/table";
import { BsCheckLg } from "react-icons/bs";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";

import { notificationContext } from "@/context";
import { categoryApi } from "@/service/api/category";
import { resourceApi } from "@/service/api/resource";

import Loading from "./loading";

type ResourceItem = {
    id: string;
    name: string;
    url: string;
    categories: {
        id: string;
        name: string;
        keys: string[];
    }[];
};

function ResourceDetail() {
    const { resourceId } = useParams();
    const { push } = useRouter();
    const notificationApi = useContext(notificationContext);

    const [data, setData] = useState<ResourceItem>();
    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(false);

    const columns: ColumnsType<ResourceItem["categories"][number]> = [
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
                return record.keys?.join(", ");
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
                                push(
                                    `/admin/resources/${resourceId}/${record.id}`
                                )
                            }
                        ></Button>
                        <Popconfirm
                            title="Do you want to delete this category?"
                            okType="danger"
                            onConfirm={() => handleDeleteCategory(record.id)}
                        >
                            <Button danger icon={<IoIosClose />}></Button>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const fetchData = useCallback(() => {
        Promise.all([
            resourceApi.getById(resourceId as string),
            categoryApi.getByPageId(resourceId as string),
        ])
            .then(([resourceRes, categoriesRes]) => {
                const resource = resourceRes.data.page;
                const categories = categoriesRes.data.categories;
                setData({
                    id: resource._id,
                    name: resource.name,
                    url: resource.url,
                    categories: categories.map((item) => ({
                        id: item._id,
                        name: item.name,
                        keys: Object.keys(item.key ?? {}),
                    })),
                });
            })
            .catch();
    }, [resourceId]);

    const handleEdit = () => {
        if (editable) {
            if (!data?.name) {
                notificationApi?.warning({ message: "Page name is required" });
                return;
            }
            if (!/^(http:\/\/)|(https:\/\/)/.test(data?.url ?? "")) {
                notificationApi?.warning({
                    message: "Input page url with correct format",
                });
                return;
            }
            setLoading(true);
            resourceApi
                .edit(resourceId as string, { name: data.name, url: data.url })
                .then(() => {
                    notificationApi?.success({
                        message: "Edit resource successfully",
                    });
                    setEditable(false);
                })
                .catch(() => {
                    notificationApi?.error({
                        message: "Edit resource fail",
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setEditable(true);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            await categoryApi.delete(id);
            notificationApi?.success({
                message: "Delete category successfully",
            });
            fetchData();
        } catch (error) {
            notificationApi?.error({
                message: "Delete category fail",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!data) {
        return <Loading />;
    }

    return (
        <div data-component="ResourceDetail">
            <Typography.Title level={3}>Resource detail</Typography.Title>
            <Row gutter={[20, 20]} align="bottom">
                <Col>
                    <Typography.Title level={5}>Page name</Typography.Title>
                    <Input
                        value={data?.name}
                        readOnly={!editable}
                        onChange={(e) =>
                            setData({
                                ...(data as ResourceItem),
                                name: e.target.value,
                            })
                        }
                    />
                </Col>
                <Col>
                    <Typography.Title level={5}>Page url</Typography.Title>
                    <Input
                        value={data?.url}
                        readOnly={!editable}
                        onChange={(e) =>
                            setData({
                                ...(data as ResourceItem),
                                url: e.target.value,
                            })
                        }
                    />
                </Col>
                <Col>
                    <Button
                        icon={editable ? <BsCheckLg /> : <HiOutlinePencilAlt />}
                        type={editable ? "primary" : "text"}
                        loading={loading}
                        onClick={handleEdit}
                    ></Button>
                </Col>
            </Row>
            <Row
                style={{ marginTop: 16, marginBottom: 16 }}
                align="middle"
                justify="space-between"
            >
                <Typography.Title level={5}>Page categories</Typography.Title>
                <Button
                    type="primary"
                    onClick={() =>
                        push(`/admin/resources/${resourceId}/create`)
                    }
                >
                    Create
                </Button>
            </Row>
            <Table
                columns={columns}
                dataSource={data?.categories}
                rowKey="id"
                scroll={{ x: "800px" }}
                sticky={{ offsetHeader: -16 }}
            />
        </div>
    );
}

export default ResourceDetail;
