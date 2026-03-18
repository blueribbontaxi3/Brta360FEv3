import React, { useEffect, useState } from "react";
import {
    Switch,
    Space,
    Typography,
    Tooltip,
    Modal,
    Descriptions,
    Tag,
    Checkbox,
    Radio,
} from "antd";
import {
    CheckCircleTwoTone,
    CloseCircleTwoTone,
    InfoCircleOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { affiliationGroupByYear, usdFormat } from "utils/helper";
import _ from "lodash";
import { calculateMonthlyData } from "utils/paymentCalculator";

const { Text } = Typography;

const InsuranceAddonCheckbox = ({ data, setValue, renewInsuranceModal }: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAddon, setSelectedAddon] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [collisionRateOption, setCollisionRateOption]: any = useState([])
    const [collisionRateSelected, setCollisionRateSelected]: any = useState(0)

    useEffect(() => {
        if (!data) return;

        const isWorkManComp = data?.workmanComp === "Added";
        const hasMultipleMedallions = data?.corporation?.corpMedallion?.length > 1;
        const isCollision = data?.collision === "Added";
        const isPaceProgram = data?.paceProgram === "Added" && data?.paceProgramRate !== null;
        const isCmg = !data?.corporation?.isCmg;

        const tempItems: any[] = [
            { label: "Liability", checked: true, disabled: true },
            { label: "Affiliation", checked: true, disabled: true },
            {
                label: "Workers Comp",
                checked: isWorkManComp,
                disabled: hasMultipleMedallions,
                helpText: "Workman is applied automatically if a corporation has multiple medallions.",
            },
            {
                label: "Collision",
                checked: isCollision,
                disabled: data?.collisionRates == null,
                helpText: data?.collisionRates == null
                    ? `Collision can’t be added because collision rates are not available for the year ${effectiveDate.year() + 1}.`
                    : null,
            },
            isCmg && {
                label: "Pace Program",
                checked: isPaceProgram,
                disabled: data?.paceProgramRate == null,
                helpText: data?.paceProgramRate == null
                    ? `You can’t add the Pace Program — rates for ${effectiveDate.year() + 1} are missing.`
                    : null,
            }
        ].filter(Boolean);

        setItems(tempItems);


    }, [data]);

    const onChange: any = (checkedValues: any) => {
        setCollisionRateSelected(checkedValues?.target?.value)
    };



    const effectiveDate = dayjs(data?.effectiveDate);
    const startDate = dayjs().year(effectiveDate.year() + 1).startOf("year");
    const endDate = dayjs().year(effectiveDate.year() + 1).endOf("year");
    const numberOfDays = endDate.diff(startDate, "day") + 1;
    const prices: any = affiliationGroupByYear(data?.corporation?.affiliation?.prices || [])
        .find((value: any) => value?.year === startDate.year());

    useEffect(() => {
        const collisionAllData = _.orderBy(
            data?.insuranceCoverage || [],
            ["id"],
            ["desc"]
        ).filter((i: any) => i.type === "collision");

        const collisionLastDataRate = collisionAllData?.[0]?.rate;
        const collisionRates = data?.collisionRates?.collisionRates || [];

        let selectedRate = collisionRates.find(
            (i: any) => Number(i.collisionType) === Number(collisionLastDataRate)
        );

        setCollisionRateSelected(String(selectedRate?.collisionType || 500))
    }, [])

    useEffect(() => {


        let attachmentFileId = data?.media_relations?.find((item: any) => item.collection == 'attachmentFile')?.media?.id;
        setValue('attachmentFile', attachmentFileId);

        let liabilityFileId = data?.media_relations?.find((item: any) => item.collection == 'liabilityFile')?.media?.id;
        setValue('liabilityFile', liabilityFileId);

        setValue('memberId', data?.memberId);
        setValue('policyNumberCollision', data?.policyNumberCollision);
        setValue('policyNumberLiability', data?.policyNumberLiability);
        setValue('policyNumberWorkmanComp', data?.policyNumberWorkmanComp);
        setValue('corporationId', data?.corporationId);
        setValue('discountId', data?.corporation?.discount?.id);
        setValue('medallionNumber', data?.medallionNumber);
        setValue('medallionNumberId', data?.medallion?.id);
        setValue('parentId', data?.id);
        setValue('vehicleId', data?.vehicleId);
        setValue('requestDate', startDate.format('MM-DD-YYYY'));
        setValue('effectiveDate', startDate.format('MM-DD-YYYY'));

        let collisionRate = data?.collisionRates?.collisionRates?.map((item: any) => {
            return { label: item?.collisionType, value: item?.collisionType }
        })
        setCollisionRateOption(collisionRate)

        const affiliationPriceResult = calculateMonthlyData({
            startDate: startDate,
            endDate: endDate,
            amount: Number(prices?.affiliation?.sellingPrice - (data?.corporation?.discount?.amount || 0)),
        });

        const liabilityPriceResult = calculateMonthlyData({
            startDate: startDate,
            endDate: endDate,
            amount: Number(prices?.liability?.sellingPrice),
        });

        const totalPayableAffiliationAmount = affiliationPriceResult?.reduce((sum: any, item: any) => sum + item.payableAmount, 0) || 0;
        const totalAffiliationAmount = Number(prices?.affiliation?.sellingPrice || 0);

        const totalPayableLiabilityAmount = liabilityPriceResult?.reduce((sum: any, item: any) => sum + item.payableAmount, 0) || 0;
        const totalLiabilityAmount = Number(prices?.liability?.sellingPrice || 0);

        setValue('liabilityRate', {
            totalLiabilityAmount,
            totalPayableLiabilityAmount,
        });
        setValue('affiliationRate', {
            affiliationAmount: totalAffiliationAmount,
            payableAffiliationAmount: totalPayableAffiliationAmount,
            discount: (data?.corporation?.discount?.amount || 0),
            affiliationAmountAfterDiscount: Number(totalAffiliationAmount - (data?.corporation?.discount?.amount || 0))
        });
        setValue(
            'noOfDays',
            numberOfDays
        );

        const checkedLabels = items
            .filter((item: any) => item.checked);
        setValue('workmanCompRates', null);
        setValue('workmanAmount', null)
        setValue('workmanComp', null)
        setValue('workmanPayableAmount', null)

        if (checkedLabels.find((item: any) => item.label == 'Workers Comp')?.checked) {
            setValue('workmanCompRates', {
                daysCount: numberOfDays,
                totalPayableAmount: prices?.workman?.sellingPrice,
                totalAmount: prices?.workman?.sellingPrice || 0,
                workManCompStartDate: startDate?.format('MM-DD-YYYY'),
                workManCompEndDate: endDate?.format('MM-DD-YYYY'),
            });

            setValue('workmanAmount', prices?.workman?.sellingPrice)
            setValue('workmanComp', 'Added')
            setValue('workmanPayableAmount', prices?.workman?.sellingPrice)
        }


        setValue('collisionRates', null);
        setValue('collisionAmount', null)
        setValue('collision', null)
        setValue('collisionPayableAmount', null)

        if (checkedLabels.find((item: any) => item.label == 'Collision')?.checked) {

            const collisionSingleData = data?.collisionRates?.collisionRates.find((item: any) => item?.collisionType == collisionRateSelected)


            const isWav = data?.medallion.isWav;
            let collisionTotalAmount = collisionSingleData?.deductibleAmbRate;
            if (isWav) {
                collisionTotalAmount = collisionSingleData?.deductibleWavRate;
            }

            setValue('collisionRates', {
                daysCount: numberOfDays,
                totalPayableAmount: collisionTotalAmount,
                totalAmount: collisionTotalAmount,
                collisionRate: collisionRateSelected,
                collisionStartDate: startDate?.format('MM-DD-YYYY'),
                collisionEndDate: endDate?.format('MM-DD-YYYY'),
            });

            setValue('collisionAmount', collisionTotalAmount)
            setValue('collision', 'Added')
            setValue('collisionPayableAmount', collisionTotalAmount)
        }


        setValue('paceProgramRates', null);
        setValue('paceProgramAmount', null)
        setValue('paceProgram', null)
        setValue('paceProgramPayableAmount', null)

        if (checkedLabels.find((item: any) => item.label == 'Pace Program')?.checked) {

            const paceProgramAmount = data?.paceProgramRate?.amount
            setValue('paceProgramRates', {
                daysCount: numberOfDays,
                totalPayableAmount: paceProgramAmount,
                totalAmount: paceProgramAmount || 0,
                paceProgramStartDate: startDate?.format('MM-DD-YYYY'),
                paceProgramEndDate: endDate?.format('MM-DD-YYYY'),
            });

            setValue('paceProgramAmount', paceProgramAmount)
            setValue('paceProgram', 'Added')
            setValue('paceProgramPayableAmount', paceProgramAmount)
        }



    }, [data, renewInsuranceModal, items, collisionRateSelected])

    const getAddonContent = (addon: any) => {
        if (!addon) return null;

        let sellingPrice = 0;
        let discountAmount = 0;
        let collisionRate: number | false = false;

        switch (addon.label) {
            case "Liability":
                sellingPrice = prices?.liability?.sellingPrice || 0;
                break;
            case "Affiliation":
                sellingPrice = prices?.affiliation?.sellingPrice || 0;
                discountAmount = data?.corporation?.discount?.amount || 0;
                break;
            case "Workers Comp":
                sellingPrice = prices?.workman?.sellingPrice || 0;
                break;
            case "Pace Program":
                sellingPrice = data?.paceProgramRate?.amount || 0;
                break;
            case "Collision":
                const collisionAllData = _.orderBy(
                    data?.insuranceCoverage || [],
                    ["id"],
                    ["desc"]
                ).filter((i: any) => i.type === "collision");

                const collisionLastDataRate = collisionAllData?.[0]?.rate;
                const collisionRates = data?.collisionRates?.collisionRates || [];

                let selectedRate = collisionRates.find(
                    (i: any) => Number(i.collisionType) === Number(collisionRateSelected || collisionLastDataRate)
                );


                if (!selectedRate && collisionRates.length) {
                    selectedRate = collisionRates[0];
                }

                sellingPrice = selectedRate?.deductibleAmbRate || 0;
                collisionRate = selectedRate?.collisionType || false;
                break;
        }

        return (
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Start Date">
                    <Text>{startDate.format("MM-DD-YYYY")}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="End Date">
                    <Text>{endDate.format("MM-DD-YYYY")}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="No of Days">
                    <Text>{numberOfDays}</Text>
                </Descriptions.Item>
                {collisionRate && (
                    <Descriptions.Item label="Rate">
                        <Tag color="cyan">{collisionRate}</Tag>
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="Total Amount">
                    <Tag color="blue-inverse">{usdFormat(sellingPrice)}</Tag>
                </Descriptions.Item>
                {addon.label === "Affiliation" && discountAmount && (
                    <Descriptions.Item label="Discount">
                        <Tag color="gold-inverse">{usdFormat(discountAmount)}</Tag>
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="Payable Amount">
                    <Tag color="green-inverse">
                        {usdFormat(sellingPrice - discountAmount)}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>
        );
    };

    useEffect(() => {
        console.log("==========", collisionRateSelected)
    }, [collisionRateSelected])

    const handleToggle = (index: number) => {
        const updated = [...items];
        updated[index].checked = !updated[index].checked;
        setItems(updated);
    };

    const handleViewDetails = (addon: any) => {
        setSelectedAddon(addon);
        setModalVisible(true);
    };



    return (
        <>
            <Space direction="vertical">
                {items.map((item: any, index: number) => (
                    <Space key={index} align="center">
                        <Switch
                            checked={item.checked}
                            onChange={() => handleToggle(index)}
                            disabled={item.disabled}
                        />
                        {item.checked ? (
                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                        ) : (
                            <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                        )}
                        <Text>{item.label}</Text>

                        {item.disabled && (
                            <Tooltip
                                title={item.helpText || `${item.label} is mandatory`}
                            >
                                <InfoCircleOutlined
                                    style={{ color: item.helpText ? "red" : "#bfbfbf" }}
                                />
                            </Tooltip>
                        )}
                        {
                            item.label == 'Collision' && item.checked && collisionRateSelected && <>
                                <Radio.Group size="small" options={collisionRateOption} value={collisionRateSelected} onChange={onChange} optionType="button" />
                            </>
                        }
                        {item.checked && (
                            <Tooltip title="View details">
                                <EyeOutlined
                                    style={{ color: "#1890ff", cursor: "pointer" }}
                                    onClick={() => handleViewDetails(item)}
                                />
                            </Tooltip>
                        )}
                    </Space>
                ))}
            </Space>

            <Modal
                open={modalVisible}
                title={selectedAddon?.label}
                footer={null}
                destroyOnClose
                centered
                onCancel={() => setModalVisible(false)}
            >
                {getAddonContent(selectedAddon)}
            </Modal>
        </>
    );
};

export default InsuranceAddonCheckbox;
