import { useState, useEffect } from 'react';
import React from 'react'
import { DateTimePicker, DateValue } from '@mantine/dates';

const DateTimeWrapper = ({ originalDate, handleDateChange }: {
  originalDate: DateValue, handleDateChange: (date: DateValue) => void
}) => {

  const [selectedDate, setSelectedDate] = useState<DateValue>(originalDate);

  // const tick = () => {
  //   setSelectedDate(prevDate => {
  //     if (!prevDate) {
  //       return prevDate;
  //     }
  //     const newDate = new Date(prevDate);
  //     newDate.setMinutes(newDate.getMinutes() + 1);
  //     return newDate;
  //   });
  // };
  // setInterval(() => tick(), 60000);


  const handleSelectedDateChange = (date: DateValue) => {
    setSelectedDate(date);
  };


  return (
    <DateTimePicker valueFormat="DD MMM YYYY hh:mm A" value={selectedDate} onChange={handleSelectedDateChange} submitButtonProps={{
      onClick: () => handleDateChange(selectedDate),
    }} />
  )
}

export default DateTimeWrapper