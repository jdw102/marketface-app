"use client";
import React from 'react'
import { Grid, GridCol, Card, Title, CardSection, Text } from '@mantine/core';
import { LineChart, BarChart } from '@mantine/charts';






interface ModelChartsProps {
    actual: {
        date: string,
        close: number,
    }[],
    predicted: {
        date: string,
        close: number,
    }[],
    loss: number[],
    val_loss: number[]
}



function formatDate(dateString: string) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
}



const ModelCharts = ({ actual, predicted, loss, val_loss }: ModelChartsProps) => {

    const lossData = loss.map((item, index) => {
        return {
            Epoch: index + 1,
            Training: Math.round(item * 1000) / 1000,
            Validation: Math.round(val_loss[index] * 1000) / 1000,
        }
    })

    const closeDataFull: { Date: string; Actual: number; Predicted?: number }[] = actual.map(item => {
        return {
            Date: formatDate(item.date),
            Actual: item.close
        }
    });
    predicted.forEach((item, index) => {
        closeDataFull[actual.length - predicted.length + index].Predicted = Math.round(item.close * 100) / 100;
    });

    const closeData = closeDataFull.slice(closeDataFull.length - predicted.length, closeDataFull.length);

    const domainMin = Math.round(Math.min(...closeData.map(item => item.Actual)) - 5);
    const domainMax = Math.round(Math.max(...closeData.map(item => item.Actual)) + 5);
    const ticks = Array.from({ length: 5 }, (_, i) => domainMin + i * (domainMax - domainMin) / 4);
    return (
        <div>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" mb={30}>
                <CardSection withBorder p={10} mb={20}>
                    <Text size="xl" fw={500}>Training Loss</Text>
                </CardSection>
                <Grid>
                    <GridCol span={{ sm: 12, md: 8 }}>
                        <LineChart
                            h={300}
                            data={lossData}
                            xAxisLabel='Epochs'
                            yAxisLabel='Loss'
                            withLegend
                            dataKey='Epoch'
                            series={[
                                { name: 'Training', color: 'blue' },
                                { name: 'Validation', color: 'red' },
                            ]}
                            curveType='linear'

                        />
                    </GridCol>
                    <GridCol span={{ sm: 12, md: 4 }}>
                        <BarChart
                            h={300}
                            dataKey="name"
                            withLegend
                            withTooltip
                            series={
                                [
                                    { name: `Training`, color: 'blue' },
                                    { name: `Validation`, color: 'red' }
                                ]
                            }
                            data={[
                                {
                                    Training: Math.round(loss[val_loss.length - 1] * 100) / 100,
                                    Validation: Math.round(val_loss[loss.length - 1] * 100) / 100, name: 'Final Losses'
                                },
                            ]}
                        />
                    </GridCol>
                </Grid>
            </Card>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" >
                <CardSection withBorder p={10} mb={20}>
                    <Text size="xl" fw={500}>Price Prediction</Text>
                </CardSection>
                <Grid>
                    <GridCol span={{ sm: 12, md: 7 }}>
                        <LineChart
                            h={300}
                            data={closeDataFull}
                            xAxisLabel='Date'
                            yAxisLabel='Close Price'
                            withLegend
                            dataKey='Date'

                            series={[
                                { name: 'Actual', color: 'indigo' },
                                { name: 'Predicted', color: 'teal' },
                            ]}
                            curveType='linear'
                            withDots={false}
                        />
                    </GridCol>
                    <GridCol span={{ sm: 12, md: 5 }}>
                        <LineChart
                            h={300}
                            data={closeData}
                            xAxisLabel='Date'
                            yAxisLabel='Close Price'
                            withLegend
                            yAxisProps={{
                                domain:
                                    [domainMin, domainMax],
                                ticks: ticks
                            }}
                            dataKey='Date'
                            series={[
                                { name: 'Actual', color: 'indigo' },
                                { name: 'Predicted', color: 'teal' },
                            ]}
                            curveType='linear'
                        />
                    </GridCol>
                </Grid>
            </Card>
        </div>
    );
}

export default ModelCharts;

