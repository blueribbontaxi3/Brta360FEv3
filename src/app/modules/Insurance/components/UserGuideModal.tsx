import React from 'react';
import { Alert, Button, Modal, Typography } from 'antd';

interface UserGuideModalProps {
    open: boolean;
    onClose: () => void;
}

const UserGuideModal: React.FC<UserGuideModalProps> = ({ open, onClose }) => {
    return (
        <Modal
            title="User Guide"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="close" type="primary" onClick={onClose}>
                    Close
                </Button>
            ]}
            width={'80%'}
            centered
        >
            <div style={{ padding: '16px 0' }}>
                <Typography.Title level={4}>Surrender Date Restrictions</Typography.Title>

                <Alert
                    message="Important Notice"
                    description={
                        <div>
                            <p style={{ marginBottom: '8px' }}>
                                If you are trying to surrender and all dates in the surrender date field are disabled except for <strong>21/12/2024</strong>, follow these steps:
                            </p>
                            <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '8px' }}>
                                    Click on the <strong>Detail</strong> button above the dropdown for <strong>Workman Comp</strong>, <strong>Collision</strong>, or <strong>Pace Program</strong>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    Check the end dates of these addons
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    If the end date is <strong>31-12-2024</strong> (or later), you <strong>cannot surrender before these dates</strong>
                                </li>
                                <li>
                                    You must wait until after the addon end dates to proceed with the surrender
                                </li>
                            </ul>
                        </div>
                    }
                    type="warning"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />

                <Alert
                    message="Disclaimer"
                    description="Surrender dates are automatically calculated based on addon coverage end dates. Please ensure all addon details are verified before attempting to surrender."
                    type="info"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />

                <Alert
                    message="Solution"
                    description={
                        <div>
                            <p style={{ marginBottom: '8px' }}>
                                If you want to enable surrender dates, follow these steps:
                            </p>
                            <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '8px' }}>
                                    Close this modal
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    Edit the insurance record
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    Click on the <strong>Detail</strong> button above <strong>Collision</strong>, <strong>Workman Comp</strong>, or <strong>Pace Program</strong>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    Check if there are end dates set
                                </li>
                                <li>
                                    If end dates exist, delete them to enable surrender dates
                                </li>
                            </ul>
                        </div>
                    }
                    type="success"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />

                <Typography.Title level={4}>Policy Number Errors</Typography.Title>

                <Alert
                    message="Policy Number Missing"
                    description={
                        <div>
                            <p style={{ marginBottom: '8px' }}>
                                If you are getting a policy-related error, please follow these steps:
                            </p>
                            <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>"Policy number is missing. Please edit the previous insurance to add it before renewing."</strong>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    Go to the <strong>Insurance</strong> module and find the previous insurance record
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    Click <strong>Edit</strong> on that insurance
                                </li>
                                <li>
                                    Add the missing <strong>Policy Number</strong> and save the record, then try renewing again
                                </li>
                            </ul>
                        </div>
                    }
                    type="error"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />

                <Typography.Title level={4}>Renew Errors - General Troubleshooting</Typography.Title>

                <Alert
                    message="Common Renewal Failures"
                    description={
                        <div>
                            <p style={{ marginBottom: '8px' }}>
                                If your renewal is failing, check the following:
                            </p>
                            <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '8px' }}>
                                    Ensure the <strong>previous insurance record is complete</strong> with all required fields
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    Check that the <strong>medallion is active</strong> and not surrendered
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    Verify the <strong>vehicle is still assigned</strong> to the medallion
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    Make sure there are <strong>no pending actions</strong> on the insurance
                                </li>
                                <li>
                                    If error persists, contact the administrator with the error message
                                </li>
                            </ul>
                        </div>
                    }
                    type="warning"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />

                <Typography.Title level={4}>Vehicle/VIN Issues</Typography.Title>

                <Alert
                    message="VIN Number Problems"
                    description={
                        <div>
                            <p style={{ marginBottom: '8px' }}>
                                If you encounter VIN-related errors:
                            </p>
                            <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>"VIN is missing"</strong> - Go to <strong>Vehicles</strong> module, find and edit the vehicle to add VIN
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>"VIN already exists"</strong> - The VIN is used by another vehicle, ensure you're using the correct one
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>"Invalid VIN format"</strong> - VIN must be exactly 17 characters (letters and numbers only)
                                </li>
                                <li>
                                    Ensure the vehicle is <strong>properly linked</strong> to the medallion before renewing
                                </li>
                            </ul>
                        </div>
                    }
                    type="error"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />

                <Typography.Title level={4}>Medallion Number Problems</Typography.Title>

                <Alert
                    message="Medallion Issues"
                    description={
                        <div>
                            <p style={{ marginBottom: '8px' }}>
                                For medallion-related errors:
                            </p>
                            <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>"Medallion not found"</strong> - Verify the medallion exists in the <strong>Medallions</strong> module
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>"Medallion is inactive"</strong> - Activate the medallion before proceeding with renewal
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>"Medallion already surrendered"</strong> - Surrendered medallions cannot be renewed
                                </li>
                                <li>
                                    Ensure the medallion has a <strong>valid vehicle assigned</strong> before renewal
                                </li>
                            </ul>
                        </div>
                    }
                    type="warning"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />

                <Typography.Title level={4}>Addon Coverage</Typography.Title>

                <Alert
                    message="Understanding Addons Impact on Renewal"
                    description={
                        <div>
                            <p style={{ marginBottom: '8px' }}>
                                Addons can affect your renewal process:
                            </p>
                            <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>Collision</strong> - Must have valid collision coverage dates for renewal
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>Workman Comp</strong> - Workers' compensation must be current
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>Pace Program</strong> - Pace program enrollment affects renewal options
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    Check the <strong>Detail</strong> button for each addon to view start/end dates
                                </li>
                                <li>
                                    Addon end dates determine the <strong>earliest possible surrender date</strong>
                                </li>
                            </ul>
                        </div>
                    }
                    type="info"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />

                <Typography.Title level={4}>Date Conflicts</Typography.Title>

                <Alert
                    message="Understanding Effective Dates and Renewal Timing"
                    description={
                        <div>
                            <p style={{ marginBottom: '8px' }}>
                                Date-related considerations for renewal:
                            </p>
                            <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>Effective Date</strong> - The date when the insurance coverage begins
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>Renewal Date</strong> - Typically one year after the effective date
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>Cannot renew early</strong> - Wait until the current coverage is near expiration
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <strong>Overlapping coverage</strong> - Ensure no gaps or overlaps between policy periods
                                </li>
                                <li>
                                    Check the <strong>Next Renew Year</strong> column to verify renewal timing
                                </li>
                            </ul>
                        </div>
                    }
                    type="success"
                    showIcon
                />
            </div>
        </Modal>
    );
};

export default UserGuideModal;
