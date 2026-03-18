import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

// Enable the minMax plugin
dayjs.extend(minMax);
const DATE_FORMAT = 'MM-DD-YYYY';
export const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const getDaysInYear = (year: number): number => {
    return isLeapYear(year) ? 366 : 365;
};

export const getDaysInMonth = (year: number, month: number): number => {
    return dayjs(`${year}-${month + 1}-01`).daysInMonth();
};

export const getMonthStart = (year: number, month: number): dayjs.Dayjs => {
    return dayjs(`${year}-${month + 1}-01`);
};

export const getMonthEnd = (monthStart: dayjs.Dayjs, daysInMonth: number): dayjs.Dayjs => {
    return monthStart.add(daysInMonth - 1, 'day');
};

export const formatDate = (date: dayjs.Dayjs): string => {
    return date.format(DATE_FORMAT);
};

export const getOverlappingDays = (
    periodStart: dayjs.Dayjs,
    periodEnd: dayjs.Dayjs,
    monthStart: dayjs.Dayjs,
    monthEnd: dayjs.Dayjs
): number => {
    const start = dayjs.max(periodStart, monthStart);
    const end = dayjs.min(periodEnd, monthEnd);
    return Math.max(0, end.diff(start, 'day') + 1);
};

export const isValidDateRange = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) return false;

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Check if dates are valid and end is after start
    if (!start.isValid() || !end.isValid() || !end.isAfter(start)) {
        return false;
    }

    // Check if both dates are in the same year
    return start.year() === end.year();
};

