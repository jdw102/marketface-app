"use client";
import { useState, useEffect } from 'react';
import React from 'react'
import { DateTimePicker, DateValue } from '@mantine/dates';
import { getSimulatedDate, updateSimulatedDate } from '@/lib/timeDifference';


const DateTimeWrapper = ({ min_date, max_date }: {
  min_date: Date, max_date: Date
}) => {
  const [selectedDate, setSelectedDate] = useState<DateValue>();

  useEffect(() => {
    const originalDate = getSimulatedDate(localStorage);
    setSelectedDate(originalDate);
  }, []);



  return (
    <DateTimePicker
      minDate={min_date}
      maxDate={max_date}
      label="Simulated Date"
      valueFormat="DD MMM YYYY hh:mm A"
      value={selectedDate}
      onChange={(val) => {
        updateSimulatedDate(val as Date, localStorage)
        setSelectedDate(val)
      }} />
  )
}

export default DateTimeWrapper