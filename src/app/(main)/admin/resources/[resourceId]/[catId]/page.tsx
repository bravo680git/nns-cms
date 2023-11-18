"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { RiDeleteBin4Line } from "react-icons/ri";
import {
    Button,
    Card,
    Col,
    Form,
    FormListFieldData,
    Input,
    Popconfirm,
    Row,
    Select,
    Space,
    Typography,
} from "antd";

import { notificationContext } from "@/context";
import { categoryApi } from "@/service/api/category";
import { VALIDATE_OPTIONS, FIELD_TYPES } from "../constants";
import Loading from "./loading";

type CategoryItem = {
    id: string;
    name: string;

    keys: {
        name: string;
        validates: {
            type: string;
            value: string;
        }[];
        type: string;
    }[];
};

function ResourceDetail() {
    const { resourceId, catId } = useParams();
    const { back } = useRouter();
    const [form] = Form.useForm();
    const notificationApi = useContext(notificationContext);

    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const isCreateMode = catId === "create";

    const fetchData = useCallback(() => {
        if (isCreateMode) {
            return;
        }
        setIsFetching(true);
        categoryApi
            .getById(catId as string)
            .then((res) => {
                const category = res.data.category;

                const data: CategoryItem = {
                    id: category._id,
                    name: category.name,
                    keys: Object.keys(category.key ?? {}).map((key) => {
                        const validates: CategoryItem["keys"][number]["validates"] =
                            [];
                        Object.keys(category.key[key]).forEach((v) => {
                            if (v !== "type") {
                                validates.push({
                                    type: v,
                                    value: category.key[key][v],
                                });
                            }
                        });
                        return {
                            name: key,
                            validates,
                            type: category.key?.[key]?.type ?? "text",
                        };
                    }),
                };
                form.setFieldsValue(data);
            })
            .catch()
            .finally(() => {
                setIsFetching(false);
            });
    }, [catId, form, isCreateMode]);

    const handleSubmit = (data: CategoryItem) => {
        const payload: Parameters<typeof categoryApi.create>[0] = {
            name: data.name,
            page: resourceId as string,
            key: data.keys.reduce(
                (acc, crr) => ({
                    ...acc,
                    [crr.name]: [
                        ...crr.validates,
                        { type: "type", value: crr.type },
                    ].reduce(
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
                notificationApi?.success({
                    message: msg + " category successfully",
                });
                back();
            })
            .catch(() => {
                notificationApi?.error({
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

    if (isFetching) {
        return <Loading />;
    }

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
                                        <KeyFormItem
                                            index={index}
                                            name={name}
                                            key={key}
                                            remove={remove}
                                            restField={restField}
                                        />
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
        </div>
    );
}

type KeyFormItemProps = {
    index: number;
    name: number;
    restField: any;
    remove: (name: number) => void;
};

function KeyFormItem({ name, index, restField, remove }: KeyFormItemProps) {
    return (
        <Card
            title={`#${index + 1}`}
            extra={
                <Popconfirm
                    title="Do you want to delete this category?"
                    onConfirm={() => remove(name)}
                    okType="danger"
                >
                    <Button icon={<RiDeleteBin4Line />} danger></Button>
                </Popconfirm>
            }
            style={{ marginTop: 16 }}
        >
            <Row gutter={[16, 16]}>
                <Col span={24} md={12}>
                    <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        label="Key name"
                        required
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={24} md={12}>
                    <Form.Item
                        {...restField}
                        name={[name, "type"]}
                        label="Type"
                        initialValue="text"
                    >
                        <Select placeholder="Text" options={FIELD_TYPES} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.List name={[name, "validates"]} initialValue={[]}>
                {(fields, { add, remove }) => (
                    <KeyValidatesFormItem
                        fields={fields}
                        add={add}
                        remove={remove}
                    />
                )}
            </Form.List>
        </Card>
    );
}

type KeyValidatesFormItemProps = {
    fields: FormListFieldData[];
    remove: (name: number) => void;
    add: () => void;
};

function KeyValidatesFormItem({
    fields,
    add,
    remove,
}: KeyValidatesFormItemProps) {
    return (
        <>
            <Typography.Title level={5}>Validate rules</Typography.Title>

            {fields.map(({ name, key, ..._restField }) => (
                <Space
                    key={key}
                    align="start"
                    style={{
                        width: "100%",
                    }}
                >
                    <Form.Item
                        name={[name, "type"]}
                        {..._restField}
                        initialValue={null}
                    >
                        <Select
                            options={VALIDATE_OPTIONS}
                            placeholder="Type"
                            style={{
                                minWidth: 120,
                            }}
                        />
                    </Form.Item>
                    <Form.Item name={[name, "value"]} {..._restField}>
                        <Input placeholder="Value" />
                    </Form.Item>
                    <Button
                        icon={<RiDeleteBin4Line />}
                        onClick={() => remove(name)}
                        danger
                    ></Button>
                </Space>
            ))}

            <Button icon={<AiOutlinePlus />} onClick={() => add()}></Button>
        </>
    );
}

export default ResourceDetail;
