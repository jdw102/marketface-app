"use client"
import React, { useState, useEffect } from 'react'
import { Card, Group, Button, Select } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { getSimulatedDate } from '@/lib/timeDifference';


export interface SentimentData {
    date: string;
}

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct", "Nov", "Dec"
];



function formatDate(inputDate: string) {
    const parts = inputDate.split("-");
    const year = parseInt(parts[0]);
    const monthIndex = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);

    const monthName = months[monthIndex];
    const ending = day % 10 == 1 && day != 11 ? "st" : day % 10 == 2 && day != 12 ? "nd" : day % 10 == 3 && day != 13 ? "rd" : "th";
    return `${monthName} ${day}${ending}`;
}


interface SentimentChartProps {
    ticker: string,
    timeframeOptions: string[],
}

const colors = [
    'blue',
    'red',
    'green',
    'purple',
    'orange',
    'yellow',
    'cyan',
    'magenta',
    'lime',
    'pink',
    'teal',
]

const SentimentChart = ({ ticker, timeframeOptions }: SentimentChartProps) => {
    const [timeframe, setTimeframe] = useState<string>(timeframeOptions[0]);
    const [sentimentData, setSentimentData] = useState<SentimentData[]>([{
        date: ''
    }]);

    useEffect(() => {
        const fetchStockData = async () => {
            const curr_date = getSimulatedDate(localStorage);
            try {
                const response = await fetch(`http://127.0.0.1:5000/sentiment_timeseries?symbol=${ticker}&timeframe=${timeframe}&curr_date=${curr_date}`);
                const data = await response.json();
                data.map((d : SentimentData) => {
                    d.date = formatDate(d.date);
                });
                setSentimentData(data);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchStockData();
    }, [ticker, timeframe]);


    const keys = Object.keys(sentimentData[0]).filter(key => key !== 'date');
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" >
            <div style={{ height: '60vh', marginTop: 10 }}>
                <LineChart
                    h="100%"
                    data={sentimentData}
                    dataKey='date'
                    yAxisLabel='Score'
                    xAxisLabel='Date'
                    valueFormatter={(value) => {
                        return value.toFixed(2)
                    }}
                    tooltipAnimationDuration={300}
                    series={keys.map((value, key) => {
                        return {
                            name: value,
                            color: colors[key],
                        }
                    })}
                    withDots={timeframe == '1W'}
                />
            </div>
            <Group justify='center' mt={10}>
                {
                    timeframeOptions.map((option) => {
                        return <Button variant={timeframe == option ? "filled" : "light"} size='sm' key={option} onClick={() => setTimeframe(option)}>{option}</Button>
                    }
                    )
                }
            </Group>

        </Card>
    )
}

export default SentimentChart