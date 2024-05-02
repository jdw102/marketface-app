"use client";
import { useState, useEffect } from 'react';
import React from 'react'
import { DateTimePicker, DateValue } from '@mantine/dates';
import { getSimulatedDate, updateSimulatedDate } from '@/lib/timeDifference';
import { IconPlus, IconMinus } from '@tabler/icons-react';
import { ActionIcon, Group, Tooltip } from '@mantine/core';


const DateTimeWrapper = ({ minDate, maxDate }: {
  minDate: Date, maxDate: Date
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
    <Group align="center" justify='center'>
      <Tooltip label="Backward one day" position="top">
        <ActionIcon onClick={() => {
          setSelectedDate((prev) => {
            if (prev) {
              const newDate = new Date(prev.getTime());
              newDate.setDate(newDate.getDate() - 1);
              resetPredictions();
              updateSimulatedDate(newDate as Date, localStorage)
              window.location.reload();
              return newDate
            }
            return prev
          })
        }}>
          <IconMinus />
        </ActionIcon>
      </Tooltip>
      <DateTimePicker
        minDate={minDate}
        maxDate={maxDate}
        valueFormat="DD MMM YYYY hh:mm A"
        value={selectedDate}
        onChange={(val) => {
          setSelectedDate(val)
        }}
        submitButtonProps={{
          onClick: () => {
            const currDate = getSimulatedDate(localStorage);
            if (selectedDate && selectedDate < currDate) {
              resetPredictions();
            }
            updateSimulatedDate(selectedDate as Date, localStorage)
            window.location.reload();
          }
        }}
      />
      <Tooltip label="Forward one day" position="top">
        <ActionIcon onClick={() => {
          setSelectedDate((prev) => {
            if (prev) {
              const newDate = new Date(prev.getTime());
              newDate.setDate(newDate.getDate() + 1);
              updateSimulatedDate(newDate as Date, localStorage)
              window.location.reload();
              return newDate
            }
            return prev
          })

        }}>
          <IconPlus />
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}

export default DateTimeWrapper