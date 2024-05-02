"use client";
import React, {useEffect, useState} from 'react'
import { useForm } from '@mantine/form';
import { Grid, GridCol, TextInput, Slider, Fieldset, NumberInput, MultiSelect, Button, Select, Text, Title, Group, rem, LoadingOverlay, Box } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { useRouter } from 'next/navigation'
import { getSimulatedDate } from '@/lib/timeDifference';




interface FormValues {
    model_name: string | undefined;
    model_type: string | null;
    stock: string | null;
    date_range: DatesRangeValue | undefined;
    features: string[];
    epochs: number | undefined;
    window_size: number | undefined;
}


interface ModelFormProps {
    settings: {
        stocks: {
            name: string,
            features: string[],
            minimum_date: string,
        }[],
        types: string[]
    },
    ticker: string
}

const icon = <IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;


const CreateModelForm = ({ settings, ticker }: ModelFormProps) => {
    const router = useRouter();
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const monthBefore = new Date(currentDate);
    const dayBefore = new Date(currentDate);
    monthBefore.setMonth(monthBefore.getMonth() - 1);
    dayBefore.setDate(dayBefore.getDate() - 1);

    useEffect(() => {
        setCurrentDate(getSimulatedDate(localStorage))
    }
    , []);
    

    const form = useForm<FormValues>({
        initialValues: {
            model_name: '',
            model_type: settings.types[0],
            stock: ticker,
            date_range: [null, null],
            features: ["close"],
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
                body: JSON.stringify({
                    model_name: form.values.model_name,
                    model_type: form.values.model_type,
                    stock: form.values.stock,
                    date_range: form.values.date_range,
                    features: form.values.features,
                    epochs: form.values.epochs,
                    window_size: form.values.window_size,
                    curr_date: currentDate
                }),
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
                                    data={settings.stocks.map((s) => (s.name))} {...form.getInputProps('stock')}
                                    onChange={(val) => {
                                        form.setValues({
                                            ...form.values,
                                            features: ["close"],
                                            date_range: [null, null],
                                            stock: val
                                        });
                                    }}
                                />
                                <Select
                                    disabled={disabled}
                                    label="Model Type"
                                    placeholder='Select model type'
                                    data={settings.types}
                                    {...form.getInputProps('model_type')}
                                />
                            </Fieldset>
                        </GridCol>
                        <GridCol>
                            <Fieldset legend='Training Info'>
                                <DatePickerInput
                                    disabled={disabled}
                                    minDate={
                                        form.getValues().stock
                                            ? new Date(settings.stocks.find((s) => s.name === form.getValues().stock)?.minimum_date as string)
                                            : undefined
                                    }
                                    maxDate={dayBefore}
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
                                    data={form.getValues().stock ? settings.stocks.find((s) => s.name === form.getValues().stock)?.features : []}
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
                        type='submit'
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