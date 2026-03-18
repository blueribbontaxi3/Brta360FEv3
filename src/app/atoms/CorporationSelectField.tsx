import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import { SelectField } from "./FormElement";



const CorporationSelectField: React.FC<any> = (props) => {

    const { excludeIds, refetch } = props;
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);


    const fetch = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/corporations`, {
                params: {
                    pageSize: 99999,
                    status: 'active'
                }
            });
            if (excludeIds && excludeIds.length > 0) {
                setData(
                    response?.data?.data?.items.filter((item: any) => !excludeIds.includes(item.id)) || []
                );
            } else {
                setData(
                    response?.data?.data?.items
                );
            }

        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, [excludeIds]);


    return (
        <SelectField
            {...props}
            allowClear={true}
            iProps={{
                ...props.iProps,
                loading: loading,
                placeholder: 'Select Corporation',
                size: 'large',
                optionFilterProp: "label"
            }}
            showSearch={true}

            options={data.map((item) => ({
                value: item.id,
                label: item.corporationName,
            }))}
        />

    );
};

export default CorporationSelectField;
