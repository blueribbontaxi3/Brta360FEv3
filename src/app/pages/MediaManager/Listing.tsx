import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  List,
  message,
  Spin,
  Empty,
  Typography,
  Space,
  Popconfirm,
  Flex,
  Tooltip,
  ConfigProvider,
  Grid,
} from "antd";
import {
  CheckCircleFilled,
  CloseOutlined,
  FilePdfOutlined,
  SearchOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import axios from "../../../utils/axiosInceptor";
import MediaModal from "./MediaModal";
import {
  VideoCameraOutlined,
  AudioOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { extractArrayColumn, isPermission, mediaTypeFilter, mimeTypes } from "../../../utils/helper";
import { useSelector } from "react-redux";
import { PRIMARY_COLOR } from "../../../configs/env.config";
const { useBreakpoint } = Grid;

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Title, Paragraph } = Typography;


const MediaLibrary: any = ({
  defaultSelected = [],
  require = false,
  multiple = true,
  allowedTypes = [],
  maxItems = 10,
  onSelected,
  closeModal,
  navigate,
  mediaItemDetail,
  newMedia
}: any) => {

  const [data, setData] = useState<any>([]);
  const [items, setItems] = useState<any[]>([]);
  const [singleItem, setSingleItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<any>();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isBulkSelection, setIsBulkSelection] = useState(false);
  const [addButtonLoading, setAddButtonLoading] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const allMimeTypes = mimeTypes();
  // Fetch media data from the server
  const loadMoreData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axios.get(`/media`, {
        params: {
          current: currentPage,
          search: filters?.search,
          mime_types:
            filters?.type && filters?.type != "all"
              ? allMimeTypes[filters?.type]
              : [],
          startDate: filters?.dateRange?.[0],
          endDate: filters?.dateRange?.[1],
        },
      });
      const result = response?.data?.data;
      setItems((prev) => [...prev, ...result.items]);
      setData(result);

      // Update hasMore based on the total count
      setHasMore(result.total > [...items, ...result.items].length);
      setCurrentPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading media:", error);
      message.error("Failed to load media items.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (newMedia) {
      setItems((prev) => [...[newMedia], ...prev]);
    }
  }, [newMedia])
  // const handleDateRange = (value: any) => {
  //   if (value?.length === 2) {
  //     const startDate = value[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
  //     const endDate = value[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
  //     setFilters((prev: any) => ({
  //       ...prev,
  //       date: { start: startDate, end: endDate },
  //       pagination: { ...prev.pagination, current: 1 },
  //     }));
  //   } else {
  //     setFilters((prev: any) => ({
  //       ...prev,
  //       date: {},
  //       pagination: { ...prev.pagination, current: 1 },
  //     }));
  //   }
  // };

  let isListingPage = window.location.pathname == '/media-manager/list';

  const screens = useBreakpoint();

  const getCurrentBreakpoint = () => {
    if (screens.xxl) return "XXL";
    if (screens.xl) return "XL";
    if (screens.lg) return "LG";
    if (screens.md) return "MD";
    if (screens.sm) return "SM";
    return "XS";
  };
  let isScreenSize = getCurrentBreakpoint();
  let heightSize: any = { XS: 100, SM: 100, MD: 100, LG: 120, XL: 130, XXL: 150 };
  let heightSizeMinus: any = { XS: 380, SM: 300, MD: 300, LG: 270, XL: 270, XXL: 275 };
  let mediaCardItemHeight = heightSize[isScreenSize]
  let mediaModalHeight = heightSizeMinus[isScreenSize]

  // Improved hasMore calculation
  useEffect(() => {

    if (data?.total) {
      setHasMore(data?.total > items.length); // Compare total items with fetched items
    }
  }, [data, items]);

  useEffect(() => {
    if (currentPage == 1) {
      loadMoreData();
    }
  }, [currentPage]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
    setData([]);
    setItems([]);
    setCurrentPage(1);
    setHasMore(true);
  };

  // Handle bulk selection
  const toggleSelection = (item: any) => {
    if (isBulkSelection) {
      setSelectedItems((prev) =>
        prev.some((i) => i.id === item.id)
          ? prev.filter((i) => i.id !== item.id)
          : [...prev, item]
      );
    } else {
      setSingleItem(item);
      setSelectedItems([item]);
      setOpen(true);
    }
  };

  useEffect(() => {
    if (defaultSelected && defaultSelected.length > 0) {
      setSelectedItems(defaultSelected);
    }
  }, [defaultSelected])



  const { mutate: deleteMutate, isLoading: isDeleteLoading }: any = useMutation(
    {
      mutationFn: async (body: any) => {
        setLoading(true)
        return await axios.delete(`/media`, { data: body });
      },
      onSuccess: (response: any, variables: any) => {
        let payloadIds = variables?.data?.ids;
        let filterItems = items.filter(
          (media) => !variables?.data?.ids.includes(media?.id)
        );
        setItems(filterItems);
        setData((prev: any) => ({
          ...prev,
          total: prev.total - payloadIds.length,
          items: filterItems,
        }));
        setSelectedItems([]);
        // setHasMore((data.total - payloadIds.length) > filterItems.length)
        message.success(`${response?.data?.message}`);
        setLoading(false)
        setIsBulkSelection(false)
      },
    }
  );

  const confirmDelete: any = (item: any) => {
    const dataArray = Array.isArray(item) ? item : [item];
    deleteMutate({
      data: {
        ids: dataArray,
      },
    });
  };

  const getMediaPreview = (item: any) => {
    const mime = item.mime_type;

    if (mime.startsWith("image/")) {
      return (
        <img
          alt={item.name}
          src={item.url}
          style={{ width: "100%", height: 150, objectFit: "contain" }}
        />
      );
    } else if (mime.startsWith("video/")) {
      return (
        <VideoCameraOutlined
          style={{
            fontSize: "50px",
            color: "#1890ff",
          }}
        />
      );
    } else if (mime.startsWith("audio/")) {
      return (
        <AudioOutlined
          style={{
            fontSize: "50px",
            color: "#52c41a",
          }}
        />
      );
    } else if (mime.startsWith("application/pdf")) {
      return (
        <FilePdfOutlined
          style={{
            fontSize: "50px",
            color: "red",
          }}
        />
      );
    } else {
      return (
        <FileTextOutlined
          style={{
            fontSize: "50px",
            color: "#faad14",
          }}
        />
      );
    }
  };

  const handleAddClick = () => {
    if (selectedItems.length === 0 && require) {
      message.error(`Media field is required`);
    } else {
      setAddButtonLoading(true);
      console.log("selectedItems", selectedItems)
      onSelected(selectedItems);
      closeModal();
    }
  };
  const authPermission: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );

  return (
    <>
      <Spin spinning={loading}>
        <Space>
          <Title level={3} style={{ marginTop: 0 }}>
            Media Library
          </Title>
          {window.location.pathname.includes('/media-manager/list') && navigate && <Button type="primary" onClick={() => navigate("/media-manager")}>
            Add New Media
          </Button>}

        </Space>
        <Card
          style={{ marginBottom: 10 }}
          styles={{
            body: {
              padding: 10,
            },
          }}
          bordered
        >
          <Row gutter={16}>
            {!isBulkSelection && (
              <>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <RangePicker
                    style={{ width: "100%" }}
                    onChange={(dates) =>
                      handleFilterChange(
                        "dateRange",
                        dates ? dates.map((d: any) => d.format("YYYY-MM-DD")) : []
                      )
                    }
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={3}>
                  <Select
                    placeholder="Filter by type"
                    style={{ width: "100%" }}
                    onChange={(value) => handleFilterChange("type", value)}
                    allowClear
                  >
                    {mediaTypeFilter().map((item: any, index: number) => {
                      return (
                        <>
                          <Option value={item.value}>{item.label}</Option>
                        </>
                      );
                    })}
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={8} lg={5}>
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Search media"
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </Col>
              </>
            )}

            {isBulkSelection && (
              <Col xs={24} sm={12} md={8} lg={2}>
                <Popconfirm
                  title="Are you sure you want to delete this images"
                  description="This action will permanently remove media from the list."
                  okText="Yes"
                  cancelText="No"
                  onConfirm={(e) =>
                    confirmDelete(extractArrayColumn(selectedItems, "id"))
                  }
                >
                  <Button
                    disabled={selectedItems.length < 1}
                    color="danger"
                    variant="solid"
                    style={{ width: "100%" }}
                  >
                    Delete{" "}
                    {selectedItems.length > 0 && `(${selectedItems.length})`}
                  </Button>
                </Popconfirm>
              </Col>
            )}
            {isPermission(authPermission, 'Media Delete') && <Col xs={24} sm={12} md={8} lg={3}>
              <Button
                type="primary"
                icon={isBulkSelection ? <CloseOutlined /> : <SelectOutlined />}
                onClick={() => {
                  setSelectedItems([]);
                  setIsBulkSelection((prev) => !prev);
                  if (isBulkSelection) {
                    setData([]);
                    setItems([]);
                    setCurrentPage(1);
                    setHasMore(true);
                  }
                }}
              >
                {isBulkSelection ? "Cancel" : "Bulk Select"}
              </Button>
            </Col>}

          </Row>
        </Card>

        {/* Media Grid */}
        <Spin spinning={loading} tip="Loading...">
          <ConfigProvider
            theme={{
              components: {
                Card: {
                  actionsLiMargin: '5px'
                },
              },
            }}
          >
            {items.length > 0 ? (
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 4,
                  lg: 6,
                  xl: 8,
                  xxl: 9,
                }}
                style={isListingPage ? {} : {
                  height: `calc(90vh - ${mediaModalHeight}px)`,
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  paddingTop: 5
                }}

                dataSource={items}
                renderItem={(item: any) => (
                  <List.Item>
                    <Tooltip title={item.name}>
                      <Card
                        styles={{
                          body: {
                            padding: 0,
                            height: mediaCardItemHeight,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }
                        }}
                        hoverable
                        onClick={() => toggleSelection(item)}
                        className={
                          selectedItems.some((i) => i.id === item.id)
                            ? "selected"
                            : ""
                        }
                        style={{
                          border: selectedItems.some((i) => i.id === item.id)
                            ? "1px solid #1890ff"
                            : "1px solid #d9d9d9",
                        }}
                        actions={[
                          <Paragraph
                            style={{
                              padding: 0,
                              margin: 0
                            }}
                            ellipsis={true}
                          >{item.name}</Paragraph>
                        ]}
                      >
                        {selectedItems.some((i) => i.id === item.id) ? <CheckCircleFilled style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          fontSize: '20px', color: PRIMARY_COLOR
                        }} /> : null}
                        {getMediaPreview(item)}
                      </Card>
                    </Tooltip>
                  </List.Item>
                )}
                loadMore={
                  <Space
                    direction="vertical"
                    align="center"
                    size="middle"
                    style={{ display: "flex" }}
                  >
                    <Text>
                      {" "}
                      Showing {items.length} of {data.total} media items
                    </Text>
                    {hasMore && !isBulkSelection && (
                      <Button onClick={loadMoreData} loading={loading}>
                        Load More
                      </Button>
                    )}
                  </Space>
                }
              />
            ) : (
              <Empty description="No media found" />
            )}
          </ConfigProvider>
        </Spin>
        {mediaItemDetail == 'side' && <Flex justify={"end"}>
          <Button type="primary" onClick={handleAddClick} size='large' loading={addButtonLoading}>Add</Button>
        </Flex>}
        {mediaItemDetail !== 'side' && (
          <MediaModal
            visible={open}
            onClose={() => setOpen(false)}
            mediaDetails={singleItem}
            setSingleItem={setSingleItem}
            items={items}
          />
        )}
      </Spin>
    </>
  );
};

export default MediaLibrary;
