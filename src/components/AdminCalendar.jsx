import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="container">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        inline
      />
      <p className="mt-2">Selected Date: {selectedDate.toDateString()}</p>
    </div>
  );
};

export default AdminCalendar;
