"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Button,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Space,
    Table,
    notification,
} from "antd";
import { type ColumnsType } from "antd/es/table";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { GrFormClose } from "react-icons/gr";
import { resourceApi } from "@/service/api/resource";

type Item = {
    _id: string;
    name: string;
    url: string;
};

function Resources() {
    const { push } = useRouter();
    const [modal, modalHolder] = Modal.useModal();
    const [notificationApi, notificationHolder] =
        notification.useNotification();

    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState<Item[]>();
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
            key: "pageName",
            title: "Page name",
            dataIndex: "name",
        },
        {
            key: "pageUrl",
            title: "Page url",
            dataIndex: "url",
        },
        {
            key: "action",
            title: "Action",
            render(value, record, index) {
                return (
                    <Space size={8}>
                        <Button
                            icon={<HiOutlinePencilAlt />}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onClick={() => push(`/resources/${record._id}`)}
                        ></Button>
                        <Button
                            icon={<GrFormClose />}
                            danger
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onClick={() => handleDelete(record._id)}
                        ></Button>
                    </Space>
                );
            },
        },
    ];

    const fetchData = () => {
        resourceApi
            .getAll()
            .then((res) => {
                setItems(res.data.pages);
            })
            .catch((err) => {});
    };

    const handleSubmit = (data: any) => {
        setLoading(true);
        resourceApi
            .create(data)
            .then((res) => {
                notificationApi.success({
                    message: "Create page successfully",
                });
                setShowModal(false);
                fetchData();
            })
            .catch((err) => {
                notificationApi.success({
                    message: "Create page fail",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (id: string) => {
        modal.error({
            title: "Do you want to delete this page?",
            okType: "danger",
            okText: "Delete",
            okCancel: true,
            centered: true,
            async onOk() {
                try {
                    await resourceApi.delete(id);
                    notificationApi.success({
                        message: "Delete page successfully",
                    });
                    fetchData();
                } catch (error) {
                    notificationApi.error({
                        message: "Delete page fail",
                    });
                }
            },
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div data-component="Resources">
            <Row justify="end" style={{ marginBottom: 16 }}>
                <Col>
                    <Button type="primary" onClick={() => setShowModal(true)}>
                        Create new page
                    </Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={items} rowKey="_id" />
            <Modal
                title="Create new page"
                open={showModal}
                destroyOnClose
                onCancel={() => setShowModal(false)}
                okText="Submit"
                okButtonProps={{ loading, form: "form", htmlType: "submit" }}
            >
                <Form
                    id="form"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    onFinish={handleSubmit}
                >
                    <Form.Item<Item>
                        label="Page name"
                        name="name"
                        required
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<Item>
                        label="Page url"
                        name="url"
                        required
                        rules={[
                            { required: true },
                            {
                                pattern: /^(http:\/\/)|(https:\/\/)/,
                                message: "Please enter correct url",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            {modalHolder}
            {notificationHolder}
        </div>
    );
}

export default Resources;
