"use client"
import React, { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { CategoryScale, Chart, LinearScale, PointElement, LineElement, Tooltip, ChartOptions } from "chart.js";
import { Card, Center, Group, Button, Select } from '@mantine/core';
import { StockData } from './chartWrapper';


Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(Tooltip);


function formatDate(dateString: string) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
}



const StockChart = ({ data, timeframe, setTimeframe }: {
    data: {
        closingPrice: StockData[],
        openPrice: StockData[],
        highPrice: StockData[],
        volume: StockData[]
    },
    timeframe: string,
    setTimeframe: (timeframe: string) => void
}) => {

    const [selected, setSelected] = useState<'closingPrice' | 'openPrice' | 'highPrice' | 'volume'>('closingPrice');
    const timeframeOptions = ['1W', '1M', '3M', 'YTD', '1Y', 'All']
    const dates = data[selected].map((d) => formatDate(d.date));
    const prices = data[selected].map((d) => d.value);
    const chartData = {
        labels: dates,
        datasets: [
            {
                label: 'Stock Price',
                data: prices,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    }
    const options: ChartOptions<'line'> = {
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                enabled: timeframe === '1W' || timeframe === '1M' || timeframe === '3M' || timeframe === 'YTD',
                callbacks: {
                    label: function (context) {
                        return context.parsed.y.toFixed(2);
                    }
                }
            }
        },
        elements: {
            point:{
                radius: timeframe === '1W' || timeframe === '1M' || timeframe === '3M' || timeframe === 'YTD' ? 3: 0
            }
        }
    };

    const handleSelection = (type: 'closingPrice' | 'openPrice' | 'highPrice' | 'volume' | string | null) => {
        if (type == null || (type != 'closingPrice' && type != 'openPrice' && type != 'highPrice' && type != 'volume')) {
            setSelected('closingPrice');
            return;
        }

        setSelected(type);
    }

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" >
            <Select data={[
                {
                    label: 'Closing Price ($)',
                    value: 'closingPrice'
                },
                {
                    label: 'Open Price ($)',
                    value: 'openPrice'
                },
                {
                    label: 'High Price ($)',
                    value: 'highPrice'
                },
                {
                    label: 'Volume',
                    value: 'volume'
                }
            ]} value={selected} onChange={(value) => handleSelection(value)} />
            <div style={{height: '60vh', marginTop: 10}}>
                <Line data={chartData} options={options} />
            </div>
            <Group justify='center' mt={10}>
                {
                    timeframeOptions.map((option) => {
                        return <Button variant={timeframe == option ? "filled" : "subtle"} size='sm' key={option} onClick={() => setTimeframe(option)}>{option}</Button>
                    }
                    )
                }
            </Group>

        </Card>
    )
}

export default StockChart