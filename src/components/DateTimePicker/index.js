import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { usePopper } from 'react-popper';
import Calendar from '../Calendar';
import { generateStyles } from '../../utils';
import classnames from 'classnames';
import coreStyles from '../../styles';

function DateTimePicker(props) {
  // Initial state from props
  const initialDate = props.date || new Date();

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState({
    hours: initialDate.getHours(),
    minutes: initialDate.getMinutes(),
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDateTimeText, setSelectedDateTimeText] = useState('');

  const styles = generateStyles([coreStyles, props.classNames]);

  const containerRef = useRef(null);

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);

  const { styles: popperStyles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'auto',
    modifiers: [
      {
        name: 'flip',
        enabled: true,
        options: { fallbackPlacements: ['bottom-end', 'top-start', 'top-end', 'auto-end', 'auto'] },
      },
      { name: 'preventOverflow', enabled: true },
    ],
  });

  // Memoized function to update selected date time text
  const updateSelectedDateTimeText = useCallback(
    date => {
      try {
        if (date instanceof Date) {
          if (props.persianCalendar) {
            // Import Persian calendar utilities
            const { gregorianToPersian, formatPersianDate } = require('../../utils/persianCalendar');
            const persianDate = gregorianToPersian(date);
            let text = formatPersianDate(persianDate, 'long');
            
            if (props.showTime !== false) {
              // Add time to Persian date
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              const timeString = props.hour12 !== false 
                ? `${hours}:${minutes} ${date.getHours() >= 12 ? 'بعدازظهر' : 'قبل‌ازظهر'}`
                : `${hours}:${minutes}`;
              text += ` - ${timeString}`;
            }
            setSelectedDateTimeText(text);
          } else {
            if (props.showTime !== false) {
              // Show date and time
              const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: props.hour12 !== false,
              };
              const text = date.toLocaleString('en-US', options);
              setSelectedDateTimeText(text);
            } else {
              // Show only date
              const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              };
              const text = date.toLocaleDateString('en-US', options);
              setSelectedDateTimeText(text);
            }
          }
        } else {
          setSelectedDateTimeText('');
        }
      } catch (error) {
        console.warn('Error formatting date time:', error);
        setSelectedDateTimeText('');
      }
    },
    [props.hour12, props.showTime, props.persianCalendar]
  );

  // Initialize selectedDateTimeText once on mount
  useEffect(() => {
    const dateWithTime = new Date(selectedDate);
    dateWithTime.setHours(selectedTime.hours, selectedTime.minutes);
    updateSelectedDateTimeText(dateWithTime);
  }, [selectedDate, selectedTime, updateSelectedDateTimeText]);

  // If props.date changes, update local state
  useEffect(() => {
    if (props.date) {
      const newDate = new Date(props.date);
      setSelectedDate(newDate);
      setSelectedTime({
        hours: newDate.getHours(),
        minutes: newDate.getMinutes(),
      });
    }
  }, [props.date]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = event => {
      if (showDropdown && containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    const handleKeyDown = event => {
      if (showDropdown && event.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDropdown]);

  const toggleDropdown = useCallback(() => {
    setShowDropdown(prev => !prev);
  }, []);

  const handleDateChange = useCallback(
    date => {
      try {
        const newDate = new Date(date);
        if (props.showTime !== false) {
          // Keep the current time when showTime is true
          newDate.setHours(selectedTime.hours, selectedTime.minutes);
        } else {
          // Set time to 00:00 when showTime is false
          newDate.setHours(0, 0, 0, 0);
        }
        setSelectedDate(newDate);

        // Call parent onChange callback if provided
        if (props.onChange) {
          props.onChange(newDate);
        }
      } catch (error) {
        console.error('Error handling date change:', error);
      }
    },
    [selectedTime, props.onChange, props.showTime]
  );

  const handleTimeChange = useCallback(
    (type, value) => {
      try {
        const newTime = { ...selectedTime };
        newTime[type] = parseInt(value, 10);

        // Validate time values
        if (type === 'hours') {
          newTime.hours = Math.max(0, Math.min(23, newTime.hours));
        } else if (type === 'minutes') {
          newTime.minutes = Math.max(0, Math.min(59, newTime.minutes));
        }

        setSelectedTime(newTime);

        const newDate = new Date(selectedDate);
        newDate.setHours(newTime.hours, newTime.minutes);

        // Call parent onChange callback if provided
        if (props.onChange) {
          props.onChange(newDate);
        }
      } catch (error) {
        console.error('Error handling time change:', error);
      }
    },
    [selectedTime, selectedDate, props.onChange]
  );

  const handleApply = useCallback(() => {
    setShowDropdown(false);
  }, []);

  const handleCancel = useCallback(() => {
    const defaultDate = new Date();
    setSelectedDate(defaultDate);
    setSelectedTime({
      hours: defaultDate.getHours(),
      minutes: defaultDate.getMinutes(),
    });
    setShowDropdown(false);

    // Notify parent of reset
    if (props.onChange) {
      props.onChange(defaultDate);
    }
  }, [props.onChange]);

  const handleToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    setSelectedTime({
      hours: today.getHours(),
      minutes: today.getMinutes(),
    });

    // Call parent onChange callback if provided
    if (props.onChange) {
      props.onChange(today);
    }
  }, [props.onChange]);

  const { className, inputClassName, placeholder = 'Select date and time', customInput } = props;

  // Render custom input if provided, otherwise render default input
  const renderInput = () => {
    if (customInput) {
      // Clone the custom input and add necessary props
      return React.cloneElement(customInput, {
        ref: setReferenceElement,
        onClick: toggleDropdown,
        onKeyDown: event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleDropdown();
          }
        },
        onFocus: () => {
          // Don't automatically open dropdown on focus, let user click
        },
        readOnly: true,
        'aria-expanded': showDropdown,
        'aria-haspopup': 'true',
        role: 'combobox',
        value: selectedDateTimeText,
        placeholder: placeholder,
        style: {
          cursor: 'pointer',
          ...customInput.props.style,
        },
      });
    }

    return (
      <input
        ref={setReferenceElement}
        type="text"
        className={classnames('datetime-picker-input', inputClassName)}
        placeholder={placeholder}
        value={selectedDateTimeText}
        onClick={toggleDropdown}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleDropdown();
          }
        }}
        onFocus={() => {
          // Don't automatically open dropdown on focus, let user click
        }}
        readOnly
        aria-expanded={showDropdown}
        aria-haspopup="true"
        role="combobox"
        style={{
          width: '100%',
          padding: '12px 16px',
          border: `1px solid ${showDropdown ? '#3d91ff' : '#ccc'}`,
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#fff',
          outline: 'none',
          transition: 'border-color 0.2s ease',
        }}
      />
    );
  };

  // Render custom icon if provided, otherwise render default icon
  const renderIcon = () => {
    if (customInput && customInput.props.customIcon) {
      return customInput.props.customIcon;
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="21"
        viewBox="0 0 16 17"
        fill="none">
        <path
          d="M11.3333 10.0814C11.5101 10.0814 11.6797 10.0111 11.8047 9.88612C11.9298 9.76109 12 9.59152 12 9.41471C12 9.2379 11.9298 9.06833 11.8047 8.94331C11.6797 8.81828 11.5101 8.74805 11.3333 8.74805C11.1565 8.74805 10.987 8.81828 10.8619 8.94331C10.7369 9.06833 10.6667 9.2379 10.6667 9.41471C10.6667 9.59152 10.7369 9.76109 10.8619 9.88612C10.987 10.0111 11.1565 10.0814 11.3333 10.0814ZM11.3333 12.748C11.5101 12.748 11.6797 12.6778 11.8047 12.5528C11.9298 12.4278 12 12.2582 12 12.0814C12 11.9046 11.9298 11.735 11.8047 11.61C11.6797 11.485 11.5101 11.4147 11.3333 11.4147C11.1565 11.4147 10.987 11.485 10.8619 11.61C10.7369 11.735 10.6667 11.9046 10.6667 12.0814C10.6667 12.2582 10.7369 12.4278 10.8619 12.5528C10.987 12.6778 11.1565 12.748 11.3333 12.748ZM8.66667 9.41471C8.66667 9.59152 8.59643 9.76109 8.4714 9.88612C8.34638 10.0111 8.17681 10.0814 8 10.0814C7.82319 10.0814 7.65362 10.0111 7.5286 9.88612C7.40357 9.76109 7.33333 9.59152 7.33333 9.41471C7.33333 9.2379 7.40357 9.06833 7.5286 8.94331C7.65362 8.81828 7.82319 8.74805 8 8.74805C8.17681 8.74805 8.34638 8.81828 8.4714 8.94331C8.59643 9.06833 8.66667 9.2379 8.66667 9.41471ZM8.66667 12.0814C8.66667 12.2582 8.59643 12.4278 8.4714 12.5528C8.34638 12.6778 8.17681 12.748 8 12.748C7.82319 12.748 7.65362 12.6778 7.5286 12.5528C7.40357 12.4278 7.33333 12.2582 7.33333 12.0814C7.33333 11.9046 7.40357 11.735 7.5286 11.61C7.65362 11.485 7.82319 11.4147 8 11.4147C8.17681 11.4147 8.34638 11.485 8.4714 11.61C8.59643 11.735 8.66667 11.9046 8.66667 12.0814ZM4.66667 10.0814C4.84348 10.0814 5.01305 10.0111 5.13807 9.88612C5.2631 9.76109 5.33333 9.59152 5.33333 9.41471C5.33333 9.2379 5.2631 9.06833 5.13807 8.94331C5.01305 8.81828 4.84348 8.74805 4.66667 8.74805C4.48986 8.74805 4.32029 8.81828 4.19526 8.94331C4.07024 9.06833 4 9.2379 4 9.41471C4 9.59152 4.07024 9.76109 4.19526 9.88612C4.32029 10.0111 4.48986 10.0814 4.66667 10.0814ZM4.66667 12.748C4.84348 12.748 5.01305 12.6778 5.13807 12.5528C5.2631 12.4278 5.33333 12.2582 5.33333 12.0814C5.33333 11.9046 5.2631 11.735 5.13807 11.61C5.01305 11.485 4.84348 11.4147 4.66667 11.4147C4.48986 11.4147 4.32029 11.485 4.19526 11.61C4.07024 11.735 4 11.9046 4 12.0814C4 12.2582 4.07024 12.4278 4.19526 12.5528C4.32029 12.6778 4.48986 12.748 4.66667 12.748Z"
          fill="#121212"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.66665 1.91473C4.79926 1.91473 4.92644 1.96741 5.0202 2.06118C5.11397 2.15495 5.16665 2.28213 5.16665 2.41473V2.9234C5.60798 2.91473 6.09398 2.91473 6.62865 2.91473H9.37065C9.90598 2.91473 10.392 2.91473 10.8333 2.9234V2.41473C10.8333 2.28213 10.886 2.15495 10.9798 2.06118C11.0735 1.96741 11.2007 1.91473 11.3333 1.91473C11.4659 1.91473 11.5931 1.96741 11.6869 2.06118C11.7806 2.15495 11.8333 2.28213 11.8333 2.41473V2.96607C12.0067 2.9794 12.1709 2.99629 12.326 3.01673C13.1073 3.12207 13.74 3.3434 14.2393 3.84207C14.738 4.3414 14.9593 4.97407 15.0647 5.7554C15.1667 6.5154 15.1667 7.4854 15.1667 8.71073V10.1187C15.1667 11.3441 15.1667 12.3147 15.0647 13.0741C14.9593 13.8554 14.738 14.4881 14.2393 14.9874C13.74 15.4861 13.1073 15.7074 12.326 15.8127C11.566 15.9147 10.596 15.9147 9.37065 15.9147H6.62998C5.40465 15.9147 4.43398 15.9147 3.67465 15.8127C2.89332 15.7074 2.26065 15.4861 1.76132 14.9874C1.26265 14.4881 1.04132 13.8554 0.935984 13.0741C0.833984 12.3141 0.833984 11.3441 0.833984 10.1187V8.71073C0.833984 7.4854 0.833984 6.51473 0.935984 5.7554C1.04132 4.97407 1.26265 4.3414 1.76132 3.84207C2.26065 3.3434 2.89332 3.12207 3.67465 3.01673C3.83021 2.99629 3.99443 2.9794 4.16732 2.96607V2.41473C4.16732 2.28224 4.2199 2.15517 4.31353 2.06142C4.40715 1.96767 4.53416 1.91491 4.66665 1.91473ZM3.80665 4.00807C3.13665 4.09807 2.74998 4.2674 2.46798 4.5494C2.18598 4.8314 2.01665 5.21807 1.92665 5.88807C1.91154 6.0014 1.89865 6.12118 1.88798 6.2474H14.112C14.1013 6.12118 14.0884 6.00118 14.0733 5.8874C13.9833 5.2174 13.814 4.83073 13.532 4.54873C13.25 4.26673 12.8633 4.0974 12.1927 4.0074C11.508 3.9154 10.6047 3.91407 9.33332 3.91407H6.66665C5.39532 3.91407 4.49265 3.91607 3.80665 4.00807ZM1.83332 8.74807C1.83332 8.17873 1.83332 7.6834 1.84198 7.24807H14.158C14.1667 7.6834 14.1667 8.17873 14.1667 8.74807V10.0814C14.1667 11.3527 14.1653 12.2561 14.0733 12.9414C13.9833 13.6114 13.814 13.9981 13.532 14.2801C13.25 14.5621 12.8633 14.7314 12.1927 14.8214C11.508 14.9134 10.6047 14.9147 9.33332 14.9147H6.66665C5.39532 14.9147 4.49265 14.9134 3.80665 14.8214C3.13665 14.7314 2.74998 14.5621 2.46798 14.2801C2.18598 13.9981 2.01665 13.6114 1.92665 12.9407C1.83465 12.2561 1.83332 11.3527 1.83332 10.0814V8.74807Z"
          fill="#121212"
        />
      </svg>
    );
  };

  return (
    <div
      className={classnames(styles.dateTimePickerOuterWrapper, className)}
      style={{ position: 'relative', display: 'inline-block' }}
      ref={containerRef}>
      <div
        style={{
          position: 'relative',
          // width: '100%',
          minWidth: `${!customInput ? '150px' : 'auto'}`,
          // overflow: 'hidden',
        }}>
        {renderInput()}
        {!customInput && (
          <div style={{ position: 'absolute', top: '15px', right: '15px', pointerEvents: 'none' }}>
            {renderIcon()}
          </div>
        )}
      </div>

      {showDropdown && (
        <div
          ref={setPopperElement}
          className={classnames(styles.dateTimePickerWrapper)}
          style={{
            ...popperStyles.popper,
            background: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            padding: '0px',
            zIndex: 9999,
            borderRadius: '8px',
            minWidth: '300px',
          }}
          {...attributes.popper}>
          <div style={{ padding: '10px' }}>
            <Calendar
              {...props}
              date={selectedDate}
              onChange={handleDateChange}
              displayMode="date"
              showDateDisplay={false}
              persianCalendar={props.persianCalendar}
            />
          </div>

          <div
            style={{
              padding: '10px',
              borderTop: '1px solid #eee',
              backgroundColor: '#f9f9f9',
            }}>
            {props.showTime !== false && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                }}>
                <label style={{ fontSize: '14px', fontWeight: '500', minWidth: '60px' }}>
                  Time:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="number"
                    min="0"
                    max={props.hour12 !== false ? '12' : '23'}
                    value={
                      props.hour12 !== false ? selectedTime.hours % 12 || 12 : selectedTime.hours
                    }
                    onChange={e => {
                      const value = parseInt(e.target.value, 10);
                      if (props.hour12 !== false) {
                        // For 12-hour format, convert to 24-hour
                        const isPM = selectedTime.hours >= 12;
                        const newHours = isPM
                          ? value === 12
                            ? 12
                            : value + 12
                          : value === 12
                          ? 0
                          : value;
                        handleTimeChange('hours', newHours);
                      } else {
                        handleTimeChange('hours', value);
                      }
                    }}
                    style={{
                      width: '50px',
                      padding: '5px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '14px',
                    }}
                  />
                  <span style={{ fontSize: '14px' }}>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={selectedTime.minutes}
                    onChange={e => handleTimeChange('minutes', e.target.value)}
                    style={{
                      width: '50px',
                      padding: '5px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '14px',
                    }}
                  />
                  {props.hour12 !== false && (
                    <select
                      value={selectedTime.hours >= 12 ? 'PM' : 'AM'}
                      onChange={e => {
                        const isPM = e.target.value === 'PM';
                        const currentHour12 = selectedTime.hours % 12 || 12;
                        const newHours = isPM
                          ? currentHour12 === 12
                            ? 12
                            : currentHour12 + 12
                          : currentHour12 === 12
                          ? 0
                          : currentHour12;
                        handleTimeChange('hours', newHours);
                      }}
                      style={{
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}>
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}>
                Cancel
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleToday}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #3d91ff',
                    borderRadius: '8px',
                    backgroundColor: '#3d91ff',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}>
                  Today
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #000000',
                    borderRadius: '8px',
                    backgroundColor: '#000000',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}>
                  Set Date
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

DateTimePicker.defaultProps = {
  inputClassName: '',
  placeholder: 'Select date and time',
  hour12: true,
  showTime: true,
  customInput: null,
  persianCalendar: false,
};

DateTimePicker.propTypes = {
  ...Calendar.propTypes,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  placeholder: PropTypes.string,
  hour12: PropTypes.bool,
  showTime: PropTypes.bool,
  date: PropTypes.object,
  onChange: PropTypes.func,
  customInput: PropTypes.element,
  persianCalendar: PropTypes.bool,
};

export default DateTimePicker;
