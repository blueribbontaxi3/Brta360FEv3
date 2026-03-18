import React, { useEffect, useState } from 'react';
import { Col } from 'antd';
import axios from 'axios';
import { useController } from 'react-hook-form';
import { SelectField } from './FormElement';

const AffiliationSelect = ({ control, errors }: any) => {
  const [affiliationData, setAffiliationData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch affiliations
  const fetchAffiliations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/affiliations', {
        params: {
          pageSize: 99999,
        },
      });
      setAffiliationData(response?.data?.data?.items || []);
    } catch (error) {
      console.error('Error fetching affiliations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliations();
  }, []);

  return (
    <Col xs={24} sm={24} md={12} lg={8} xl={4}>
      <SelectField
        label="Affiliation"
        fieldName="affiliationId"
        allowClear={true}
        control={control}
        iProps={{
          loading: loading,
          placeholder: 'Affiliation',
          size: 'large',
        }}
        errors={errors}
        options={
          affiliationData.length > 0
            ? affiliationData.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))
            : []
        }
      />
    </Col>
  );
};

export default AffiliationSelect;
