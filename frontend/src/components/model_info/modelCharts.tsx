"use client";
import React from 'react'
import { Grid, GridCol, Card } from '@mantine/core';
import { Line } from 'react-chartjs-2';
import { CategoryScale, Chart, LinearScale, PointElement, LineElement, Tooltip, ChartOptions, Title, Legend } from "chart.js";



Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(Tooltip);
Chart.register(Title);
Chart.register(Legend);


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
    const labels = actual.map(item => formatDate(item.date));
    const actualData = actual.map(item => (item.close));
    const predictedData = predicted.map(item => (item.close));
    const zoomedOutPredictedData = Array(actualData.length - predictedData.length).fill(NaN).concat(predictedData);

    const zoomedInActualData = actualData.slice(actualData.length - predicted.length, actualData.length);
    const zoomedInLabels = labels.slice(labels.length - predicted.length, labels.length);
    const outData = {
        labels: labels,
        datasets: [
            {
                label: 'Predictions',
                data: zoomedOutPredictedData,
                borderColor: 'rgb(192, 75, 75)',
                fill: false,
                radius: 0
            },
            {
                label: 'Actual',
                data: actualData,
                borderColor: 'rgb(75, 192, 192)',
                fill: false,
                radius: 0
            }
        ],
    };

    const outOptions: ChartOptions<'line'> = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Price'
                }
            }
        },
        plugins: {
            tooltip: {
                enabled: false,
            },
            title: {
                display: true,
                text: 'Entire Training Period'
            }
        },

    };

    const inOptions: ChartOptions<'line'> = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Price'
                }
            }
        },
        plugins: {
            tooltip: {
                enabled: false,
            },
            title: {
                display: true,
                text: 'Testing Period'
            }
        }
    };

    const lossOptions: ChartOptions<'line'> = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Epoch'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Loss'
                }
            }
        },
        plugins: {
            tooltip: {
                enabled: false,
            },
            title: {
                display: true,
                text: 'Loss Over Time'
            }
        }
    };



    const inData = {
        labels: zoomedInLabels,
        datasets: [
            {
                label: 'Predictions',
                data: predictedData,
                borderColor: 'rgb(192, 75, 75)',
                fill: false,
                radius: 0
            },
            {
                label: 'Actual',
                data: zoomedInActualData,
                borderColor: 'rgb(75, 192, 192)',
                fill: false,
                radius: 0
            }
        ],
    };

    const lossData = {
        labels: Array.from({ length: loss.length }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Loss',
                data: loss,
                borderColor: 'blue',
                fill: false,
                radius: 0
            },
            {
                label: 'Validation Loss',
                data: val_loss,
                borderColor: 'red',
                fill: false,
                radius: 0
            }
        ],
    };

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" >
            <Grid>
                <GridCol span={{ sm: 12, md: 6 }}>
                    <Line data={lossData} options={lossOptions} />
                </GridCol>
                <GridCol span={{ sm: 12, md: 6 }}>
                    <Line data={inData} options={inOptions} />
                </GridCol>
                <GridCol span={{ sm: 12, md: 12 }}>
                    <Line data={outData} options={outOptions} />
                </GridCol>

            </Grid>
        </Card>
    );
}

export default ModelCharts;

