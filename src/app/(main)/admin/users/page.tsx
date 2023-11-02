"use client";

import { useState, useEffect, useRef } from "react";
import {
    Avatar,
    Button,
    Card,
    Col,
    Dropdown,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tooltip,
    Typography,
    notification,
} from "antd";
import { type ColumnsType } from "antd/es/table";
import { GrFormClose } from "react-icons/gr";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { AiOutlineCheck } from "react-icons/ai";
import { BsPlusLg, BsLink45Deg } from "react-icons/bs";
import { userApi } from "@/service/api/user";
import { resourceApi } from "@/service/api/resource";
import { colors } from "@/theme/constants";
import Loading from "./loading";

type Item = Awaited<ReturnType<typeof userApi.getById>>["data"]["user"];

type FormData = {
    _id: string;
    email: string;
    name: string;
    password: string;
    page: string;
    avatar: string;
};

type PageItem = {
    _id: string;
    name: string;
    url: string;
};

const avatarUrls = [
    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg&ga=GA1.1.166673674.1698464978&semt=sph",
    "https://img.freepik.com/free-psd/3d-illustration-bald-person-with-glasses_23-2149436184.jpg?size=626&ext=jpg",
    "https://img.freepik.com/free-psd/3d-illustration-person_23-2149436179.jpg?size=626&ext=jpg",
    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses-green-hair_23-2149436201.jpg?size=626&ext=jpg",
    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436178.jpg?size=626&ext=jpg",
    "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436185.jpg?size=626&ext=jpg",
    "https://img.freepik.com/free-psd/3d-illustration-bald-person_23-2149436183.jpg?size=626&ext=jpg",
];

function Users() {
    const [notificationApi, notificationHolder] =
        notification.useNotification();
    const [form] = Form.useForm();

    const formConfig = useRef({
        isEdit: false,
        initData: undefined as FormData | undefined,
    });
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState<Item[]>();
    const [pageItems, setPageItems] = useState<PageItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(avatarUrls[0]);
    const [showAvatarUrlInput, setShowAvatarUrlInput] = useState(false);
    const [avatarUrlInput, setAvatarUrlInput] = useState("");

    const columns: ColumnsType<Item> = [
        {
            key: "index",
            title: "No.",
            render(value, record, index) {
                return index + 1;
            },
        },
        {
            key: "info",
            title: "Info",
            render(value, record, index) {
                return (
                    <Space size={8}>
                        <Avatar src={record.avatar} />
                        <Typography.Title level={4}>
                            {record.name}
                        </Typography.Title>
                    </Space>
                );
            },
        },
        {
            key: "email",
            dataIndex: "email",
            title: "Email",
        },
        {
            key: "role",
            dataIndex: "role",
            title: "Role",
        },
        {
            key: "page",
            dataIndex: "page",
            title: "Managed page",
            render(value, record, index) {
                return (
                    <Tooltip
                        title={
                            <Typography.Text style={{ color: colors.bg }}>
                                Page url:{" "}
                                <a href={record.page.url} target="_blank">
                                    {record.page.url}
                                </a>
                            </Typography.Text>
                        }
                    >
                        {record.page?.name}
                    </Tooltip>
                );
            },
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
                            onClick={() => showEditForm(record)}
                        ></Button>
                        <Popconfirm
                            title="Do you want to delete this user?"
                            okType="danger"
                            onConfirm={async () => handleDelete(record._id)}
                        >
                            <Button
                                icon={<GrFormClose />}
                                danger
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            ></Button>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];
    const pageOpts = pageItems.map((item) => ({
        label: item.name,
        value: item._id,
    }));

    const handleSubmit = (data: FormData) => {
        const appendAvatarData = { ...data, avatar };
        setLoading(true);
        const api = formConfig.current.isEdit
            ? () =>
                  userApi.edit(
                      (formConfig.current.initData as NonNullable<FormData>)
                          ._id,
                      appendAvatarData
                  )
            : () => userApi.create(appendAvatarData);
        const label = formConfig.current.isEdit ? "Edit" : "Create";
        api()
            .then((res) => {
                setShowModal(false);
                fetchData();
                notificationApi.success({
                    message: label + " user successfully",
                });
            })
            .catch((err) => {
                notificationApi.error({ message: label + " user fail" });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchData = () => {
        userApi
            .getAll()
            .then((res) => {
                setItems(res.data.users);
            })
            .catch(() => {});
    };

    const showCreateForm = () => {
        formConfig.current = {
            isEdit: false,
            initData: undefined,
        };
        setShowModal(true);
    };

    const showEditForm = (record: Item) => {
        formConfig.current = {
            isEdit: true,
            initData: {
                _id: record._id,
                email: record.email,
                name: record.name,
                page: record.page?._id,
                password: "",
                avatar: record.avatar,
            },
        };
        form.setFieldsValue(formConfig.current.initData);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await userApi.delete(id);
            notificationApi.success({ message: "Delete user successfully" });
            fetchData();
        } catch (error) {
            notificationApi.error({ message: "Delete user fail" });
        }
    };

    const handleClose = () => {
        setShowModal(false);
        form.resetFields();
    };

    useEffect(() => {
        fetchData();
        resourceApi
            .getAll()
            .then((res) => {
                setPageItems(res.data.pages);
            })
            .catch();
    }, []);

    if (!items) {
        return <Loading />;
    }

    return (
        <div data-component="Users">
            <Row justify="end" style={{ marginBottom: 16 }}>
                <Col>
                    <Button type="primary" onClick={showCreateForm}>
                        Add user
                    </Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={items} rowKey="_id" />

            <Modal
                title="Create new user"
                open={showModal}
                onCancel={handleClose}
                okText="Submit"
                okButtonProps={{ form: "form", htmlType: "submit", loading }}
            >
                <Form
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    id="form"
                    onFinish={handleSubmit}
                    form={form}
                    autoComplete="off"
                >
                    <Row gutter={[16, 16]} align="middle" justify="center">
                        <Avatar size={100} src={avatar} />
                        <Col span={24}>
                            <Row gutter={8} justify="center">
                                {avatarUrls.slice(1, 3).map((item) => (
                                    <Col key={item}>
                                        <Avatar
                                            size={46}
                                            src={item}
                                            onClick={() => setAvatar(item)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </Col>
                                ))}
                                <Dropdown
                                    trigger={["click"]}
                                    dropdownRender={() => (
                                        <Card
                                            bodyStyle={{
                                                padding: 16,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "auto auto",
                                                    gap: 8,
                                                }}
                                            >
                                                {avatarUrls
                                                    .slice(3, 7)
                                                    .map((item) => (
                                                        <Avatar
                                                            key={item}
                                                            size={40}
                                                            src={item}
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                setAvatar(item)
                                                            }
                                                        />
                                                    ))}
                                                <Dropdown
                                                    trigger={["click"]}
                                                    open={showAvatarUrlInput}
                                                    dropdownRender={() => (
                                                        <Card
                                                            bodyStyle={{
                                                                padding: 10,
                                                            }}
                                                        >
                                                            <Space
                                                                size={8}
                                                                align="center"
                                                            >
                                                                <Input
                                                                    placeholder="Image url"
                                                                    value={
                                                                        avatarUrlInput
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setAvatarUrlInput(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                                <Button
                                                                    icon={
                                                                        <AiOutlineCheck />
                                                                    }
                                                                    type="primary"
                                                                    onClick={() => {
                                                                        setAvatar(
                                                                            avatarUrlInput
                                                                        );
                                                                        setShowAvatarUrlInput(
                                                                            false
                                                                        );
                                                                    }}
                                                                ></Button>
                                                            </Space>
                                                        </Card>
                                                    )}
                                                >
                                                    <Button
                                                        icon={<BsLink45Deg />}
                                                        type="dashed"
                                                        style={{
                                                            gridColumn:
                                                                "1 / span 2",
                                                            width: "100%",
                                                        }}
                                                        onClick={() =>
                                                            setShowAvatarUrlInput(
                                                                true
                                                            )
                                                        }
                                                    ></Button>
                                                </Dropdown>
                                            </div>
                                        </Card>
                                    )}
                                >
                                    <Button
                                        shape="circle"
                                        type="dashed"
                                        icon={<BsPlusLg />}
                                        style={{ width: 46, height: 46 }}
                                    />
                                </Dropdown>
                            </Row>
                        </Col>
                    </Row>
                    <Form.Item
                        name="name"
                        label="Name"
                        required
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Row gutter={[16, 16]}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                required
                                rules={[
                                    { required: true },
                                    {
                                        pattern:
                                            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                        message:
                                            "Please input correct email format",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="password"
                                label="Password"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input.Password placeholder="Input new password here" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="Page"
                        name="page"
                        required
                        rules={[{ required: true }]}
                    >
                        <Select options={pageOpts} />
                    </Form.Item>
                </Form>
            </Modal>
            {notificationHolder}
        </div>
    );
}

export default Users;
