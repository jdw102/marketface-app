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

  const resetPredictions = async () => {
    try {
      await fetch('http://127.0.0.1:5000/reset_predictions', { method: 'POST' });
    }
    catch (error) {
      console.error('Error resetting predictions:', error);
    }
  }

  return (
    <DateTimePicker
      minDate={min_date}
      maxDate={max_date}
      label="Simulated Date"
      valueFormat="DD MMM YYYY hh:mm A"
      value={selectedDate}
      onChange={(val) => {
        setSelectedDate(val)
      }}
      submitButtonProps={{
        onClick: () => {
          updateSimulatedDate(selectedDate as Date, localStorage)
          resetPredictions()
        }
      }}
    />
  )
}

export default DateTimeWrapper