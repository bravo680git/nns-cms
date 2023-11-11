"use client";

import {
    Button,
    Card,
    Dropdown,
    Form,
    Image,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tooltip,
    Typography,
    Upload,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BsUpload } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";

import { notificationContext } from "@/context";
import { managerCategoryApi } from "@/service/api/category";
import Loading from "./loading";
import UploadImage from "@/app/(main)/manager/components/UploadImage";
import { imageApi } from "@/service/api/image";

const toCapitalize = (input = "") => {
    return input[0].toUpperCase() + input.slice(1);
};

type Category = Awaited<
    ReturnType<typeof managerCategoryApi.getById>
>["data"]["category"];
type Image = Awaited<
    ReturnType<typeof imageApi.getList>
>["data"]["images"][number];

function Category() {
    const { id } = useParams();
    const notificationApi = useContext(notificationContext);
    const [form] = Form.useForm();

    const editRowIndex = useRef<number | undefined>(undefined);
    const formInitData = useRef<Record<string, any>>();
    const [data, setData] = useState<Category>();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageList, setImageList] = useState<Image[]>([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const columns: ColumnsType<any> = [
        {
            key: "index",
            title: "No.",
            dataIndex: "index",
            width: 60,
        },
    ];
    columns.push(
        ...Object.keys(data?.key ?? {}).map((key) => ({
            key,
            dataIndex: key,
            title: toCapitalize(key),
            render(value: string) {
                const regex = /^http/;
                if (!value) {
                    return "---";
                }
                if (regex.test(value)) {
                    const returnText = value?.slice(0, 30);
                    return (
                        <a href={value} target="_blank">
                            {returnText?.length > 30
                                ? returnText + "..."
                                : returnText}
                        </a>
                    );
                }
                if (value?.length > 30) {
                    return (
                        <Tooltip title={value}>
                            {value?.slice(0, 30)}...
                        </Tooltip>
                    );
                }
                return value;
            },
        })),
        {
            key: "action",
            title: "Action",
            render(value, record, index) {
                return (
                    <Space>
                        <Button
                            onClick={() => handleShowModal(index)}
                            icon={<HiOutlinePencilAlt />}
                        ></Button>
                        <Popconfirm
                            title="Do you want to delete this record?"
                            onConfirm={() => handleDelete(index)}
                            okType="danger"
                        >
                            <Button danger icon={<IoIosClose />}></Button>
                        </Popconfirm>
                    </Space>
                );
            },
            width: 100,
        }
    );

    const fetchData = useCallback(() => {
        managerCategoryApi
            .getById(id as string)
            .then((res) => {
                const category = res.data.category;
                setData({
                    ...category,
                    value: category.value?.map((item, index) => ({
                        ...item,
                        index: index + 1,
                    })),
                });
            })
            .catch();
    }, [id]);

    const handleShowModal = (editIndex?: number) => {
        editRowIndex.current = editIndex;
        formInitData.current = data?.value.find((_, i) => i === editIndex);
        setShowModal(true);
    };

    const handleDelete = async (index: number) => {
        const values = data?.value ?? [];
        const postData = { value: values.filter((_, i) => i !== index) };

        await managerCategoryApi
            .edit(id as string, postData)
            .then((res) => {
                setShowModal(false);
                notificationApi?.success({
                    message: "Delete record successfully",
                });
                fetchData();
            })
            .catch((err) => {
                notificationApi?.error({ message: "Delete record fail" });
            })
            .finally(() => setLoading(false));
    };

    const handleSubmit = (formData: Record<string, any>) => {
        const values = data?.value ?? [];
        if (editRowIndex.current !== undefined) {
            values[editRowIndex.current] = formData;
        } else {
            values.push(formData);
        }
        const postData = { value: values };

        const label =
            editRowIndex.current !== undefined ? "Edit" : "Create new";

        setLoading(true);
        managerCategoryApi
            .edit(id as string, postData)
            .then((res) => {
                setShowModal(false);
                notificationApi?.success({
                    message: label + " record successfully",
                });
                fetchData();
            })
            .catch((err) => {
                notificationApi?.error({ message: label + " record fail" });
            })
            .finally(() => setLoading(false));
    };

    const handleUpload = (fieldName: string, image: File, name?: string) => {
        setUploadLoading(true);
        imageApi
            .upload({ image, name })
            .then((res) => {
                setImageList([...imageList, res.data]);
                form.setFieldValue(fieldName, res.data.url);
                notificationApi?.success({
                    message: "Upload image successfully",
                });
                setShowUploadModal(false);
            })
            .catch(() => {
                notificationApi?.error({ message: "Upload image fail" });
            })
            .finally(() => {
                setUploadLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
        imageApi
            .getList()
            .then((res) => {
                setImageList(res.data.images);
            })
            .catch();
    }, [fetchData]);

    if (!data) {
        return <Loading />;
    }

    return (
        <div data-component="Category">
            <Typography.Title level={3}>{data?.name}</Typography.Title>
            <Row justify="end" style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => handleShowModal()}>
                    Create
                </Button>
            </Row>
            <Table
                columns={columns}
                dataSource={data?.value}
                rowKey="index"
                scroll={{ x: "1000px", y: "calc(100vh - 280px)" }}
            />
            <Modal
                open={showModal}
                title={
                    editRowIndex.current !== undefined
                        ? "Edit content"
                        : "Create new content"
                }
                onCancel={() => {
                    setShowModal(false);
                    form.resetFields();
                }}
                okText="Submit"
                okButtonProps={{ form: "form", htmlType: "submit", loading }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    id="form"
                    initialValues={formInitData.current}
                    onFinish={handleSubmit}
                >
                    {Object.keys(data?.key ?? {}).map((key) => {
                        const validateObj = data?.key[key] ?? {};
                        const validateRules: any[] = [];
                        Object.keys(validateObj ?? {}).forEach((v) => {
                            if (v !== "type") {
                                validateRules.push({
                                    [v]:
                                        Number(validateObj[v]) ||
                                        validateObj[v],
                                });
                            }
                        });

                        return (
                            <div
                                key={key}
                                style={{
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "end",
                                    marginBottom: 16,
                                }}
                            >
                                <Form.Item
                                    label={toCapitalize(key)}
                                    name={key}
                                    rules={validateRules}
                                    style={{
                                        flex: 1,
                                        marginBottom: 0,
                                        maxWidth: 430,
                                    }}
                                >
                                    {validateObj.type === "image" ? (
                                        <Select
                                            options={imageList}
                                            fieldNames={{
                                                value: "url",
                                                label: "name",
                                            }}
                                            optionRender={(item) => (
                                                <Space
                                                    size={8}
                                                    style={{
                                                        display: "flex",
                                                        marginTop: 8,
                                                    }}
                                                >
                                                    <Image
                                                        src={item.data.url}
                                                        alt="img"
                                                        width={24}
                                                    />
                                                    <Typography.Text>
                                                        {item.data.name}
                                                    </Typography.Text>
                                                </Space>
                                            )}
                                        />
                                    ) : (
                                        <Input />
                                    )}
                                </Form.Item>
                                {validateObj.type === "image" && (
                                    <Dropdown
                                        open={showUploadModal}
                                        trigger={["click"]}
                                        dropdownRender={() => (
                                            <UploadImage
                                                onOk={(file, name) =>
                                                    handleUpload(
                                                        key,
                                                        file,
                                                        name
                                                    )
                                                }
                                                onCancel={() =>
                                                    setShowUploadModal(false)
                                                }
                                                loading={uploadLoading}
                                            />
                                        )}
                                        onOpenChange={(open) =>
                                            setShowUploadModal(open)
                                        }
                                        destroyPopupOnHide
                                    >
                                        <div>
                                            <Button
                                                icon={<BsUpload />}
                                                onClick={() =>
                                                    setShowUploadModal(true)
                                                }
                                            ></Button>
                                        </div>
                                    </Dropdown>
                                )}
                            </div>
                        );
                    })}
                </Form>
            </Modal>
        </div>
    );
}

export default Category;
