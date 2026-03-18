import React, { useState } from 'react';
import { Card, Form, Button, Upload, Row, Col, Space } from 'antd';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import { TextAreaField } from '../../../atoms/FormElement';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface TicketReplyFormProps {
    onSubmit: (data: any, reset: any) => void;
    loading: boolean;
}

const TicketReplyForm: React.FC<TicketReplyFormProps> = ({ onSubmit, loading }) => {
    const [fileList, setFileList] = useState<any>([]);

    const schema = yup.object().shape({
        description: yup.string().required('Message is required'),
    });

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    const handleFileChange = ({ fileList: newList }: any) => setFileList(newList);

    const onFormSubmit = (data: any) => {
        // combine data with fileList
        onSubmit({ ...data, fileList }, () => {
            reset();
            setFileList([]);
        });
    };

    return (
        <Card style={{ marginTop: 16 }} bodyStyle={{ padding: '16px' }}>
            <Form layout="vertical" onFinish={handleSubmit(onFormSubmit)}>
                <TextAreaField
                    fieldName="description"
                    control={control}
                    initValue=""
                    iProps={{
                        placeholder: "Type your reply...",
                        autoSize: { minRows: 3, maxRows: 6 },
                        bordered: true
                    }}
                    errors={errors}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <Upload
                        multiple
                        beforeUpload={() => false}
                        fileList={fileList}
                        onChange={handleFileChange}
                        showUploadList={false} // Custom list maybe? Or just keep simple
                    >
                        <Button icon={<UploadOutlined />} size="small">Attach Files</Button>
                    </Upload>
                    <Space>
                        {fileList.length > 0 && <span style={{ fontSize: '12px', color: '#8c8c8c' }}>{fileList.length} files attached</span>}
                        <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading}>
                            Send Reply
                        </Button>
                    </Space>
                </div>

                {/* Show file list if any */}
                {fileList.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                        <Upload
                            fileList={fileList}
                            onChange={handleFileChange}
                            onRemove={(file) => {
                                const index = fileList.indexOf(file);
                                const newFileList = fileList.slice();
                                newFileList.splice(index, 1);
                                setFileList(newFileList);
                            }}
                        />
                    </div>
                )}
            </Form>
        </Card>
    );
};

export default TicketReplyForm;
