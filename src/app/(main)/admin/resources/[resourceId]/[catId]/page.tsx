"use client";

import { categoryApi } from "@/service/api/category";
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Popconfirm,
    Row,
    Select,
    Space,
    Typography,
    notification,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { RiDeleteBin4Line } from "react-icons/ri";
import { VALIDATE_OPTIONS } from "../constants";

type CategoryItem = {
    id: string;
    name: string;
    keys: {
        name: string;
        validates: {
            type: string;
            value: string;
        }[];
    }[];
};

function ResourceDetail() {
    const { resourceId, catId } = useParams();
    const { back } = useRouter();
    const [form] = Form.useForm();
    const [notificationApi, notificationHolder] =
        notification.useNotification();

    const [loading, setLoading] = useState(false);

    const isCreateMode = catId === "create";

    const fetchData = useCallback(() => {
        if (isCreateMode) {
            return;
        }
        categoryApi.getById(catId as string).then((res) => {
            const category = res.data.category;

            const data: CategoryItem = {
                id: category._id,
                name: category.name,
                keys: Object.keys(category.key ?? {}).map((key) => ({
                    name: key,
                    validates: Object.keys(category.key[key]).map((k) => ({
                        type: k,
                        value: category.key[key][k],
                    })),
                })),
            };
            form.setFieldsValue(data);
        });
    }, [catId, form, isCreateMode]);

    const handleSubmit = (data: CategoryItem) => {
        const payload: Parameters<typeof categoryApi.create>[0] = {
            name: data.name,
            page: resourceId as string,
            key: data.keys.reduce(
                (acc, crr) => ({
                    ...acc,
                    [crr.name]: crr.validates.reduce(
                        (_acc, _crr) => ({
                            ..._acc,
                            [_crr.type]:
                                _crr.type === "required" ? true : _crr.value,
                        }),
                        {}
                    ),
                }),
                {}
            ),
        };
        const api = isCreateMode
            ? () => categoryApi.create(payload)
            : () => categoryApi.edit(catId as string, payload);
        const msg = isCreateMode ? "Create" : "Edit";
        setLoading(true);
        api()
            .then(() => {
                back();
            })
            .catch(() => {
                notificationApi.error({
                    message: msg + " category fail",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div data-component="ResourceDetail">
            <Typography.Title level={3}>
                {isCreateMode ? "Create new category" : "Edit category"}
            </Typography.Title>
            <Form
                form={form}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                onFinish={handleSubmit}
            >
                <Row gutter={[16, 16]}>
                    <Col span={24} md={12}>
                        <Form.Item
                            name="name"
                            label="Category name"
                            rules={[{ required: true }]}
                            required
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.List name="keys" initialValue={[]}>
                    {(fields, { add, remove }) => (
                        <>
                            <Typography.Title level={4}>Keys</Typography.Title>

                            {fields.map(
                                ({ key, name, ...restField }, index) => {
                                    return (
                                        <Card
                                            key={key}
                                            title={`#${index + 1}`}
                                            extra={
                                                <Popconfirm
                                                    title="Do you want to delete this category?"
                                                    onConfirm={() =>
                                                        remove(name)
                                                    }
                                                >
                                                    <Button
                                                        icon={
                                                            <RiDeleteBin4Line />
                                                        }
                                                        danger
                                                    ></Button>
                                                </Popconfirm>
                                            }
                                            style={{ marginTop: 16 }}
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name, "name"]}
                                                label="Key name"
                                                required
                                                rules={[{ required: true }]}
                                            >
                                                <Input />
                                            </Form.Item>

                                            <Form.List
                                                name={[name, "validates"]}
                                                initialValue={[]}
                                            >
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        <Typography.Title
                                                            level={5}
                                                        >
                                                            Validate rules
                                                        </Typography.Title>

                                                        {fields.map(
                                                            ({
                                                                name: _name,
                                                                key: _key,
                                                                ..._restField
                                                            }) => (
                                                                <Space
                                                                    key={_key}
                                                                    align="start"
                                                                    style={{
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    <Form.Item
                                                                        name={[
                                                                            _name,
                                                                            "type",
                                                                        ]}
                                                                        {..._restField}
                                                                        initialValue={
                                                                            null
                                                                        }
                                                                    >
                                                                        <Select
                                                                            options={
                                                                                VALIDATE_OPTIONS
                                                                            }
                                                                            placeholder="Type"
                                                                            style={{
                                                                                minWidth: 120,
                                                                            }}
                                                                        />
                                                                    </Form.Item>
                                                                    <Form.Item
                                                                        name={[
                                                                            _name,
                                                                            "value",
                                                                        ]}
                                                                        {..._restField}
                                                                    >
                                                                        <Input placeholder="Value" />
                                                                    </Form.Item>
                                                                    <Button
                                                                        icon={
                                                                            <RiDeleteBin4Line />
                                                                        }
                                                                        onClick={() =>
                                                                            remove(
                                                                                _name
                                                                            )
                                                                        }
                                                                        danger
                                                                    ></Button>
                                                                </Space>
                                                            )
                                                        )}

                                                        <Button
                                                            icon={
                                                                <AiOutlinePlus />
                                                            }
                                                            onClick={() =>
                                                                add()
                                                            }
                                                        ></Button>
                                                    </>
                                                )}
                                            </Form.List>
                                        </Card>
                                    );
                                }
                            )}
                            <Form.Item>
                                <Button
                                    onClick={() => add()}
                                    type="dashed"
                                    style={{ marginTop: 16 }}
                                >
                                    Add
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Row justify={"end"}>
                    <Form.Item>
                        <Button
                            htmlType="submit"
                            type="primary"
                            size="large"
                            loading={loading}
                        >
                            {isCreateMode ? "Create" : "Edit"}
                        </Button>
                    </Form.Item>
                </Row>
            </Form>
            {notificationHolder}
        </div>
    );
}

export default ResourceDetail;
