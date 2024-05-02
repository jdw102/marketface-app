"use client"
import React, { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Card, Center, Group, Button, Select, ActionIcon, Tooltip, LoadingOverlay, Paper, Text, Badge, Modal, Table, TableThead, TableTh, TableTr, TableTbody } from '@mantine/core';
import { StockData } from './chartWrapper';
import { prefetchDNS } from 'react-dom';
import { LineChart, ChartTooltip, ChartLegend } from '@mantine/charts';
import { IconGraph } from '@tabler/icons-react';
import { loadStaticPaths } from 'next/dist/server/dev/static-paths-worker';
import { IconInfoCircle } from '@tabler/icons-react';



const StockChart = ({ data, timeframe, handleMakePrediction, setTimeframe, loading, predicting, modelStats }: {
    data: {
        closingPrice: StockData[],
        openPrice: StockData[],
        highPrice: StockData[],
        volume: StockData[]
    },
    handleMakePrediction: () => void,
    timeframe: string,
    setTimeframe: (timeframe: string) => void,
    loading: boolean,
    predicting: boolean,
    modelStats: any
}) => {

    console.log(modelStats)

    const [selected, setSelected] = useState<'closingPrice' | 'openPrice' | 'highPrice' | 'volume'>('closingPrice');
    const [showModal, setShowModal] = useState<boolean>(false);
    const timeframeOptions = ['1W', '1M', '3M', 'YTD', '1Y', 'All']


    const handleSelection = (type: 'closingPrice' | 'openPrice' | 'highPrice' | 'volume' | string | null) => {
        if (type == null || (type != 'closingPrice' && type != 'openPrice' && type != 'highPrice' && type != 'volume')) {
            setSelected('closingPrice');
            return;
        }
        setSelected(type);
    }

    const domainMin = Math.min(...data[selected].map((item) => item.value ? item.value : item.predicted ? item.predicted : 0));
    const domainMax = Math.max(...data[selected].map((item) => item.value ? item.value : item.predicted ? item.predicted : 0));
    const ticks = Array.from({ length: 5 }, (_, i) => Math.round(domainMin + (domainMax - domainMin) / 4 * i));


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
                <Group>
                    <Tooltip
                        label="Model Info"
                        position="left"
                        withArrow
                    >
                        <ActionIcon variant='transparent' size='lg' radius='xl' color='gray' onClick={() => setShowModal(true)}>
                            <IconInfoCircle size={60} />
                        </ActionIcon>
                    </Tooltip>
                    <Button variant="filled" onClick={() => handleMakePrediction()}>
                        <Group>
                            <IconGraph />
                            Make Prediction
                        </Group>
                    </Button>
                </Group>
            </Group>
            <div style={{ height: '60vh', marginTop: 10 }}>
                <LineChart
                    h="100%"
                    data={data[selected]}
                    dataKey='date'
                    yAxisLabel='Price ($)'
                    withLegend
                    connectNulls
                    yAxisProps={{
                        domain: [domainMin, domainMax],
                        ticks: ticks
                    }}
                    tooltipAnimationDuration={300}
                    xAxisProps={{
                        tickFormatter: (date: string) => {
                            return date.split(',')[0]
                        }
                    }}
                    tooltipProps={{
                        content: ({ label, payload }) => {
                            payload = payload?.filter((item) => item.name != 'interpolation');
                            payload?.map((item) => {
                                if (item.name == 'value') {
                                    item.name = 'Actual';
                                }
                                if (item.name == 'predicted') {
                                    item.name = 'Predicted';
                                }
                            })
                            return <ChartTooltip label={label} payload={payload} />
                        },
                    }}
                    legendProps={{
                        content: ({ payload }) => {
                            if (!payload) {
                                return null;
                            }
                            payload = payload.filter((item) => item.dataKey != 'interpolation');
                            payload?.map((item) => {
                                if (item.dataKey == 'value') {
                                    item.dataKey = 'Actual';
                                }
                                if (item.dataKey == 'predicted') {
                                    item.dataKey = 'Predicted';
                                }
                            })
                            return <ChartLegend
                                payload={payload}
                                onHighlight={() => { }}
                                legendPosition={'top'}
                            />
                        }
                    }}
                    series={
                        [
                            {
                                name: 'value',
                                color: 'blue',
                            },
                            {
                                name: 'predicted',
                                color: 'red',
                            },
                            {
                                name: 'interpolation',
                                color: 'red',
                                strokeDasharray: '5 5'
                            }
                        ]
                    }
                    withDots={data[selected].length < 50}
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
            <LoadingOverlay
                visible={loading || predicting}
                loaderProps={{
                    type: predicting ? 'bars' : 'spinner',
                }}
            />
            <Modal opened={showModal} onClose={() => setShowModal(false)} title="Running Stats" centered>
                <Text size="sm">
                    The {modelStats && modelStats.name} model's predictions are compared to the actual stock prices. The following metrics describe its current performance:
                </Text>
                {modelStats &&
                    <Table mt={20}>
                        <TableThead>
                            <TableTr>
                                <TableTh ta="center">RMSE</TableTh>
                                <TableTh ta="center">Direction</TableTh>
                                <TableTh ta="center">MAPE</TableTh>
                            </TableTr>
                        </TableThead>
                        <TableTbody>
                            <TableTr>
                                <TableTh fw={300} ta="center">{Math.round(modelStats.rmse * 100) / 100}</TableTh>
                                <TableTh fw={300} ta="center">{Math.round(modelStats.direction * 100) / 100}</TableTh>
                                <TableTh fw={300} ta="center">{Math.round(modelStats.mape * 100) / 100}</TableTh>
                            </TableTr>
                        </TableTbody>
                    </Table>
                }
            </Modal>
        </Card>
    )
}

export default StockChart