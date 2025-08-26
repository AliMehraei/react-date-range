/**
 * Persian Calendar Utilities
 * Provides functions for converting between Gregorian and Persian calendar dates
 */

// Persian calendar constants
const PERSIAN_EPOCH = 1948320.5; // Julian day number of 1 Farvardin 1 AP
const GREGORIAN_EPOCH = 1721425.5; // Julian day number of 1 January 1 AD

// Persian month lengths in leap and non-leap years
const PERSIAN_MONTH_LENGTHS = [
  31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30
];

/**
 * Check if a Persian year is a leap year
 * @param {number} persianYear - Persian year
 * @returns {boolean} - True if leap year
 */
export function isPersianLeapYear(persianYear) {
  const a = (persianYear + 2346) * 0.24219858156;
  return Math.floor(a) === a;
}

/**
 * Get the number of days in a Persian month
 * @param {number} persianYear - Persian year
 * @param {number} persianMonth - Persian month (1-12)
 * @returns {number} - Number of days in the month
 */
export function getPersianMonthLength(persianYear, persianMonth) {
  if (persianMonth === 12 && isPersianLeapYear(persianYear)) {
    return 30;
  }
  return PERSIAN_MONTH_LENGTHS[persianMonth - 1];
}

/**
 * Convert Gregorian date to Persian date
 * @param {Date} gregorianDate - Gregorian date object
 * @returns {Object} - Persian date object {year, month, day}
 */
export function gregorianToPersian(gregorianDate) {
  const jd = gregorianToJulianDay(gregorianDate);
  return julianDayToPersian(jd);
}

/**
 * Convert Persian date to Gregorian date
 * @param {number} persianYear - Persian year
 * @param {number} persianMonth - Persian month (1-12)
 * @param {number} persianDay - Persian day (1-31)
 * @returns {Date} - Gregorian date object
 */
export function persianToGregorian(persianYear, persianMonth, persianDay) {
  const jd = persianToJulianDay(persianYear, persianMonth, persianDay);
  return julianDayToGregorian(jd);
}

/**
 * Convert Gregorian date to Julian day number
 * @param {Date} date - Gregorian date
 * @returns {number} - Julian day number
 */
function gregorianToJulianDay(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  let jd = GREGORIAN_EPOCH - 1;
  
  jd += 365 * (year - 1);
  jd += Math.floor((year - 1) / 4);
  jd -= Math.floor((year - 1) / 100);
  jd += Math.floor((year - 1) / 400);
  jd += Math.floor((367 * month - 362) / 12);
  
  if (month > 2) {
    jd -= isGregorianLeapYear(year) ? 1 : 2;
  }
  
  jd += day;
  return jd;
}

/**
 * Convert Julian day number to Persian date
 * @param {number} jd - Julian day number
 * @returns {Object} - Persian date object {year, month, day}
 */
function julianDayToPersian(jd) {
  jd = Math.floor(jd) + 0.5;
  
  const depoch = jd - PERSIAN_EPOCH;
  const cycle = Math.floor(depoch / 1029983);
  const cyear = depoch % 1029983;
  
  let ycycle;
  if (cyear === 1029982) {
    ycycle = 2820;
  } else {
    const aux = Math.floor(cyear / 366);
    const aux2 = cyear % 366;
    ycycle = Math.floor(((2134 * aux) + (2816 * aux2) + 2815) / 1028522) + aux + 1;
  }
  
  const year = ycycle + (2820 * cycle) + 1;
  
  const yday = jd - persianToJulianDay(year, 1, 1) + 1;
  
  let month = 1;
  let day = yday;
  
  for (let i = 0; i < 6 && day > 31; i++) {
    day -= getPersianMonthLength(year, month);
    month++;
  }
  
  for (let i = 6; i < 12 && day > 30; i++) {
    day -= getPersianMonthLength(year, month);
    month++;
  }
  
  return { year, month, day };
}

/**
 * Convert Persian date to Julian day number
 * @param {number} year - Persian year
 * @param {number} month - Persian month (1-12)
 * @param {number} day - Persian day (1-31)
 * @returns {number} - Julian day number
 */
function persianToJulianDay(year, month, day) {
  let jd = PERSIAN_EPOCH - 1;
  
  jd += 365 * (year - 1);
  jd += Math.floor((year + 2346) * 0.24219858156);
  
  for (let i = 1; i < month; i++) {
    jd += getPersianMonthLength(year, i);
  }
  
  jd += day;
  return jd;
}

/**
 * Convert Julian day number to Gregorian date
 * @param {number} jd - Julian day number
 * @returns {Date} - Gregorian date object
 */
function julianDayToGregorian(jd) {
  jd = Math.floor(jd - 0.5) + 0.5;
  
  const depoch = jd - GREGORIAN_EPOCH;
  const quadricent = Math.floor(depoch / 146097);
  const dqc = depoch % 146097;
  const cent = Math.floor(dqc / 36524);
  const dqc2 = dqc % 36524;
  const quad = Math.floor(dqc2 / 1461);
  const dquad = dqc2 % 1461;
  const yindex = Math.floor(dquad / 365);
  
  let year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
  
  if (!(cent === 4 || yindex === 4)) {
    year++;
  }
  
  const yearday = jd - gregorianToJulianDay(new Date(year, 0, 1));
  
  let leapadj = 0;
  if (jd < gregorianToJulianDay(new Date(year, 2, 1))) {
    leapadj = 0;
  } else if (isGregorianLeapYear(year)) {
    leapadj = 1;
  } else {
    leapadj = 2;
  }
  
  const month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
  const day = yearday - gregorianToJulianDay(new Date(year, month - 1, 1)) + 1;
  
  return new Date(year, month - 1, day);
}

/**
 * Check if a Gregorian year is a leap year
 * @param {number} year - Gregorian year
 * @returns {boolean} - True if leap year
 */
function isGregorianLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Format Persian date to string
 * @param {Object} persianDate - Persian date object {year, month, day}
 * @param {string} format - Format string ('short', 'long', 'numeric')
 * @returns {string} - Formatted Persian date string
 */
export function formatPersianDate(persianDate, format = 'long') {
  const { year, month, day } = persianDate;
  
  const monthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  
  const monthName = monthNames[month - 1];
  
  switch (format) {
    case 'short':
      return `${day} ${monthName} ${year}`;
    case 'numeric':
      return `${year}/${month}/${day}`;
    case 'long':
    default:
      return `${day} ${monthName} ${year}`;
  }
}

/**
 * Get current Persian date
 * @returns {Object} - Current Persian date object {year, month, day}
 */
export function getCurrentPersianDate() {
  return gregorianToPersian(new Date());
}

/**
 * Create a Persian date object
 * @param {number} year - Persian year
 * @param {number} month - Persian month (1-12)
 * @param {number} day - Persian day (1-31)
 * @returns {Object} - Persian date object {year, month, day}
 */
export function createPersianDate(year, month, day) {
  return { year, month, day };
}
