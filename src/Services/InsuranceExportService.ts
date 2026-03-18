// services/InsuranceExportService.ts
import React from 'react';
import dayjs from 'dayjs';

export interface InsuranceData {
    totalPayableAmount: number;
    id: number;
    medallionNumber: number;
    requestDate: string;
    effectiveDate?: string;
    surrenderDate?: string;
    flatCancelDate?: string;
    policyNumberLiability: string;
    policyNumberWorkmanComp: string;
    flatCancelReason?: string;
    policyNumberCollision: string;
    noOfDays: number;
    affiliationAmount: string;
    affiliationPayableAmount: string;
    liabilityAmount: string;
    liabilityPayableAmount: string;
    workmanAmount?: string;
    workmanPayableAmount?: string;
    collisionAmount: string;
    collisionPayableAmount: string;
    paceProgramAmount?: string;
    paceProgramPayableAmount?: string;
    memberId: number;
    corporationId: number;
    vehicleId: number;
    parentId: number;
    discountId?: number;
    discountAmount: number;
    workmanComp?: string;
    collision: string;
    paceProgram?: string;
    status: string;
    isForceFullySurrender?: boolean;
    isShow: boolean;
    userId?: number;
    createdAt: string;
    updatedAt: string;
    corporation?: {
        isCmg: boolean;
        corporationName: string;
        affiliationId: number;
        memberId: number;
        discountId: number;
        member?: {
            fullName: string;
            id: number;
            firstName: string;
            middleName: string;
            lastName: string;
            emailAddress: string;
        };
        discount?: {
            id: number;
            name: string;
            amount: string;
        };
        affiliation?: {
            id: number;
            name: string;
        };
    };
    insuranceCoverage?: Array<{
        id: number;
        startDate: string;
        endDate: string;
        type: string;
        rate?: number;
        totalAmount: number;
        noOfDays: number;
        payableAmount: number;
    }>;
    vehicle?: {
        vinNumber: string;
        vehicleYear?: { year: string };
        vehicleModel?: { name: string };
        vehicleMake?: { name: string };
        vehicleType?: { name: string };
    };
    medallion?: {
        id: number;
        medallionNumber: number;
        isWav?: boolean;
    };
}

export interface CSVColumn {
    key: string;
    label: string;
    format?: (value: any) => string;
}

export class InsuranceExportService {

    /**
     * CSV formatters
     */
    static formatters = {
        currency: (value: any): string => {
            if (!value || isNaN(value)) return '';
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(parseFloat(value));
        },

        date: (value: any, format: any): string => {
            if (!value) return '';
            const date = dayjs(value);
            return date.isValid() ? date.format(format) : value;
        },

        number: (value: any): string => {
            if (!value || isNaN(value)) return '';
            return parseFloat(value).toFixed(2);
        },

        yesNo: (value: any): string => {
            if (typeof value === 'boolean') return value ? 'Yes' : 'No';
            return value || '';
        }
    };

    /**
     * Flatten complex insurance JSON to simple object
     */
    private static flattenInsuranceData(data: InsuranceData) {
        return {
            // Basic Info
            id: data.id,
            medallionNumber: data.medallionNumber,
            requestDate: data.requestDate,
            effectiveDate: data.effectiveDate || '',
            surrenderDate: data.surrenderDate || '',
            flatCancelDate: data.flatCancelDate || '',
            status: data.status,
            noOfDays: data.noOfDays,

            // Financial Info
            totalPayableAmount: data.totalPayableAmount,
            affiliationAmount: data.affiliationAmount,
            affiliationPayableAmount: data.affiliationPayableAmount,
            liabilityAmount: data.liabilityAmount,
            liabilityPayableAmount: data.liabilityPayableAmount,
            workmanAmount: data.workmanAmount || '',
            workmanPayableAmount: data.workmanPayableAmount || '',
            collisionAmount: data.collisionAmount,
            collisionPayableAmount: data.collisionPayableAmount,
            paceProgramAmount: data.paceProgramAmount || '',
            paceProgramPayableAmount: data.paceProgramPayableAmount || '',
            discountAmount: data.discountAmount,

            // Policy Info
            policyNumberLiability: data.policyNumberLiability,
            policyNumberWorkmanComp: data.policyNumberWorkmanComp,
            policyNumberCollision: data.policyNumberCollision,
            flatCancelReason: data.flatCancelReason || '',

            // Coverage Info
            workmanComp: data.workmanComp || '',
            collision: data.collision,
            paceProgram: data.paceProgram || '',

            // Corporation Info
            corporationName: data.corporation?.corporationName || '',
            isCmg: data.corporation?.isCmg || false,
            memberFullName: data.corporation?.member?.fullName || '',
            memberFirstName: data.corporation?.member?.firstName || '',
            memberMiddleName: data.corporation?.member?.middleName || '',
            memberLastName: data.corporation?.member?.lastName || '',
            memberEmail: data.corporation?.member?.emailAddress || '',
            discountName: data.corporation?.discount?.name || '',
            discountAmountFromCorp: data.corporation?.discount?.amount || '',
            affiliationName: data.corporation?.affiliation?.name || '',

            // Vehicle Info
            vinNumber: data.vehicle?.vinNumber || '',
            vehicleYear: data.vehicle?.vehicleYear?.year || '',
            vehicleMake: data.vehicle?.vehicleMake?.name || '',
            vehicleModel: data.vehicle?.vehicleModel?.name || '',
            vehicleType: data.vehicle?.vehicleType?.name || '',

            // Additional Info
            memberId: data.memberId,
            corporationId: data.corporationId,
            vehicleId: data.vehicleId,
            parentId: data.parentId,
            discountId: data.discountId || '',
            isForceFullySurrender: data.isForceFullySurrender || false,
            isShow: data.isShow,
            userId: data.userId || '',

            // Timestamps
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };
    }

    /**
     * CSV value ko properly escape kar
     */
    private static escapeCSVValue(value: any): string {
        if (value === null || value === undefined) {
            return '';
        }

        const strValue = String(value);

        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
            return `"${strValue.replace(/"/g, '""')}"`;
        }

        return strValue;
    }

    /**
     * CSV file download kar
     */
    private static downloadCSV(csvContent: string, filename: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const bom = '\uFEFF';
                const blob = new Blob([bom + csvContent], {
                    type: 'text/csv;charset=utf-8;'
                });

                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);

                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';

                document.body.appendChild(link);

                // Simulate async operation
                setTimeout(() => {
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    console.log(`✅ Insurance CSV downloaded: ${filename}`);
                    resolve();
                }, 100); // Small delay to show loader

            } catch (error) {
                console.error('Error downloading CSV:', error);
                reject(error);
            }
        });
    }

    /**
   * Generic CSV export function - Promise return karta hai
   */
    private static async exportToCSV(data: any[], columns: CSVColumn[], filename: string): Promise<void> {
        if (!data || data.length === 0) {
            throw new Error('No data to export');
        }

        // Simulate processing time for large datasets
        if (data.length > 100) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        let csvContent = '';

        // Headers
        const headers = columns.map(col => col.label);
        csvContent += headers.join(',') + '\n';

        // Data rows
        data.forEach(row => {
            const values = columns.map(col => {
                let value = row[col.key];

                if (col.format) {
                    value = col.format(value);
                }

                return this.escapeCSVValue(value);
            });

            csvContent += values.join(',') + '\n';
        });

        // Download and return promise
        await this.downloadCSV(csvContent, filename);
    }

    /**
     * 1. Main Insurance Data Export
     */
    static async exportMainData(data: InsuranceData | InsuranceData[], filename?: string): Promise<void> {
        const dataArray = Array.isArray(data) ? data : [data];
        const flatData = dataArray.map(item => this.flattenInsuranceData(item));

        const columns: CSVColumn[] = [
            { key: 'date', label: 'Today Date' },
            { key: 'medallionNumber', label: 'CAB' },
            { key: 'corporationName', label: 'CORP Name' },
            { key: 'memberFullName', label: 'Registered Name' },
            { key: 'address', label: 'Address' },
            { key: 'city_st_zip', label: 'City, ST, Zip' },
            { key: 'newVehicle', label: 'New VEHICLE' },
            { key: 'newVinNumber', label: 'New VIN' },
            { key: 'oldVehicle', label: 'OLD VEHICLE' },
            { key: 'oldVinNumber', label: 'OLD VIN' },
            {
                key: 'requestDate', label: 'Request Date',
                format: (value) => this.formatters.date(value, 'MM-DD-YYYY')
            },
            {
                key: 'effectiveDate',
                label: 'Effective Date',
                format: (value) => this.formatters.date(value, 'MM-DD-YYYY')

            },
            { key: 'policyNumberLiability', label: 'Liability Policy Number' },
            { key: 'policyNumberWorkmanComp', label: 'WC Policy Number' },
            { key: 'policyNumberCollision', label: 'Collision Policy Number' },
        ];

        const exportFilename = filename || `insurance_main_data_${new Date().toISOString().split('T')[0]}.csv`;
        await this.exportToCSV(flatData, columns, exportFilename);
    }

    /**
     * 2. Financial Summary Export
     */
    static exportFinancialSummary(data: InsuranceData | InsuranceData[], filename?: string): void {
        const dataArray = Array.isArray(data) ? data : [data];
        const flatData = dataArray.map(item => this.flattenInsuranceData(item));

        const columns: CSVColumn[] = [
            { key: 'id', label: 'Insurance ID' },
            { key: 'medallionNumber', label: 'Medallion Number' },
            { key: 'corporationName', label: 'Corporation Name' },
            {
                key: 'totalPayableAmount',
                label: 'Total Payable Amount',
                format: this.formatters.currency
            },
            {
                key: 'affiliationAmount',
                label: 'Affiliation Amount',
                format: this.formatters.currency
            },
            {
                key: 'affiliationPayableAmount',
                label: 'Affiliation Payable Amount',
                format: this.formatters.currency
            },
            {
                key: 'liabilityAmount',
                label: 'Liability Amount',
                format: this.formatters.currency
            },
            {
                key: 'liabilityPayableAmount',
                label: 'Liability Payable Amount',
                format: this.formatters.currency
            },
            {
                key: 'collisionAmount',
                label: 'Collision Amount',
                format: this.formatters.currency
            },
            {
                key: 'collisionPayableAmount',
                label: 'Collision Payable Amount',
                format: this.formatters.currency
            },
            {
                key: 'workmanAmount',
                label: 'Workman Amount',
                format: this.formatters.currency
            },
            {
                key: 'workmanPayableAmount',
                label: 'Workman Payable Amount',
                format: this.formatters.currency
            },
            {
                key: 'discountAmount',
                label: 'Discount Amount',
                format: this.formatters.currency
            },
            { key: 'discountName', label: 'Discount Type' }
        ];

        const exportFilename = filename || `insurance_financial_summary_${new Date().toISOString().split('T')[0]}.csv`;
        this.exportToCSV(flatData, columns, exportFilename);
    }

    /**
     * 3. Insurance Coverage Details Export
     */
    static exportCoverageDetails(data: InsuranceData | InsuranceData[], filename?: string): void {
        const dataArray = Array.isArray(data) ? data : [data];

        const coverageData: any[] = [];
        dataArray.forEach(item => {
            if (item.insuranceCoverage && item.insuranceCoverage.length > 0) {
                item.insuranceCoverage.forEach(coverage => {
                    coverageData.push({
                        insuranceId: item.id,
                        medallionNumber: item.medallionNumber,
                        corporationName: item.corporation?.corporationName || '',
                        memberFullName: item.corporation?.member?.fullName || '',
                        coverageId: coverage.id,
                        coverageType: coverage.type,
                        startDate: coverage.startDate,
                        endDate: coverage.endDate,
                        rate: coverage.rate || 0,
                        totalAmount: coverage.totalAmount,
                        noOfDays: coverage.noOfDays,
                        payableAmount: coverage.payableAmount
                    });
                });
            }
        });

        const columns: CSVColumn[] = [
            { key: 'insuranceId', label: 'Insurance ID' },
            { key: 'medallionNumber', label: 'Medallion Number' },
            { key: 'corporationName', label: 'Corporation Name' },
            { key: 'memberFullName', label: 'Member Full Name' },
            { key: 'coverageId', label: 'Coverage ID' },
            { key: 'coverageType', label: 'Coverage Type' },
            { key: 'startDate', label: 'Start Date' },
            { key: 'endDate', label: 'End Date' },
            { key: 'rate', label: 'Rate' },
            {
                key: 'totalAmount',
                label: 'Total Amount',
                format: this.formatters.currency
            },
            { key: 'noOfDays', label: 'Number of Days' },
            {
                key: 'payableAmount',
                label: 'Payable Amount',
                format: this.formatters.currency
            }
        ];

        const exportFilename = filename || `insurance_coverage_details_${new Date().toISOString().split('T')[0]}.csv`;
        this.exportToCSV(coverageData, columns, exportFilename);
    }

    /**
     * 4. Policy Information Export
     */
    static exportPolicyInfo(data: InsuranceData | InsuranceData[], filename?: string): void {
        const dataArray = Array.isArray(data) ? data : [data];
        const flatData = dataArray.map(item => this.flattenInsuranceData(item));

        const columns: CSVColumn[] = [
            { key: 'id', label: 'Insurance ID' },
            { key: 'medallionNumber', label: 'Medallion Number' },
            { key: 'corporationName', label: 'Corporation Name' },
            { key: 'policyNumberLiability', label: 'Liability Policy Number' },
            { key: 'policyNumberWorkmanComp', label: 'Workman Comp Policy Number' },
            { key: 'policyNumberCollision', label: 'Collision Policy Number' },
            { key: 'workmanComp', label: 'Workman Comp Status' },
            { key: 'collision', label: 'Collision Status' },
            { key: 'paceProgram', label: 'Pace Program Status' },
            { key: 'flatCancelReason', label: 'Flat Cancel Reason' },
            { key: 'flatCancelDate', label: 'Flat Cancel Date' },
            { key: 'surrenderDate', label: 'Surrender Date' },
            {
                key: 'isForceFullySurrender',
                label: 'Force Fully Surrender',
                format: this.formatters.yesNo
            }
        ];

        const exportFilename = filename || `insurance_policy_info_${new Date().toISOString().split('T')[0]}.csv`;
        this.exportToCSV(flatData, columns, exportFilename);
    }

    /**
     * 5. Complete Export (All Fields)
     */
    static exportComplete(data: InsuranceData | InsuranceData[], filename?: string): void {
        const dataArray = Array.isArray(data) ? data : [data];
        const flatData = dataArray.map(item => this.flattenInsuranceData(item));

        // All fields ke saath columns (automatic generation)
        const firstItem = flatData[0];
        const columns: CSVColumn[] = Object.keys(firstItem).map(key => ({
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
        }));

        const exportFilename = filename || `insurance_complete_data_${new Date().toISOString().split('T')[0]}.csv`;
        this.exportToCSV(flatData, columns, exportFilename);
    }

    /**
     * 6. Custom Export with user-defined columns
     */
    static exportCustom(
        data: InsuranceData | InsuranceData[],
        columns: CSVColumn[],
        filename: string
    ): void {
        const dataArray = Array.isArray(data) ? data : [data];
        const flatData = dataArray.map(item => this.flattenInsuranceData(item));

        this.exportToCSV(flatData, columns, filename);
    }
}