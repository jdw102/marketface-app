import React from 'react'
import { Grid, GridCol, Title, RingProgress, Group, Text, Card, Badge, Box, CardSection, Blockquote, Stack, Table, TableThead, TableTh, TableTbody, TableTr, Center } from '@mantine/core';
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
                <GridCol span={{ xs: 12, md: 6 }}>
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
                <GridCol span={{ xs: 12, md: 6 }}>
                    <Group justify='center'>
                        <Stack>
                            <RingProgress
                                size={200}
                                thickness={20}
                                label={
                                    <div>
                                        <Text size="lg" fw={500} ta="center">
                                            Direction:
                                        </Text>
                                        <Text size="lg" fw={500} ta="center">
                                            {Math.round(model_data.direction * 100 * 100) / 100}%
                                        </Text>
                                    </div>
                                }
                                sections={[
                                    { value: (1 - model_data.direction * 100) * 100, color: 'red' },
                                    { value: model_data.direction * 100, color: 'green' },
                                ]}
                            />
                        </Stack>
                        <Center>
                            <Table highlightOnHover highlightOnHoverColor='blue.0' w="50%" border={2}>
                                <TableThead>
                                    <TableTr>
                                        <TableTh ta="center"></TableTh>
                                        <TableTh ta="center">RMSE</TableTh>
                                        <TableTh ta="center">Direction</TableTh>
                                        <TableTh ta="center">MAPE</TableTh>
                                    </TableTr>
                                </TableThead>
                                <TableTbody>
                                    <TableTr>
                                        <TableTh ta="center">Testing</TableTh>
                                        <TableTh fw={300} ta="center">{Math.round(model_data.rmse * 100) / 100}</TableTh>
                                        <TableTh fw={300} ta="center">{Math.round(model_data.direction * 10000) / 10000}</TableTh>
                                        <TableTh fw={300} ta="center">{Math.round(model_data.mape * 100) / 100}</TableTh>
                                    </TableTr>
                                    <TableTr>
                                        <TableTh ta="center">Last Deployment</TableTh>
                                        <TableTh fw={300} ta="center">{model_data.running_rmse ? Math.round(model_data.running_rmse * 100) / 100 : "N/A"}</TableTh>
                                        <TableTh fw={300} ta="center">{model_data.running_dir ? Math.round(model_data.running_dir * 10000) / 10000 : "N/A"}</TableTh>
                                        <TableTh fw={300} ta="center">{model_data.running_mape ? Math.round(model_data.running_mape * 100) / 100 : "N/A"}</TableTh>
                                    </TableTr>
                                </TableTbody>
                            </Table>
                        </Center>
                    </Group>
                </GridCol>
            </Grid>
            <ModelCharts predicted={model_data.predicted} actual={model_data.actual} loss={model_data.loss.loss} val_loss={model_data.loss.val_loss} />
        </div>
    )
}

export default Page