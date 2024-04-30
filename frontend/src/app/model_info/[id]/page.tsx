import React from 'react'
import { Grid, GridCol, Title, RingProgress, Group, Text, Card, Badge, Box, CardSection, Blockquote } from '@mantine/core';
import ModelCharts from '@/components/model_info/modelCharts';
import { BarChart } from '@mantine/charts';
import { IconInfoCircle } from '@tabler/icons-react';



interface ModelData {
    name: string;
    type: string;
    stock: string;
    features: string[];
    epochs: number;
    window_size: number;
}


const Page = async ({ params }: { params: { id: string } }) => {

    const model_data = await fetch(`http://127.0.0.1:5000/model?id=${params.id}`, { next: { revalidate: 0 } }).then((res) => res.json());
    const icon = <IconInfoCircle />;

    return (
        <div>
            <Grid mb={20} align='center'>
                <GridCol span={4}>
                    <Blockquote color="blue" cite={model_data.created} icon={icon}>
                        <Group justify='center'>
                            <Title order={3}>
                                {model_data.model_name}

                            </Title>
                            <Badge color="green" ml="sm">
                                {model_data.symbol}
                            </Badge>
                        </Group>
                        This model was trained on {model_data.symbol} stock data using the below features. 
                        The model uses a <strong>{model_data.model_type}</strong> and was trained for <strong>{model_data.epochs}</strong> epochs with a window size of <strong>{model_data.window}</strong>.
                        <Group mt="xl" justify='center'>
                            {
                                model_data.features.map((feature: string) => (
                                    <Badge key={feature} color="blue" mr="sm">
                                        {feature}
                                    </Badge>
                                ))
                            }
                        </Group>
                    </Blockquote>

                </GridCol>
                <GridCol span={8}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" >
                        <Group>
                            <RingProgress
                                size={180}
                                label={
                                    <Text size="xs" ta="center">
                                        Direction Accuracy: {Math.round(model_data.direction * 100 * 100) / 100}%
                                    </Text>
                                }
                                sections={[
                                    { value: model_data.direction * 100, color: 'green' },
                                ]}
                            />
                            <BarChart
                                h={300}
                                w={300}
                                dataKey="name"
                                withLegend
                                withTooltip
                                series={
                                    [
                                        { name: `MAPE`, color: 'pink' },
                                        { name: `RMSE`, color: 'grape' }
                                    ]
                                }
                                data={[
                                    { MAPE: Math.round(model_data.mape * 1000) / 1000, RMSE: Math.round(model_data.rmse * 1000) / 1000, name: 'Metrics' },
                                ]}
                            />
                            <BarChart
                                h={300}
                                w={300}
                                dataKey="name"
                                withLegend
                                withTooltip
                                series={
                                    [
                                        { name: `Loss`, color: 'blue' },
                                        { name: `Val Loss`, color: 'red' }
                                    ]
                                }
                                data={[
                                    {
                                        Loss: Math.round(model_data.loss.loss[model_data.loss.val_loss.length - 1] * 100) / 100,
                                        "Val Loss": Math.round(model_data.loss.val_loss[model_data.loss.loss.length - 1] * 100) / 100, name: 'Final Losses'
                                    },
                                ]}
                            />
                        </Group>
                    </Card>
                </GridCol>
            </Grid>
            <ModelCharts predicted={model_data.predicted} actual={model_data.actual} loss={model_data.loss.loss} val_loss={model_data.loss.val_loss} />
        </div>
    )
}

export default Page