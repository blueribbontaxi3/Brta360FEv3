import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import axios from 'axios';
import { useController } from 'react-hook-form';
import { SelectField } from './FormElement';

const CorporationTypeAndSubTypeSelect = ({ control, setValue, watch, getValues, data, errors }: any) => {
    const [corporationTypeData, setCorporationTypeData] = useState([]);
    const [corporationSubTypeData, setCorporationSubTypeData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Corporation Types
    const fetchCorporationTypes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/corporation-types', {
                params: {
                    pageSize: 99999,
                },
            });
            setCorporationTypeData(response?.data?.data?.items || []);
        } catch (error) {
            console.error('Error fetching corporation-types:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCorporationTypes();
    }, []);

    // Update Corporation Sub Type when Corporation Type changes
    useEffect(() => {
        const corporationTypeId = getValues('corporationTypeId');
        setCorporationSubTypeData([]);

        if (corporationTypeId) {
            setCorporationSubTypeData(
                corporationTypeData.filter((item: any) => item.parentId === corporationTypeId)
            );
            setValue('corporationSubTypeId', parseInt(data?.corporationSubTypeId)); // Reset sub-type when the main type changes
        }
    }, [watch('corporationTypeId')]);

    return (
        <>
            {/* Corporation Type Select */}
            <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                <SelectField
                    label="Corporation Type"
                    fieldName="corporationTypeId"
                    allowClear={true}
                    control={control}
                    iProps={{
                        loading: loading,
                        placeholder: 'Corporation Type',
                        size: 'large',
                    }}
                    errors={errors}
                    options={
                        corporationTypeData.length > 0
                            ? corporationTypeData
                                .filter((item: any) => item.parentId === null)
                                .map((item: any) => ({
                                    value: item.id,
                                    label: item.corpType,
                                }))
                            : []
                    }
                />
            </Col>
            {/* Corporation Sub Type Select */}
            <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                {
                    corporationSubTypeData.length > 0 &&

                    <SelectField
                        label="Corporation Sub Type"
                        fieldName="corporationSubTypeId"
                        allowClear={true}
                        control={control}
                        iProps={{
                            placeholder: 'Corporation Sub Type',
                            size: 'large',
                        }}
                        errors={errors}
                        options={
                            corporationSubTypeData.length > 0
                                ? corporationSubTypeData.map((item: any) => ({
                                    value: item.id,
                                    label: item.corpType,
                                }))
                                : []
                        }
                    />
                }
            </Col>
        </>
    );
};

export default CorporationTypeAndSubTypeSelect;
