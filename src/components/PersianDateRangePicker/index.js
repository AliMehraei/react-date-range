import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DateRangePicker from '../DateRangePicker';
import { persianCalendar } from '../../locale';
import { 
  gregorianToPersian, 
  persianToGregorian, 
  formatPersianDate,
  getCurrentPersianDate 
} from '../../utils/persianCalendar';

/**
 * PersianDateRangePicker - A wrapper around DateRangePicker with Persian calendar support
 * Supports both Gregorian and Persian date formats
 */
function PersianDateRangePicker(props) {
  const {
    ranges: initialRanges = [],
    onChange,
    onRangeFocusChange,
    locale = persianCalendar,
    showPersianDates = true,
    persianDateFormat = 'long',
    ...otherProps
  } = props;

  const [ranges, setRanges] = useState(initialRanges);
  const [persianRanges, setPersianRanges] = useState([]);

  // Convert Gregorian dates to Persian dates for display
  useEffect(() => {
    if (showPersianDates && ranges.length > 0) {
      const converted = ranges.map(range => {
        const persianStart = range.startDate ? gregorianToPersian(range.startDate) : null;
        const persianEnd = range.endDate ? gregorianToPersian(range.endDate) : null;
        
        return {
          ...range,
          persianStartDate: persianStart,
          persianEndDate: persianEnd,
          persianLabel: range.label ? `${range.label} (${formatPersianDate(persianStart, persianDateFormat)} - ${formatPersianDate(persianEnd, persianDateFormat)})` : range.label
        };
      });
      setPersianRanges(converted);
    }
  }, [ranges, showPersianDates, persianDateFormat]);

  // Handle date changes and convert Persian dates back to Gregorian
  const handleChange = (newRanges) => {
    setRanges(newRanges);
    
    if (onChange) {
      onChange(newRanges);
    }
  };

  // Get current Persian date for display
  const currentPersianDate = getCurrentPersianDate();

  return (
    <div className="persian-date-range-picker">
      {showPersianDates && (
        <div className="persian-current-date" style={{
          textAlign: 'center',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '15px',
          fontFamily: 'Tahoma, Arial, sans-serif',
          direction: 'rtl'
        }}>
          <strong>تاریخ امروز:</strong> {formatPersianDate(currentPersianDate, persianDateFormat)}
        </div>
      )}
      
      <DateRangePicker
        {...otherProps}
        ranges={ranges}
        onChange={handleChange}
        onRangeFocusChange={onRangeFocusChange}
        locale={locale}
      />
      
      {showPersianDates && persianRanges.length > 0 && (
        <div className="persian-ranges-display" style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontFamily: 'Tahoma, Arial, sans-serif',
          direction: 'rtl'
        }}>
          <h4 style={{ marginBottom: '10px', textAlign: 'center' }}>تاریخ‌های انتخاب شده:</h4>
          {persianRanges.map((range, index) => (
            <div key={index} style={{
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <strong>{range.label || `Range ${index + 1}`}:</strong>
              <br />
              {range.persianStartDate && (
                <span>از: {formatPersianDate(range.persianStartDate, persianDateFormat)}</span>
              )}
              {range.persianEndDate && (
                <span style={{ marginRight: '15px' }}>
                  تا: {formatPersianDate(range.persianEndDate, persianDateFormat)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

PersianDateRangePicker.propTypes = {
  /** Date ranges array */
  ranges: PropTypes.arrayOf(PropTypes.shape({
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    key: PropTypes.string,
    label: PropTypes.string,
    color: PropTypes.string,
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
  })),
  /** Callback when ranges change */
  onChange: PropTypes.func,
  /** Callback when range focus changes */
  onRangeFocusChange: PropTypes.func,
  /** Locale configuration (defaults to Persian) */
  locale: PropTypes.object,
  /** Whether to show Persian date displays */
  showPersianDates: PropTypes.bool,
  /** Persian date format ('short', 'long', 'numeric') */
  persianDateFormat: PropTypes.oneOf(['short', 'long', 'numeric']),
  /** All other props are passed to DateRangePicker */
};

PersianDateRangePicker.defaultProps = {
  showPersianDates: true,
  persianDateFormat: 'long',
  locale: persianCalendar,
};

export default PersianDateRangePicker;
