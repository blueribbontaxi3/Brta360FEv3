import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import { SelectField } from "./FormElement";



const MemberSelectField: React.FC<any> = (props) => {
    const [memberData, setMemberData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);


    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/member`, {
                params: {
                    pageSize: 99999,
                    status: 'active'
                }
            });
            setMemberData(response?.data?.data?.items || []);
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);


    return (
        <SelectField
            {...props}
            allowClear={true}
            iProps={{
                ...props.iProps,
                loading: loading,
                placeholder: 'Select Member',
                size: 'large',
                optionFilterProp: "label"
            }}
            showSearch={true}

            options={memberData.map((item) => ({
                value: item.id,
                label: item.fullName,
            }))}
        />

    );
};

export default MemberSelectField;
