import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button, Input, DatePicker, Table, Modal, Select } from 'antd';
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
      <div className="table-toolbar">
        {onDelete && (
          <div className="toolbar-actions">
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
          </div>
        )}

        {handleDateRange && (
          <div className="toolbar-item">
            <RangePicker
                allowClear
                style={{ width: '100%' }}
                onChange={handleDateRange}
                aria-label="Filter by date range"
                placeholder={['Start date', 'End date']}
                format={'MM-DD-YYYY'}
                renderExtraFooter={() => rangePickerRenderExtraFooter}
              />
          </div>
        )}
        {extraFilters}
        {status !== false &&
          <div className="toolbar-item toolbar-item--compact">
            <Select
              onChange={handleStatusFilter}
              options={statuses()}
              placeholder="Select a status"
              allowClear
              style={{ width: '100%' }}
              showSearch
              aria-label="Filter by status"
            />
          </div>
        }
        {searchFilter !== false &&
          <div className="toolbar-item">
            <Search
              placeholder="Search..."
              allowClear
              onSearch={handleSearchFilter}
              enterButton
              aria-label="Search data"
            />
          </div>
        }
      </div>

      {/* Table */}
      <Table
        scroll={{ x: 'max-content' }} // or x: 1000
        dataSource={data}
        columns={columns}
        rowSelection={onDelete ? { type: 'checkbox', ...rowSelection, onSelectAll: onSelectAll, onSelectNone: onSelectNone, onSelectInvert: onSelectInvert } : undefined}
        loading={loading}
        pagination={{
          ...tableParams?.pagination,
          pageSizeOptions,
          showSizeChanger: true,
          showQuickJumper: true,
          size: 'default',
          showTotal: (total) => `Total ${total} items`,
          position: ['bottomRight'],
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
