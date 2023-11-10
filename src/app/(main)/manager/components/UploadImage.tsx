"use client";

import { useState } from "react";
import {
    Button,
    Card,
    Form,
    Image,
    Input,
    Upload,
    type UploadProps,
} from "antd";
import { BsUpload } from "react-icons/bs";
import { RcFile } from "antd/es/upload";

type Props = {
    onCancel: () => void;
    onOk: (file: RcFile, name?: string) => void;
    loading?: boolean;
};

const defaultUrl =
    "https://img.freepik.com/free-vector/image-upload-concept-landing-page_23-2148319539.jpg?size=626&ext=jpg&ga=GA1.1.166673674.1698464978&semt=ais";

function UploadImage({ onCancel, onOk, loading }: Props) {
    const [imageUrl, setImageUrl] = useState("");

    const handleChange: UploadProps["onChange"] = (info) => {
        const url = URL.createObjectURL(info.file as RcFile);
        setImageUrl(url);
    };

    return (
        <Card
            style={{ zIndex: 1 }}
            bodyStyle={{ padding: 16 }}
            title="Upload image"
            actions={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="ok"
                    type="primary"
                    htmlType="submit"
                    form="form"
                    loading={loading}
                >
                    Upload
                </Button>,
            ]}
        >
            <Form
                layout="vertical"
                id="form"
                onFinish={(data) => onOk(data.image.file, data.name)}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: 16,
                    }}
                >
                    <Image
                        src={imageUrl || defaultUrl}
                        alt="img"
                        width={100}
                        preview={false}
                    />
                </div>
                <div
                    style={{ display: "flex", gap: 8, alignItems: "flex-end" }}
                >
                    <Form.Item label="Image name" name="name">
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        name="image"
                        required
                        rules={[
                            { required: true, message: "Please upload image" },
                        ]}
                    >
                        <Upload
                            accept=".png, .jpg, .svg"
                            onChange={handleChange}
                            beforeUpload={() => false}
                            showUploadList={false}
                            multiple={false}
                        >
                            <Button icon={<BsUpload />}></Button>
                        </Upload>
                    </Form.Item>
                </div>
            </Form>
        </Card>
    );
}

export default UploadImage;
