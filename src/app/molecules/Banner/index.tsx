import React from 'react';
import { Breadcrumb, Button, Card, Col, Row, Typography, Tag, Statistic, Space } from "antd";
import { PlusOutlined, ExportOutlined, ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { isPermission } from 'utils/helper';

const { Title, Text } = Typography;

const Banner: React.FC<any> = ({
  title,
  breadCrumb,
  buttonTitle,
  buttonUrl,
  onExport,
  permission,
  exportPermission,
  data = {},
  extraButton,
  extraData,
  showBackButton = true,
  stats = [], // [{label, value, icon, color}]
}) => {
  const authPermission: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );
  const navigate = useNavigate();

  return (
    <Card style={{ marginBottom: '5px' }} size='small'>
      {/* Breadcrumb */}
      {breadCrumb && (
        <Breadcrumb
          style={{ marginBottom: 8 }}
          separator="/"
          items={breadCrumb}
        />
      )}

      <Row align="middle" gutter={[16, 16]} justify="space-between">
        {/* Title & Stats */}
        <Col xs={24} md={16}>
          <Space direction="vertical" style={{ width: '100%' }} size={0}>
            <Row align="middle" gutter={8}>
              {showBackButton && (
                <Col>
                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    size="small"
                    style={{ marginRight: 8 }}
                  />
                </Col>
              )}
              <Col>
                {title && <Title level={2} style={{ margin: 0 }}>{title}</Title>}
              </Col>
            </Row>
            {/* Only custom stats via props */}
            <Row gutter={16} style={{ marginTop: 8 }}>
              {stats.map((stat: any, idx: number) => (
                <Col key={idx}>
                  <Statistic
                    title={stat.label}
                    value={stat.value}
                    prefix={stat.icon}
                    valueStyle={stat.color ? { color: stat.color } : {}}
                  />
                </Col>
              ))}
            </Row>
            {/* Extra Data Section */}
            {extraData && (
              <div style={{ marginTop: 8 }}>
                {extraData}
              </div>
            )}
          </Space>
        </Col>

        {/* Action Buttons & Dates */}
        <Col xs={24} md={8}>
          <Row gutter={8} justify="end">
            {extraButton}
            {onExport && isPermission(authPermission, exportPermission) && (
              <Col>
                <Button
                  onClick={onExport}
                  type="default"
                  icon={<ExportOutlined />}
                >
                  Export
                </Button>
              </Col>
            )}
            {isPermission(authPermission, permission) && buttonUrl && buttonTitle && (
              <Col>
                {typeof buttonUrl === 'string' ? (
                  <Link to={buttonUrl}>
                    <Button type="primary" icon={<PlusOutlined />}>
                      {buttonTitle}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={(e) => buttonUrl()}
                    type="primary"
                    icon={<PlusOutlined />}
                  >
                    {buttonTitle}
                  </Button>
                )}
              </Col>
            )}
          </Row>
          {/* Created/Updated Info */}
          {(data?.createdAt || data?.updatedAt) && (
            <div style={{ marginTop: 12, textAlign: 'end' }}>
              {data?.createdAt && (
                <Space>
                  <CalendarOutlined />
                  <Text strong>Added:</Text>
                  <Text>{moment(data?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                  <Text type="secondary">{moment(data?.createdAt).fromNow()}</Text>
                </Space>
              )}
              <br />
              {data?.updatedAt && (
                <Space>
                  <CalendarOutlined />
                  <Text strong>Updated:</Text>
                  <Text>{moment(data?.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                  <Text type="secondary">{moment(data?.updatedAt).fromNow()}</Text>
                </Space>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default Banner;
