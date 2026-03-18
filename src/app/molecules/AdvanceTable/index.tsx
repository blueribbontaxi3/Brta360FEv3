import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button, Col, Divider, Input, Row, DatePicker, Table, Modal, Select, Flex } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getStatuses } from '../../../utils/helper';
import { debounce } from 'lodash';

const { RangePicker } = DatePicker;
const { Search } = Input;


const AdvanceTable: React.FC<any> = ({
  columns,
  data,
  loading,
  tableParams,
  setTableParams,
  handleTableChange,
  onDelete,
  handleDateRange,
  statuses = getStatuses,
  expandable,
  extraFilters,
  status,
  searchFilter,
  deleteText,
  isConfirmationShow = true,
  pageSizeOptions,
  rowJustify = ["start", "end", "center", "space-around", "space-between", "space-evenly"],
  rawSelectionReset,
  onSelectAll,
  onSelectNone,
  onSelectInvert,
  rawSelectionOnChange,
  setSelectedRowData,
  rangePickerRenderExtraFooter
}): any => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        if (setSelectedRowData) {
          setSelectedRowData(newSelectedRowKeys);
        }
      },
    }),
    [selectedRowKeys, setSelectedRowData]
  );
  const handleStatusFilter = useCallback(
    (value: any) => {
      setTableParams((prevState: any) => ({
        ...prevState,
        status: value,
        pagination: { ...prevState?.pagination, current: 1 },
      }));
    },
    [setTableParams]
  );

  useEffect(() => {
    if (rawSelectionReset) {
      setSelectedRowKeys([]);
    }
  }, [data, rawSelectionReset]);

  const handleSearchFilter = debounce(
    (searchValue: string) => {
      setTableParams((prevParams: any) => ({
        ...prevParams,
        search: searchValue,
        pagination: { ...prevParams?.pagination, current: 1 },
      }));
    },
    300
  );

  const confirmDeletion = useCallback(() => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete those items?',
      cancelText: 'Cancel',
      okText: 'Yes, delete them!',
      onOk: () => onDelete?.(selectedRowKeys),
    });
  }, [onDelete, selectedRowKeys]);

  return (
    <>
      {/* Filters and Actions */}
      <Row className="mb-1" gutter={[16, 24]} align="middle" justify={rowJustify}>
        {onDelete && (
          <Col xs={24} sm={6} md={4} lg={2} xl={2}>
            <Button
              type="primary"
              disabled={selectedRowKeys.length === 0}
              onClick={() => {
                if (isConfirmationShow) {
                  confirmDeletion();
                } else {
                  onDelete?.(selectedRowKeys)
                }
              }}
              aria-label="Delete selected rows"
            >
              {deleteText || 'Delete'}
            </Button>
          </Col>
        )}

        {handleDateRange && (
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <Flex gap="16px" wrap="nowrap">

              <RangePicker
                allowClear
                style={{ width: '100%' }}
                onChange={handleDateRange}
                aria-label="Filter by date range"
                placeholder={['Start date', 'End date']}
                format={'MM-DD-YYYY'}
                renderExtraFooter={() => rangePickerRenderExtraFooter}
              />
            </Flex>
          </Col>
        )}
        {extraFilters}
        {status !== false &&
          <Col xs={24} sm={12} md={8} lg={4} xl={3}>
            <Select
              onChange={handleStatusFilter}
              options={statuses()}
              placeholder="Select a status"
              allowClear
              style={{ width: '100%' }}
              showSearch
              aria-label="Filter by status"
            />
          </Col>
        }
        {searchFilter !== false &&
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Search..."
              allowClear
              onSearch={handleSearchFilter}
              enterButton
              aria-label="Search data"
            />
          </Col>
        }
      </Row>

      <Divider />

      {/* Table */}
      <Table
        scroll={{ x: 'max-content' }} // or x: 1000
        dataSource={data}
        columns={columns}
        rowSelection={onDelete ? { type: 'checkbox', ...rowSelection, onSelectAll: onSelectAll, onSelectNone: onSelectNone, onSelectInvert: onSelectInvert } : undefined}
        loading={loading}
        pagination={{
          ...tableParams?.pagination, // Spread existing pagination params if any
          showSizeChanger: true,
          showQuickJumper: true,
          size: "large",
          showTotal: (total) => `Total ${total} items`,
          position: ['bottomRight', 'topLeft'],
        }}
        onChange={handleTableChange}
        rowKey="id" // Ensure data has unique "id"
        size="middle"
        expandable={expandable}
      />
    </>
  );
};

export default AdvanceTable;
