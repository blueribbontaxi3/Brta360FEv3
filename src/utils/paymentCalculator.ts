import dayjs from 'dayjs';
import {
  getDaysInYear,
  getDaysInMonth,
  getOverlappingDays,
  getMonthStart,
  getMonthEnd,
  formatDate
} from './dateUtils';

const MONTH_FORMAT = 'MMMM';

export const calculateMonthlyData = ({ startDate, endDate, amount }: any): any => {
  // Remove UTC conversion as it's causing issues with start of year
  const start = dayjs(startDate);
  const end = endDate ? dayjs(endDate) : start.endOf('year');
  const year = start.year();

  // Get total days in the year
  const totalYearDays = getDaysInYear(year);

  // Calculate per day amount based on total year days
  const perDayAmount = amount / totalYearDays;

  const monthlyData: any = [];
  // let totalPayableAmount = 0;
  //let fullMonthsCount = 0;

  // First pass: Calculate basic data and count full months
  for (let month = 0; month < 12; month++) {
    const monthStart = getMonthStart(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    const monthEnd = getMonthEnd(monthStart, daysInMonth);

    // Ensure proper day comparison by using startOf('day')
    const payableDays = getOverlappingDays(
      start.startOf('day'),
      end.startOf('day'),
      monthStart.startOf('day'),
      monthEnd.startOf('day')
    );

    const monthlyAmount = perDayAmount * daysInMonth;
    const payableAmount = perDayAmount * payableDays;

    // Count months with full payable days (excluding partial months)
    if (payableDays === daysInMonth) {
      //fullMonthsCount++;
    }

    //totalPayableAmount += payableAmount;

    monthlyData.push({
      key: String(month + 1),
      month: monthStart.format(MONTH_FORMAT),
      perAmount: monthlyAmount,
      totalDays: daysInMonth,
      perDayAmount: perDayAmount,
      startDate: formatDate(monthStart),
      endDate: formatDate(monthEnd),
      payableAmount,
      payableDaysCount: payableDays,
      payableStartDate: payableDays > 0 ? formatDate(dayjs.max(start, monthStart)) : 0,
      payableEndDate: payableDays > 0 ? formatDate(dayjs.min(end, monthEnd)) : 0,
      averageMonthlyPayable: 0 // Will be updated in second pass
    });
  }

  // Calculate base monthly amount for full months
  const monthlyBase = amount / 12;

  // Calculate total amount for full months
  //const fullMonthsTotal = monthlyBase * fullMonthsCount;

  // Find start and end partial months
  const startMonth = monthlyData.find((m: any) => m.payableDaysCount > 0 && m.payableDaysCount < m.totalDays);
  const endMonth = monthlyData.findLast((m: any) => m.payableDaysCount > 0 && m.payableDaysCount < m.totalDays);

  // Calculate partial months amounts
   const startMonthAmount = startMonth ? perDayAmount * startMonth.payableDaysCount : 0;
  // let startMonthAmount = endMonth && totalPayableAmount - (endMonth.payableAmount) - fullMonthsTotal;
  // if (startMonth && startMonth.payableDaysCount !== startMonth.totalDays && startMonth?.key === endMonth?.key) {
  //   startMonthAmount = totalPayableAmount - (monthlyBase * fullMonthsCount);
  // }

  const endMonthAmount = endMonth && endMonth !== startMonth ? perDayAmount * endMonth.payableDaysCount : 0;

  // console.log("endMonth", endMonth, endMonthAmount)
  // console.log("startMonthAmount", startMonth, startMonthAmount)
  // console.log("startMonth", startMonth, startMonthAmount)
  // console.log("fullMonthsTotal", fullMonthsTotal)
  // console.log("monthlyBase", monthlyBase)
  // console.log("fullMonthsCount", fullMonthsCount)
  // console.log("endMonth.payableAmount", endMonth.payableAmount)
  // console.log("totalPayableAmount", totalPayableAmount - (endMonth.payableAmount))
  // console.log("totalPayableAmount", totalPayableAmount - (endMonth.payableAmount) - fullMonthsTotal)

  // Second pass: Set average monthly payable
  return monthlyData.map((month: any) => {
    if (month === startMonth) {
      return {
        ...month,
        averageMonthlyPayable: startMonthAmount
      };
    } else if (month === endMonth && endMonth !== startMonth) {
      return {
        ...month,
        averageMonthlyPayable: endMonthAmount
      };
    } else if (month.payableDaysCount === month.totalDays) {
      return {
        ...month,
        averageMonthlyPayable: monthlyBase
      };
    }

    return {
      ...month,
      averageMonthlyPayable: 0
    };
  });
};