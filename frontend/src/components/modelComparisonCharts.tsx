import React from 'react'
import { BarChart } from '@mantine/charts'
import { Grid, GridCol, Text, Card, CardSection } from '@mantine/core'

interface ModelComparisonChartsProps {
    models: {
        rmse: number,
        mape: number,
        model_name: string,
        direction: number,
        _id: string
    }[],
    selectedModelId: string | null
}

const ModelComparisonCharts = ({ models, selectedModelId }: ModelComparisonChartsProps) => {
    const rmseData = models.map(model => {
        return {
            Model: model.model_name,
            RMSE: Math.round(model.rmse * 100) / 100
        }
    })

    const mapeData = models.map(model => {
        return {
            Model: model.model_name,
            MAPE: Math.round(model.mape * 100) / 100,
        }
    })

    const directionData = models.map(model => {
        return {
            Model: model.model_name,
            "Direction Accuracy": Math.round(1000 * model.direction) / 1000
        }
    })

    return (
        <div>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" mb={30}>
                <CardSection withBorder p={10}>
                    <Text size="xl" fw={500}>Model Comparison</Text>
                </CardSection>
                <Grid mt={20}>
                    <GridCol span={{ sm: 12, md: 4 }}>
                        <Text size="md" ta="center" fw={300} mb={20}>
                            Root Mean Square Error
                        </Text>
                        <BarChart
                            h={300}
                            data={rmseData}
                            dataKey='Model'
                            series={
                                [
                                    { name: 'RMSE', color: 'indigo' }
                                ]
                            }
                            color='blue'
                            style={{ height: '500px' }}
                        />
                    </GridCol>
                    <GridCol span={{ sm: 12, md: 4 }}>
                        <Text size="md" ta="center" fw={300} mb={20}>
                            Mean Absolute Percent Error
                        </Text>
                        <BarChart
                            h={300}
                            data={mapeData}
                            dataKey='Model'
                            series={
                                [
                                    { name: 'MAPE', color: 'teal' }
                                ]
                            }
                            color='blue'
                            style={{ height: '500px' }}
                        />
                    </GridCol>
                    <GridCol span={{ sm: 12, md: 4 }}>
                        <Text size="md" ta="center" fw={300} mb={20}>
                            Direction Accuracy
                        </Text>
                        <BarChart
                            h={300}
                            data={directionData}
                            dataKey='Model'
                            series={
                                [
                                    { name: 'Direction Accuracy', color: 'pink' }
                                ]
                            }
                            color='blue'
                            style={{ height: '500px' }}
                        />
                    </GridCol>
                </Grid>
            </Card>
        </div>
    )
}

export default ModelComparisonCharts