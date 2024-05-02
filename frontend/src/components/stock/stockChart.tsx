"use client"
import React, { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Card, Center, Group, Button, Select, ActionIcon, Tooltip } from '@mantine/core';
import { StockData } from './chartWrapper';
import { prefetchDNS } from 'react-dom';
import { LineChart } from '@mantine/charts';
import { IconGraph } from '@tabler/icons-react';




const StockChart = ({ data, timeframe, handleMakePrediction, setTimeframe }: {
    data: {
        closingPrice: StockData[],
        openPrice: StockData[],
        highPrice: StockData[],
        volume: StockData[]
    },
    handleMakePrediction: () => void,
    timeframe: string,
    setTimeframe: (timeframe: string) => void
}) => {

    const [selected, setSelected] = useState<'closingPrice' | 'openPrice' | 'highPrice' | 'volume'>('closingPrice');
    const timeframeOptions = ['1W', '1M', '3M', 'YTD', '1Y', 'All']


    const handleSelection = (type: 'closingPrice' | 'openPrice' | 'highPrice' | 'volume' | string | null) => {
        if (type == null || (type != 'closingPrice' && type != 'openPrice' && type != 'highPrice' && type != 'volume')) {
            setSelected('closingPrice');
            return;
        }
        setSelected(type);
    }


    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" >
            <Group justify='space-between'>
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
                <Tooltip label='Predict closing price' position='left' withArrow>
                    <ActionIcon variant="filled" color='blue' radius='xl' onClick={() => handleMakePrediction()}>
                        <IconGraph size={20} />
                    </ActionIcon>
                </Tooltip>
            </Group>
            <div style={{ height: '60vh', marginTop: 10 }}>
                <LineChart
                    h="100%"
                    data={data[selected]}
                    dataKey='date'
                    yAxisLabel='Price ($)'
                    xAxisLabel='Date'
                    series={
                        [
                            {
                                name: 'value',
                                color: 'blue',
                            },
                            {
                                name: 'predicted',
                                color: 'red',
                            }
                        ]
                    }
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

export default StockChart