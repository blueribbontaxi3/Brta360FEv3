import React, { useEffect, useState } from 'react';
import { Col } from 'antd';
import axios from 'axios';
import { useController } from 'react-hook-form';
import { SelectField } from './FormElement';

const DiscountSelect = ({ control, errors }: any) => {
  const [discountData, setDiscountData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch discounts
  const fetchDiscount = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/discounts', {
        params: {
          pageSize: 99999,
        },
      });
      setDiscountData(response?.data?.data?.items || []);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscount();
  }, []);

  return (
    <Col xs={24} sm={24} md={12} lg={8} xl={4}>
      <SelectField
        label="Discount"
        fieldName="discountId"
        allowClear={true}
        control={control}
        iProps={{
          loading: loading,
          placeholder: 'Discount',
          size: 'large',
        }}
        errors={errors}
        options={
          discountData.length > 0
            ? discountData.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))
            : []
        }
      />
    </Col>
  );
};

export default DiscountSelect;
