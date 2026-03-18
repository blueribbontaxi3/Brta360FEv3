import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Spin,
  notification,
  Button,
  Select
} from 'antd';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { formFieldErrors } from '../../../utils/helper';
import Banner from '../../molecules/Banner';
import { useSelector } from 'react-redux';
import TicketHeader from './components/TicketHeader';
import TicketConversation from './components/TicketConversation';
import TicketSidebar from './components/TicketSidebar';
import TicketReplyForm from './components/TicketReplyForm';
import { InputField, TextAreaField } from '../../atoms/FormElement';
import { HomeOutlined, UploadOutlined } from '@ant-design/icons';
import { Form, Upload, Space } from 'antd'; // Added missing imports for Create form

const CreateOrEdit = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const ticketMessageId = searchParams.get('ticketMessageId');
  const [ticketData, setTicketData] = useState<any>(null);

  // State for Create Mode
  const [fileList, setFileList] = useState<any>([]);

  useEffect(() => {
    fetchTicketData()
  }, [id]);

  const auth: any = useSelector(
    (state: any) => state?.user_login
  );
  const isSuperAdmin = auth?.auth_super_admin;

  // Schema for CREATE mode only
  const createSchema = yup.object().shape({
    subject: yup.string().required('Subject is required'),
    description: yup.string().required('Description is required'),
    status: yup.string().required('Status is required'),
    priority: yup.string().required('Priority is required'),
  });

  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(createSchema),
    mode: 'all',
  });


  useEffect(() => {
    if (ticketData && ticketMessageId) {
      const element = document.getElementById(`msg-${ticketMessageId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.transition = 'box-shadow 0.5s ease';
        element.style.boxShadow = '0 0 20px rgba(22, 119, 255, 0.6)';

        setTimeout(() => {
          element.style.boxShadow = 'none';
          searchParams.delete('ticketMessageId');
          setSearchParams(searchParams);
        }, 2000);
      }
    }
  }, [ticketData, ticketMessageId]);

  const fetchTicketData = async () => {
    if (id) {
      setLoading(true);
      axios.get('/tickets/' + id)
        .then((e: any) => {
          const data = e?.data?.data?.ticket;
          if (data) {
            setTicketData(data);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          notification.error({
            message: 'Error',
            description: 'Failed to load ticket details',
          });
        });
    }
  }

  const breadCrumbList: any = [
    {
      title: (
        <Link to="/">
          <HomeOutlined />
          <span>Dashboard</span>
        </Link>
      ),
    },
    {
      title: <Link to="/tickets">Tickets</Link>,
    },
    {
      title: ticketData ? `Ticket #${ticketData.id}` : 'Create Ticket',
    },
  ];

  const [statuses, setStatuses] = useState<any[]>([]);

  // Fetch Statuses
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get('/tickets/statuses');
        const items = response.data?.data?.items || response.data?.data || [];
        setStatuses(items);
      } catch (error) {
        console.error('Failed to fetch statuses', error);
      }
    };
    fetchStatuses();
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    try {
      // Optimistic update
      setTicketData((prev: any) => ({ ...prev, status: newStatus }));

      await axios.patch(`/tickets/${id}/update-status`, {
        status: newStatus
      });
      notification.success({ message: 'Status updated successfully' });
    } catch (error) {
      notification.error({ message: 'Failed to update status' });
      fetchTicketData(); // Refresh to get correct server state
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      // Optimistic update
      setTicketData((prev: any) => ({ ...prev, priority: newPriority }));

      await axios.put(`/tickets/${id}`, {
        priority: newPriority
      });
      notification.success({ message: 'Priority updated successfully' });
    } catch (error) {
      notification.error({ message: 'Failed to update priority' });
      fetchTicketData(); // Refresh to get correct server state
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAllAttachments = () => {
    if (!ticketData?.messages) return [];
    const allAttachments: any[] = [];
    ticketData.messages.forEach((message: any) => {
      if (message.attachments && message.attachments.length > 0) {
        message.attachments.forEach((attachment: any) => {
          allAttachments.push({
            ...attachment,
            messageSender: message.sender?.name,
            messageDate: message.createdAt
          });
        });
      }
    });
    return allAttachments;
  };

  // Handler for Reply
  const handleReplySubmit = async (data: any, resetForm: () => void) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('description', data.description);

      if (data.fileList) {
        data.fileList.forEach((file: any) => {
          if (file.originFileObj) {
            formData.append('attachments[]', file.originFileObj);
          }
        });
      }

      const response = await axios.post(`tickets/${id}/reply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status === 1) {
        notification.success({ message: 'Reply sent successfully' });
        resetForm();
        fetchTicketData(); // Reload conversation
      }
      setLoading(false);

    } catch (e: any) {
      setLoading(false);
      notification.error({ message: 'Error sending reply', description: e?.response?.data?.message || e.message });
    }
  };

  // Handler for Create
  const handleCreateSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('subject', data.subject);
      formData.append('description', data.description);
      formData.append('status', data.status);
      formData.append('priority', data.priority);

      // Append array fields if any (like from a sidebar in create mode?) 
      // For now, standard fields

      fileList.forEach((file: any) => {
        if (file.originFileObj) {
          formData.append('attachments[]', file.originFileObj);
        }
      });

      const response = await axios.post('tickets/store', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status === 1) {
        notification.success({ message: 'Ticket created successfully' });
        navigate('/tickets');
      } else {
        setLoading(false);
        notification.error({ message: response.data.message });
      }
    } catch (e: any) {
      setLoading(false);
      if (e?.response?.status === 422) {
        formFieldErrors(e, setError);
      } else {
        notification.error({ message: 'Error creating ticket' });
      }
    }
  };

  return (
    <>
      <Banner
        breadCrumb={breadCrumbList}
        title={ticketData ? `Ticket #${ticketData.id}` : 'Create Ticket'}
      />

      <Spin spinning={loading}>
        {/* VIEW / EDIT MODE */}
        {id && ticketData && (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card bordered={false} bodyStyle={{ padding: '24px' }}>
                <TicketHeader
                  ticketData={ticketData}
                  formatDate={formatDate}
                  statuses={statuses}
                  onStatusChange={handleStatusChange}
                  onPriorityChange={handlePriorityChange}
                />
                <TicketConversation messages={ticketData.messages} formatDate={formatDate} />
                <TicketReplyForm onSubmit={handleReplySubmit} loading={loading} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <TicketSidebar
                ticketData={ticketData}
                isSuperAdmin={isSuperAdmin}
                getAllAttachments={getAllAttachments}
                formatDate={formatDate}
                onUpdateSuccess={fetchTicketData}
              />
            </Col>
          </Row>
        )}

        {/* CREATE MODE */}
        {!id && (
          <Row justify="center">
            <Col xs={24} md={18} lg={12}>
              <Card title="Create New Ticket">
                <Form layout="vertical" onFinish={handleSubmit(handleCreateSubmit)}>
                  <InputField
                    label="Subject"
                    fieldName="subject"
                    control={control}
                    iProps={{ placeholder: "Brief summary of the issue", size: "large" }}
                    errors={errors}
                  />

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Status" validateStatus={errors.status ? 'error' : ''} help={errors.status?.message?.toString()}>
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <Select {...field} placeholder="Select Status" size="large">
                              {statuses.map((s: any) => (
                                <Select.Option key={s.id} value={s.slug || s.id}>{s.title}</Select.Option>
                              ))}
                            </Select>
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Priority" validateStatus={errors.priority ? 'error' : ''} help={errors.priority?.message?.toString()}>
                        <Controller
                          name="priority"
                          control={control}
                          render={({ field }) => (
                            <Select {...field} placeholder="Select Priority" size="large">
                              <Select.Option value="low">Low</Select.Option>
                              <Select.Option value="normal">Normal</Select.Option>
                              <Select.Option value="medium">Medium</Select.Option>
                              <Select.Option value="high">High</Select.Option>
                            </Select>
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <TextAreaField
                    label="Description"
                    fieldName="description"
                    control={control}
                    iProps={{ placeholder: "Detailed description...", size: "large", rows: 6 }}
                    errors={errors}
                  />
                  <Form.Item label="Attachments">
                    <Upload
                      multiple
                      beforeUpload={() => false}
                      fileList={fileList}
                      onChange={({ fileList }) => setFileList(fileList)}
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </Form.Item>

                  <Space style={{ marginTop: 16 }}>
                    <Button type="primary" size="large" htmlType="submit" loading={loading}>
                      Submit Ticket
                    </Button>
                    <Button size="large" onClick={() => navigate('/tickets')}>
                      Cancel
                    </Button>
                  </Space>
                </Form>
              </Card>
            </Col>
          </Row>
        )}
      </Spin>
    </>
  );
};

export default CreateOrEdit;
