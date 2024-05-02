import React from 'react'
import { Grid, GridCol, Title, RingProgress, Group, Text, Card, Badge, Box, CardSection, Blockquote, Stack } from '@mantine/core';
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


function formatDate(dateString: string) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`
}

const Page = async ({ params }: { params: { id: string } }) => {

    const model_data = await fetch(`http://127.0.0.1:5000/model?id=${params.id}`, { next: { revalidate: 0 } }).then((res) => res.json());
    const icon = <IconInfoCircle />;
    return (
        <div>
            <Grid mb={20} align='center'>
                <GridCol span={5}>
                    <Blockquote color="blue" cite={formatDate(model_data.created)} icon={icon}>
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
                <GridCol span={7}>
                    <Group justify='center'>
                        <Stack >
                            <Text size="xl" ta="center" fw={700}>
                                Direction
                            </Text>
                            <RingProgress
                                size={140}
                                label={
                                    <Text size="lg" fw={500} ta="center">
                                        {Math.round(model_data.direction * 100 * 100) / 100}%
                                    </Text>
                                }
                                sections={[
                                    { value: (1 - model_data.direction * 100) * 100, color: 'red' },
                                    { value: model_data.direction * 100, color: 'green' },
                                ]}
                            />
                        </Stack>
                        <Stack justify='center' >
                            <Text size="xl" ta="center" fw={700}>
                                MAPE
                            </Text>
                            <RingProgress
                                size={140}
                                label={
                                    <Text size="lg" fw={500} ta="center">
                                        {Math.round(model_data.mape * 100) / 100}%
                                    </Text>
                                }
                                sections={[
                                    { value: (1 - model_data.mape / 10) * 100, color: 'green' },
                                    { value: (model_data.mape / 10) * 100, color: 'red' },
                                ]}
                            />
                        </Stack>
                        <Stack >
                            <Text size="xl" ta="center" fw={700}>
                                RMSE
                            </Text>
                            <RingProgress
                                size={140}
                                label={
                                    <Text size="lg" fw={500} ta="center">
                                        {Math.round(model_data.rmse * 100) / 100}
                                    </Text>
                                }
                                sections={[
                                    { value: (1 - model_data.rmse / 10) * 100, color: 'green' },
                                    { value: (model_data.rmse / 10) * 100, color: 'red' },
                                ]}
                            />

                        </Stack>
                    </Group>
                </GridCol>
            </Grid>
            <ModelCharts predicted={model_data.predicted} actual={model_data.actual} loss={model_data.loss.loss} val_loss={model_data.loss.val_loss} />
        </div>
    )
}

export default Page