import React, { useEffect, useState, useMemo } from "react";
import { Col, Tooltip, Space } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { SelectField } from "@atoms/FormElement";
import { getValue } from "@testing-library/user-event/dist/utils";

const findUsersByRoles = (users: any, roleIds: number[]): any => {
    return users.filter((user: any) =>
        user.roles.some((role: any) => roleIds.includes(role.id))
    );
};

const OfficerCard: React.FC<any> = ({
    setValue,
    control,
    errors,
    setOpen,
    setModalTitle,
    memberUserData,
    setOfficerSelectValue,
    getValues,
    watch,
    corporationData
}) => {
    const [officerData, setOfficerData] = useState({
        agents: [],
        presidents: [],
        signers: [],
        secretaries: [],
    });

    useEffect(() => {
        const roles = ['agent', 'signer', 'secretary', 'president'];
        roles.forEach((role) => {
            const userId = corporationData?.officers?.find((officer: any) => officer?.role === role)?.userId;
            setValue(`${role}Id`, userId);
        });
    }, [corporationData, setValue]);

    useEffect(() => {
        if (memberUserData.length > 0) {
            setOfficerData({
                agents: findUsersByRoles(memberUserData, [3]),
                presidents: findUsersByRoles(memberUserData, [4]),
                signers: findUsersByRoles(memberUserData, [5]),
                secretaries: findUsersByRoles(memberUserData, [6]),
            });
        }
    }, [memberUserData]);

    const handleEdit = (fieldName: string, title: string) => {
        setOpen(true);
        const value = `edit ${fieldName}`;
        setOfficerSelectValue([value, getValues(fieldName)]); // Ensure value matches expectations
        setModalTitle(title);
    };

    const handleCreate = (fieldName: string, title: string) => {
        setOpen(true);
        const value = `create ${fieldName}`;
        setOfficerSelectValue(null); // Ensure value matches expectations
        setModalTitle(title);
    };

    const renderLabelWithIcons = (
        label: string,
        fieldName: string,
        title: string
    ) => {
        const fieldValue = watch(fieldName);
        const agentId = watch('agentId');

        const shouldShowEdit =
            fieldValue &&
            !(fieldName === 'agentId' && (agentId === 144 || agentId === 143));


        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <span>{label}</span>
                <Space>
                    {shouldShowEdit && (
                        <Tooltip title={`Edit ${label}`}>
                            <EditOutlined
                                onClick={() => handleEdit(fieldName, title)}
                                style={{ cursor: "pointer" }}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title={`Create ${label}`}>
                        <PlusOutlined
                            onClick={() => handleCreate(fieldName, title)}
                            style={{ cursor: "pointer" }}
                        />
                    </Tooltip>
                </Space>
            </div>
        );
    };


    const officerFields = useMemo(() => {
        return [
            {
                label: "Agent Name",
                fieldName: "agentId",
                title: "Agent",
                data: officerData.agents,
            },
            {
                label: "President's Name",
                fieldName: "presidentId",
                title: "President",
                data: officerData.presidents,
            },
            {
                label: "Signer Name",
                fieldName: "signerId",
                title: "Signer",
                data: officerData.signers,
            },
            {
                label: "Secretary Name",
                fieldName: "secretaryId",
                title: "Secretary",
                data: officerData.secretaries,
            },
        ];
    }, [officerData]);

    return (
        <>
            {officerFields.map(({ label, fieldName, title, data }) => (
                <Col xs={24} sm={24} md={12} lg={8} xl={4} key={fieldName}>
                    <SelectField
                        label={renderLabelWithIcons(label, fieldName, title)}
                        fieldName={fieldName}
                        allowClear={true}
                        control={control}
                        iProps={{
                            placeholder: `Select ${label}`,
                            size: "large",
                        }}
                        classes={"officers-select-items"}
                        errors={errors}
                        options={data.map((item: any) => ({
                            value: item.id,
                            label: item.name,
                        }))}
                    />
                </Col>
            ))}
        </>
    );
};

export default OfficerCard;
