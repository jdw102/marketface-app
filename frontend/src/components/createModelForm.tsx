"use client";
import React from 'react'
import { useForm } from '@mantine/form';
import { Grid, GridCol, TextInput, Slider, Fieldset, NumberInput, MultiSelect, Button, Select, Text, Title, Group, rem, LoadingOverlay, Box } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { useRouter } from 'next/navigation'




interface FormValues {
    model_name: string | undefined;
    model_type: string | null;
    stock: string | null;
    date_range: DatesRangeValue | undefined;
    features: string[];
    epochs: number | undefined;
    window_size: number | undefined;
}

const icon = <IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;


const CreateModelForm = () => {
    const router = useRouter();

    const form = useForm<FormValues>({
        initialValues: {
            model_name: '',
            model_type: 'LSTM',
            stock: 'NVDA',
            date_range: [new Date(2014, 0, 2), new Date(2019, 1, 1)],
            features: ["open", "high", "low", "close", "volume"],
            epochs: 10,
            window_size: 10,
        },
        validate: {
            model_name: (value) => value == '' && 'Model name is required',
            model_type: (value) => value == '' && 'Model type is required',
            stock: (value) => !value && 'Stock is required',
            date_range: (value) => !value && 'Date range is required',
            features: (value) => value.length < 1 && 'Features are required',
            epochs: (value) => !value && 'Epochs are required',
            window_size: (value) => !value && 'Window size is required',
        }
    });

    const [disabled, setDisabled] = React.useState(false);

    const handleSubmit = async () => {
        try {
            setDisabled(true);
            const response = await fetch(`http://127.0.0.1:5000/train`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form.values),
            });
            form.reset();
            setDisabled(false);
            const data = await response.json();
            router.push(`/model_info/${data.model_id}`);
            
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Title order={3}>Train a New Model</Title>
            <Text mt={5} mb={15} fs="italic" c="dimmed" size='sm'>
                Fill out the form below to train a new model.
                The model will be trained on the specified stock using the selected features and date range.
            </Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Box pos="relative">
                    <Grid>
                        <GridCol>
                            <Fieldset legend='Basic Info'>
                                <TextInput
                                    disabled={disabled}
                                    label="Model Name"
                                    placeholder="Enter model name"
                                    {...form.getInputProps('model_name')}
                                />
                                <Select
                                    disabled={disabled}
                                    label="Stock"
                                    placeholder='Select stock'
                                    data={['AAPL', 'NVDA', 'GOOGL', 'AMZN', 'TSLA']} {...form.getInputProps('stock')}
                                />
                                <Select
                                    disabled={disabled}
                                    label="Model Type"
                                    placeholder='Select model type'
                                    data={['LSTM', 'GRU', 'RNN']}
                                    {...form.getInputProps('model_type')}
                                />
                            </Fieldset>
                        </GridCol>
                        <GridCol>
                            <Fieldset legend='Training Info'>
                                <DatePickerInput
                                    disabled={disabled}
                                    label="Training Range"
                                    type="range"
                                    leftSection={icon}
                                    leftSectionPointerEvents="none"
                                    placeholder="Select training date range"
                                    {...form.getInputProps('date_range')}
                                />
                                <NumberInput
                                    disabled={disabled}
                                    label="Epochs"
                                    allowNegative={false}
                                    allowDecimal={false}
                                    min={1}
                                    placeholder="Enter epochs"
                                    {...form.getInputProps('epochs')}
                                />
                                <MultiSelect
                                    disabled={disabled}
                                    label="Features"
                                    placeholder="Select features"
                                    data={['open', 'high', 'low', 'close', 'volume']}
                                    {...form.getInputProps('features')}
                                />
                                <Text mt={5} mb={5} fw={500} size='sm'>Window Size</Text>
                                <Slider
                                    disabled={disabled}
                                    min={1}
                                    max={100}
                                    label={(value) => `${value} days`}
                                    step={1}
                                    mb={10}
                                    marks={
                                        [
                                            { value: 1, label: '1' },
                                            { value: 25, label: '25' },
                                            { value: 50, label: '50' },
                                            { value: 75, label: '75' },
                                            { value: 100, label: '100' }
                                        ]
                                    }
                                    {...form.getInputProps('window_size')}
                                />
                            </Fieldset>
                        </GridCol>
                    </Grid>
                    <LoadingOverlay visible={disabled}
                        zIndex={1000}
                        title="Training Model..."
                        overlayProps={{ radius: 'sm', blur: 2 }}
                        loaderProps={{ color: 'pink', type: 'bars' }} />
                </Box>
                <Group w="100%" mt={20}>
                    <Button
                        disabled={disabled}
                        type="reset"
                        variant="light"
                        onClick={() => {
                            form.reset();
                        }}
                    >
                        Clear
                    </Button>
                    <Button
                        type="submit"
                        disabled={disabled}
                    >
                        Train Model
                    </Button>
                </Group>
            </form>

        </div>
    )
}

export default CreateModelForm