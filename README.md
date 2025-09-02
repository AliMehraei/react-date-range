# 🗓️ AustroByte Date Picker

[![npm](https://img.shields.io/npm/v/austro-byte-datepicker)](https://www.npmjs.com/package/austro-byte-datepicker)
[![npm](https://img.shields.io/npm/l/austro-byte-datepicker)]()
[![npm](https://img.shields.io/npm/dw/austro-byte-datepicker)](https://www.npmjs.com/package/austro-byte-datepicker)

A modern, feature-rich React component library for date and time selection. Built with TypeScript, powered by date-fns, and designed for excellent user experience.

## ✨ Features

- 🗓️ **Multiple Date Pickers**: Single date, date range, and date-time pickers
- 🎨 **Highly Customizable**: Extensive theming and styling options
- ♿ **Accessibility First**: Full ARIA support and keyboard navigation
- 📱 **Mobile Responsive**: Works seamlessly on all devices
- 🚀 **Performance Optimized**: Built with React hooks and memoization
- 🎯 **TypeScript Ready**: Full TypeScript support
- 🕐 **Time Selection**: 12-hour and 24-hour format support
- 🎪 **Drag & Drop**: Intuitive date range selection
- 🌍 **Internationalization**: Multi-language support via date-fns locales

## 📦 Installation


```bash
npm install austro-byte-datepicker
```

### Peer Dependencies

This package requires React and date-fns as peer dependencies:

```bash
npm install react date-fns
```

## 🚀 Quick Start

### 1. Import Styles

```javascript
import 'austro-byte-datepicker/dist/styles.css';
import 'austro-byte-datepicker/dist/theme/default.css';
```

### 2. Basic Usage

```jsx
import React, { useState } from 'react';
import { Calendar, DateRangePicker, DateTimePicker, PersianDateRangePicker } from 'austro-byte-datepicker';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  return (
    <div>
      {/* Single Date Picker */}
      <Calendar
        date={selectedDate}
        onChange={setSelectedDate}
      />

      {/* Date Range Picker */}
      <DateRangePicker
        ranges={[dateRange]}
        onChange={setDateRange}
      />

      {/* DateTime Picker */}
      <DateTimePicker
        date={selectedDateTime}
        onChange={setSelectedDateTime}
      />

      {/* Persian Calendar Date Range Picker */}
      <PersianDateRangePicker
        ranges={[dateRange]}
        onChange={setDateRange}
        showPersianDates={true}
        persianDateFormat="long"
      />
    </div>
  );
}
```

## 🌍 Persian Calendar Support

The library now includes full support for Persian (Shamsi) calendar with the `PersianDateRangePicker` component. This component provides:

- **Persian Date Display**: Shows dates in Persian format (e.g., "۱ اسفند ۱۴۰۴")
- **Automatic Conversion**: Converts between Gregorian and Persian calendars
- **RTL Support**: Right-to-left text direction for Persian language
- **Persian Locale**: Uses Persian calendar locale from date-fns
- **Customizable Format**: Choose between short, long, and numeric date formats

### Persian Calendar Usage

```jsx
import React, { useState } from 'react';
import { PersianDateRangePicker } from 'austro-byte-datepicker';

function PersianCalendarExample() {
  const [ranges, setRanges] = useState([
    {
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      key: 'selection',
      label: 'هفته آینده'
    }
  ]);

  return (
    <PersianDateRangePicker
      ranges={ranges}
      onChange={setRanges}
      showPersianDates={true}
      persianDateFormat="long"
      locale="fa-IR"
    />
  );
}
```

### Persian Calendar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showPersianDates` | boolean | `true` | Whether to show Persian date displays |
| `persianDateFormat` | string | `'long'` | Persian date format: 'short', 'long', or 'numeric' |
| `locale` | object | Persian locale | Locale configuration (defaults to Persian) |

### Persian Calendar Utilities

The library also exports Persian calendar utility functions:

```jsx
import { 
  gregorianToPersian, 
  persianToGregorian, 
  formatPersianDate,
  getCurrentPersianDate 
} from 'austro-byte-datepicker';

// Convert Gregorian date to Persian
const persianDate = gregorianToPersian(new Date());

// Format Persian date
const formattedDate = formatPersianDate(persianDate, 'long'); // "۱ اسفند ۱۴۰۴"

// Get current Persian date
const today = getCurrentPersianDate();
```

## 🎨 Custom Input Support

All picker components now support custom input elements, allowing you to completely customize the appearance and behavior of the input field.

### Using Custom Inputs

```jsx
import React from 'react';
import { DateRangePicker } from 'austro-byte-datepicker';

function App() {
  // Define your custom input element
  const customInput = (
    <div
      style={{
        padding: '16px 20px',
        border: '2px solid #e74c3c',
        borderRadius: '8px',
        backgroundColor: '#fdf2f2',
        color: '#c0392b',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span>📅 Select Date Range</span>
      <span>🗓️</span>
    </div>
  );

  return (
    <DateRangePicker
      ranges={[dateRange]}
      onChange={setDateRange}
      inputRanges={[]}
      staticRanges={[]}
      showSelectionPreview={true}
      moveRangeOnFirstSelection={false}
      months={2}
      direction="horizontal"
      customInput={customInput}
    />
  );
}
```

## 📅 Component Examples

### Calendar Component

```jsx
import { Calendar } from 'austro-byte-datepicker';

function CalendarExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Calendar
      date={selectedDate}
      onChange={setSelectedDate}
      minDate={new Date(2020, 0, 1)}
      maxDate={new Date(2030, 11, 31)}
      disabledDates={[new Date(2024, 11, 25)]}
      showMonthDropdown={true}
      showYearDropdown={true}
      dropdownMode="select"
    />
  );
}
```

### DateRangePicker Component

```jsx
import { DateRangePicker } from 'austro-byte-datepicker';

function DateRangeExample() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  return (
    <DateRangePicker
      ranges={[dateRange]}
      onChange={setDateRange}
      months={2}
      direction="horizontal"
      showSelectionPreview={true}
      moveRangeOnFirstSelection={false}
      rangeColors={['#3d91ff', '#e74c3c', '#28a745']}
      showDateDisplay={true}
      showMonthAndYearPickers={true}
    />
  );
}
```

### DateTimePicker Component

```jsx
import { DateTimePicker } from 'austro-byte-datepicker';

function DateTimeExample() {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  return (
    <DateTimePicker
      date={selectedDateTime}
      onChange={setSelectedDateTime}
      showTimeSelect={true}
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="MMMM d, yyyy h:mm aa"
      showTimeSelectOnly={false}
      timeClassName={() => 'custom-time-class'}
    />
  );
}
```

## 🎨 Theming and Customization

### Custom CSS Variables

```css
:root {
  --date-picker-primary-color: #3d91ff;
  --date-picker-secondary-color: #2c5aa0;
  --date-picker-border-radius: 8px;
  --date-picker-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  --date-picker-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### Custom Theme

```jsx
import 'austro-byte-datepicker/dist/theme/custom.css';

// Or create your own theme file
const customTheme = `
  .rdrCalendarWrapper {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  .rdrDayToday {
    background: #3d91ff !important;
    color: white !important;
  }
`;
```

## 🌍 Internationalization

```jsx
import { format } from 'date-fns';
import { enUS, faIR, deDE } from 'date-fns/locale';

// English (default)
<Calendar locale={enUS} />

// Persian
<Calendar locale={faIR} />

// German
<Calendar locale={deDE} />
```

## ♿ Accessibility

All components are built with accessibility in mind:

- **ARIA Labels**: Proper ARIA attributes for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling
- **Screen Reader Support**: Compatible with all major screen readers

```jsx
<Calendar
  ariaLabel="Select a date"
  ariaLabelledBy="date-picker-label"
  ariaDescribedBy="date-picker-description"
/>
```

## 📱 Mobile Support

The components are fully responsive and optimized for mobile devices:

- **Touch Friendly**: Large touch targets
- **Swipe Gestures**: Intuitive swipe navigation
- **Responsive Design**: Adapts to all screen sizes
- **Mobile Optimized**: Performance optimized for mobile

## 🚀 Performance

- **React Hooks**: Built with modern React patterns
- **Memoization**: Optimized re-renders
- **Lazy Loading**: Components load only when needed
- **Bundle Size**: Optimized for minimal bundle impact

## 🔧 API Reference

### Calendar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `date` | `Date` | `new Date()` | Selected date |
| `onChange` | `function` | - | Date change handler |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `disabledDates` | `Date[]` | `[]` | Dates to disable |
| `showMonthDropdown` | `boolean` | `false` | Show month dropdown |
| `showYearDropdown` | `boolean` | `false` | Show year dropdown |

### DateRangePicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ranges` | `array` | `[]` | Array of date ranges |
| `onChange` | `function` | - | Range change handler |
| `months` | `number` | `1` | Number of months to show |
| `direction` | `string` | `'horizontal'` | Layout direction |
| `showSelectionPreview` | `boolean` | `true` | Show selection preview |
| `moveRangeOnFirstSelection` | `boolean` | `false` | Move range on first selection |

### DateTimePicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `date` | `Date` | `new Date()` | Selected date and time |
| `onChange` | `function` | - | DateTime change handler |
| `showTimeSelect` | `boolean` | `false` | Show time selection |
| `timeFormat` | `string` | `'HH:mm'` | Time format |
| `timeIntervals` | `number` | `15` | Time interval in minutes |

## 🛠️ Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/mostafahosseinidb/ReactDatePicker.git
cd ReactDatePicker

# Install dependencies
yarn install

# Start development server
yarn start

# Build for production
yarn build
```

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/mostafahosseinidb/ReactDatePicker/wiki)
- **Issues**: [GitHub Issues](https://github.com/mostafahosseinidb/ReactDatePicker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mostafahosseinidb/ReactDatePicker/discussions)

## 🎯 Roadmap

- [ ] TypeScript definitions
- [ ] More theme options
- [ ] Advanced customization
- [ ] Performance optimizations
- [ ] Additional locales
- [ ] Unit tests coverage
- [ ] E2E tests
- [ ] Storybook documentation

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Date manipulation with [date-fns](https://date-fns.org/)
- Styling with [SCSS](https://sass-lang.com/)
- Icons from [Emoji](https://emojipedia.org/)

---

**Built with ❤️ by [Mostafa Hosseini](https://github.com/mostafahosseinidb)**

[📚 GitHub](https://github.com/mostafahosseinidb/ReactDatePicker) | [📦 npm](https://www.npmjs.com/package/austro-byte-datepicker) | [🎮 Demo](https://mostafahosseinidb.github.io/ReactDatePicker/)
