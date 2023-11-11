"use client";

import { useContext, useState, useEffect, useCallback } from "react";
import {
    Button,
    Col,
    Dropdown,
    Form,
    Image,
    Input,
    Modal,
    Row,
    Space,
    Table,
    Typography,
} from "antd";
import { RcFile } from "antd/es/upload";
import { ColumnsType } from "antd/es/table";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";

import { notificationContext } from "@/context";
import { imageApi } from "@/service/api/image";
import UploadImage from "../components/UploadImage";
import Loading from "./loading";

type Item = Awaited<
    ReturnType<typeof imageApi.getList>
>["data"]["images"][number];

function ImageManager() {
    const [showModal, setShowModal] = useState(false);
    const notificationApi = useContext(notificationContext);
    const [modalApi, modalCtxHolder] = Modal.useModal();

    const [items, setItems] = useState<Item[]>();
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState<{
        _id: string;
        name?: string;
        url: string;
    }>();

    const columns: ColumnsType<Item> = [
        {
            title: "No.",
            key: "index",
            render(value, record, index) {
                return index + 1;
            },
        },
        {
            title: "Image",
            key: "url",
            dataIndex: "url",
            render(value, record, index) {
                return <Image width={40} src={value} alt={record.name} />;
            },
        },
        {
            title: "Name",
            key: "name",
            dataIndex: "name",
        },
        {
            title: "Action",
            key: "action",
            render(value, record, index) {
                return (
                    <Space size={8}>
                        <Button
                            icon={<HiOutlinePencilAlt />}
                            onClick={() => setEditData(record)}
                        ></Button>
                        <Button
                            icon={<IoIosClose />}
                            danger
                            onClick={() => handleDelete(record._id)}
                        ></Button>
                    </Space>
                );
            },
        },
    ];

    const fetchData = useCallback(() => {
        imageApi
            .getList()
            .then((res) => {
                setItems(res.data.images);
            })
            .catch();
    }, []);

    const handleUpload = (image: RcFile, name?: string) => {
        setLoading(true);
        imageApi
            .upload({ image, name })
            .then((res) => {
                notificationApi?.success({
                    message: "Upload image successfully",
                });
                setShowModal(false);
                fetchData();
            })
            .catch(() => {
                notificationApi?.error({ message: "Upload image fail" });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (id: string) => {
        modalApi.warning({
            title: "Are you sure to delete this image",
            okType: "danger",
            okCancel: true,
            centered: true,
            async onOk() {
                await imageApi
                    .delete(id)
                    .then(() => {
                        notificationApi?.success({
                            message: "Delete image successfully",
                        });
                        fetchData();
                    })
                    .catch(() => {
                        notificationApi?.error({
                            message: "Delete image fail",
                        });
                    });
            },
        });
    };

    const handleEdit = (data: Item) => {
        setLoading(true);
        imageApi
            .edit(editData?._id as NonNullable<string>, data.name)
            .then(() => {
                notificationApi?.success({
                    message: "Edit image name successfully",
                });
                setEditData(undefined);
                fetchData();
            })
            .catch(() => {
                notificationApi?.error({ message: "Edit image name fail" });
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!items) {
        return <Loading />;
    }

    return (
        <div data-component="ImageManager">
            <Typography.Title level={3}>
                User&#39;s Image manager
            </Typography.Title>

            <Row justify="end" style={{ marginBottom: 16 }}>
                <Dropdown
                    open={showModal}
                    dropdownRender={() => (
                        <UploadImage
                            onCancel={() => setShowModal(false)}
                            onOk={handleUpload}
                            loading={loading}
                        />
                    )}
                    trigger={["click"]}
                    destroyPopupOnHide
                >
                    <Button type="primary" onClick={() => setShowModal(true)}>
                        Upload
                    </Button>
                </Dropdown>
            </Row>

            <Table
                columns={columns}
                dataSource={items}
                scroll={{ x: 600, y: "calc(100vh - 350px)" }}
                rowKey="_id"
            />

            <Modal
                destroyOnClose
                open={!!editData}
                onCancel={() => setEditData(undefined)}
                okButtonProps={{ htmlType: "submit", form: "form", loading }}
            >
                <Form
                    layout="vertical"
                    id="form"
                    initialValues={editData}
                    onFinish={handleEdit}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={24} md={6}>
                            <Image
                                width={80}
                                src={editData?.url}
                                alt={editData?.name}
                            />
                        </Col>
                        <Col span={24} md={18}>
                            <Form.Item name="name" label="Image name">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {modalCtxHolder}
        </div>
    );
}

export default ImageManager;
