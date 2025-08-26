import { faIR } from 'date-fns/locale/fa-IR';

// Persian calendar configuration
export const persianCalendarConfig = {
  locale: faIR,
  weekStartsOn: 6, // Saturday in Persian calendar
  monthNames: [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ],
  monthNamesShort: [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ],
  dayNames: [
    'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'
  ],
  dayNamesShort: [
    'ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'
  ],
  // Persian calendar specific formatting
  formatDate: (date) => {
    if (!date) return '';
    
    // Convert to Persian calendar
    const persianDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
    
    return persianDate;
  },
  formatMonth: (date) => {
    if (!date) return '';
    
    const persianDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'long'
    }).format(date);
    
    return persianDate;
  },
  formatYear: (date) => {
    if (!date) return '';
    
    const persianDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric'
    }).format(date);
    
    return persianDate;
  }
};

export default persianCalendarConfig;
