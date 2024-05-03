"use client";
import React from 'react'
import { Card, Center, Grid, GridCol, Stack, Text, Button, Group, Divider, Skeleton, Tooltip } from '@mantine/core';
import { Table, TableThead, TableTh, TableTr, TableTbody } from '@mantine/core';
import { IconGraph } from '@tabler/icons-react';

function getColor(percentChange: number) {
    return percentChange > 0 ? 'green' : 'red';
}

const SkeletonValue = (obj: any, value: string) => {
    if (obj) {
        if (value == "volume") {
            return <p>{obj[value]}</p>
        }
        return <p>{obj[value].toFixed(2)}</p>
    }
    else {
        return <Skeleton height={20} />
    }
}

const PriceSummary = ({ mostRecent, modelStats, handleMakePrediction }: {
    mostRecent: any,
    modelStats: any,
    handleMakePrediction: () => void
}) => {
    return (
        <div>
            <div style={{ marginBottom: 20, padding:10 }}>
                <Stack>
                    <Stack ta="center">
                        <Group justify="space-between">
                            <Text size='xl' fw={700}>Price</Text>
                            {mostRecent ?
                                <Text c="dimmed" size="sm">
                                    {mostRecent.date}
                                </Text>
                                :
                                <Skeleton width="50%" height={20} />
                            }
                        </Group>
                        <Tooltip label="Since last close" position="top" withArrow>
                            {
                                mostRecent ?
                                    <Text c={getColor(mostRecent.percentChange)}>
                                        {
                                            mostRecent.priceChange > 0 ? '▲' : '▼'
                                        }
                                        ${Math.abs(mostRecent.priceChange).toFixed(2)}  ({Math.abs(mostRecent.percentChange * 100).toFixed(2)} %)
                                    </Text>
                                    :
                                    <Skeleton height={20} />
                            }
                        </Tooltip>
                    </Stack>
                    <Grid>
                        <GridCol span={6} ta="center">
                            <h4>Close</h4>
                            {
                                SkeletonValue(mostRecent, "close")
                            }
                        </GridCol>
                        <GridCol span={6} ta="center">
                            <h4>Open</h4>
                            {
                                SkeletonValue(mostRecent, "open")
                            }
                        </GridCol>
                        <GridCol span={6} ta="center">
                            <h4>High</h4>
                            {
                                SkeletonValue(mostRecent, "high")
                            }
                        </GridCol>
                        <GridCol span={6} ta="center">
                            <h4>Low</h4>
                            {
                                SkeletonValue(mostRecent, "low")
                            }
                        </GridCol>
                        <GridCol span={6} ta="center">
                            <h4>Volume</h4>
                            {
                                SkeletonValue(mostRecent, "volume")
                            }
                        </GridCol>
                    </Grid>
                </Stack>
            </div>
            <Divider />
            <div style={{ marginTop: 20, padding:10 }}>
                <Stack>
                    <Stack ta="center">
                        <Group justify='space-between'>
                            <Text size='xl' fw={700}>Prediction</Text>
                            {
                                modelStats && modelStats.nextDate ?
                                    <Text c="dimmed" size="sm">
                                        {modelStats.nextDate}
                                    </Text>
                                    :
                                    <Skeleton width={100} height={20} />
                            }
                        </Group>
                        {
                            modelStats && modelStats.predictedPercentChange && modelStats.predictedPriceChange ?
                                <Text c={getColor(modelStats.predictedPercentChange)}>
                                    {
                                        modelStats.predictedPriceChange > 0 ? '▲' : '▼'
                                    }
                                    ${Math.abs(modelStats.predictedPriceChange).toFixed(2)}  ({Math.abs(modelStats.predictedPercentChange * 100).toFixed(2)} %)
                                </Text>
                                :
                                <Skeleton width={200} height={20} />
                        }
                    </Stack>
                    <Table mt={20}>
                        <TableThead>
                            <TableTr>
                                <TableTh fw={500} ta="center">RMSE</TableTh>
                                <TableTh fw={500} ta="center">Direction</TableTh>
                                <TableTh fw={500} ta="center">MAPE</TableTh>
                            </TableTr>
                        </TableThead>
                        <TableTbody>
                            <TableTr>
                                <TableTh fw={300} ta="center">
                                    {
                                        modelStats && modelStats.rmse !== 0 ?
                                            Math.round(modelStats.rmse * 100) / 100
                                            :
                                            <Skeleton width={50} height={20} />
                                    }
                                </TableTh>
                                <TableTh fw={300} ta="center">
                                    {
                                        modelStats && modelStats.direction !== 0  ?
                                            Math.round(modelStats.direction * 100) / 100
                                            :
                                            <Skeleton width={50} height={20} />
                                    }
                                </TableTh>
                                <TableTh fw={300} ta="center">
                                    {
                                        modelStats && modelStats.mape !== 0 ?
                                            Math.round(modelStats.mape * 100) / 100
                                            :
                                            <Skeleton width={50} height={20} />
                                    }
                                </TableTh>
                            </TableTr>
                        </TableTbody>
                    </Table>
                </Stack>
                <Group justify='center' mt={20}>
                    <Button variant="filled" onClick={() => handleMakePrediction()}>
                        <Group>
                            <IconGraph />
                            Make Prediction
                        </Group>
                    </Button>
                </Group>
            </div>
        </div >
    )
}

export default PriceSummary