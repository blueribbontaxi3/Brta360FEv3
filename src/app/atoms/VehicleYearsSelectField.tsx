import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import { SelectField } from "./FormElement";



const VehicleYearsSelectField: React.FC<any> = (props) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);


    const fetch = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/vehicles/years/all`);
            setData(response?.data?.data?.items || []);
        } catch (error) {
            console.error("Error fetching years:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, []);


    return (
        <SelectField
            {...props}
            allowClear={true}
            iProps={{
                ...props.iProps,
                loading: loading,
                placeholder: 'Select Vehicle Year',
                size: 'large',
                optionFilterProp: "label"
            }}
            showSearch={true}

            options={data.map((item) => ({
                value: item.year,
                label: item.year,
            }))}
        />

    );
};

export default VehicleYearsSelectField;
