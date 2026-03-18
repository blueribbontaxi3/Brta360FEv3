import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Col, Tag, message } from 'antd';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Icon, { CarOutlined } from '@ant-design/icons';
import WheelChairIconCustomIcon from '../../assets/wheelchair.svg?react';
import type { GetProps } from 'antd';
import { SelectField } from './FormElement';

type CustomIconComponentProps = GetProps<typeof Icon>;

const WheelChairIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={WheelChairIconCustomIcon} {...props} />
}

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const MedallionNumberSelect: React.FC<any> = ({ control, errors, setMedallionNumberData, colProps, disabled, medallionWithAssign, renewInsuranceData, insuranceData, mode }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  let query = useQuery();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/medallions', {
        params: {
          pageSize: 99999,
          vehicleRequired: true,
          medallionWithAssign: medallionWithAssign,
          memberActive: true,
          corporationActive: true,
          page: query.get('page') ? query.get('page') : insuranceData?.medallion?.id ? 'renew_insurance' : '',
          medallionId: query.get('medallion_id') ?? insuranceData?.medallion?.id,
          medallionNumber: query.get('medallion_number') ?? insuranceData?.medallion?.medallionNumber

        },
      });
      const fetchedData = response?.data?.data?.items || [];
      setData(fetchedData);
      if (setMedallionNumberData) {
        setMedallionNumberData(fetchedData); // Pass data to parent
      }
    } catch (error) {
      console.error('Error fetching medallions:', error);
      message.error('Failed to fetch medallion numbers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [setMedallionNumberData, insuranceData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper to render option label
  const renderOptionLabel = (item: any) => (
    <>
      <Tag icon={item?.isWav ? <WheelChairIcon style={{ fontSize: '16px' }} /> : <CarOutlined />} color={item?.isWav ? "blue" : "green"}>{item.medallionNumber}</Tag> / {item.corporation?.corporationName || ''} /{' '}
      {item.corporation?.member?.fullName || ''}
    </>
  );

  // Memoized options for performance
  const options = useMemo(
    () =>
      data.map((item) => ({
        value: item.id,
        label: renderOptionLabel(item),
        searchText: [
          item.medallionNumber,
          item.corporation?.corporationName,
          item.corporation?.member?.fullName,
          item?.vehicle?.vehicleYear?.year,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
      })),
    [data]
  );

  return (
    <Col xs={24} sm={24} md={12} lg={8} xl={4} {...colProps}>
      <SelectField
        label="Medallion Number"
        fieldName="medallionNumberId"
        allowClear
        control={control}
        iProps={{
          loading,
          placeholder: 'Medallion Number',
          size: 'medium',
          filterOption: (input: string, option: any) =>
            option.searchText?.includes(input.toLowerCase()),
          mode: mode, // Passed from parent
        }}
        showSearch
        errors={errors}
        options={options}
        disabled={disabled || renewInsuranceData?.id}
      />
    </Col>
  );
};

export default MedallionNumberSelect;
