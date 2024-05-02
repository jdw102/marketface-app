"use client"
import React, { useState } from 'react'
import { useDisclosure } from '@mantine/hooks';
import { Table, TableTr, TableTh, TableThead, TableTbody, Text, Button, Anchor, ActionIcon, Modal, Group, UnstyledButton, Card, CardSection, Radio } from '@mantine/core';
import { IconEye, IconTrash } from '@tabler/icons-react';
import { handleWebpackExternalForEdgeRuntime } from 'next/dist/build/webpack/plugins/middleware-plugin';
import { useRouter } from 'next/navigation';

interface ModelTableProps {
    models: any
    setSelectedModel: any,
    selectedModelId: any,
    initialSelected: any
}


function formatDate(dateString: string) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`
}


const ModelTable = ({ models, setSelectedModel, selectedModelId, initialSelected }: ModelTableProps) => {

    const router = useRouter();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [sortColumn, setSortColumn] = useState<string>('created');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const handleDelete = (id: string | null) => {
        fetch(`http://127.0.0.1:5000/delete_model?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => router.refresh())
    };
    const [opened, { open, close }] = useDisclosure(false);

    const sortedModels = [...models].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const columns = [
        {
            text: 'Model Name',
            sort: 'model_name'
        },
        {
            text: 'Stock',
            sort: 'symbol'
        },
        {
            text: 'Features',
            sort: 'features'
        },
        {
            text: 'Model Type',
            sort: 'model_type'
        },
        {
            text: 'Epochs',
            sort: 'epochs'
        },
        {
            text: 'Window Size',
            sort: 'window'
        },
        {
            text: 'MAPE',
            sort: 'mape'
        },
        {
            text: 'RMSE',
            sort: 'rmse'
        },
        {
            text: 'Direction',
            sort: 'direction'
        },
        {
            text: 'Created',
            sort: 'created'
        }
    ]

    return (
        <div>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%">
                <CardSection withBorder p={10} mb={20}>
                    <Text size="lg" fw={500}>Saved Models</Text>
                </CardSection>
                <Table highlightOnHover>
                    <TableThead>
                        <TableTr>
                            <TableTh></TableTh>
                            <TableTh></TableTh>
                            {
                                columns.map((column) => (
                                    <TableTh ta="center" key={column.sort}>
                                        {column.text}
                                        <UnstyledButton onClick={() => handleSort(column.sort)}>
                                            <Text  size="xs">
                                                {sortColumn === column.sort && sortDirection === 'asc' ? '▲' : '▼'}
                                            </Text>
                                        </UnstyledButton>
                                    </TableTh>
                                ))
                            }
                            <TableTh></TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        {sortedModels.map((model: any) => (
                            <TableTr key={model._id} 
                            c={selectedModelId === model._id ? 'blue' : ''}
                            >
                                <TableTh>
                                    <Radio checked={selectedModelId === model._id} onChange={() => setSelectedModel(model._id)} />
                                </TableTh>
                                <TableTh>
                                    <Anchor href={`/model_info/${model._id}`}>
                                        <ActionIcon variant='transparent'>
                                            <IconEye />
                                        </ActionIcon>
                                    </Anchor>
                                </TableTh>
                                <TableTh ta="center" fw={300}>{model.model_name}</TableTh>
                                <TableTh ta="center" fw={300}>{model.symbol}</TableTh>
                                <TableTh ta="center" fw={300}>{model.features.length}</TableTh>
                                <TableTh ta="center" fw={300}>{model.model_type}</TableTh>
                                <TableTh ta="center" fw={300}>{model.epochs}</TableTh>
                                <TableTh ta="center" fw={300}>{model.window}</TableTh>
                                <TableTh ta="center" fw={300}>{Math.round(model.mape * 1000) / 1000}</TableTh>
                                <TableTh ta="center" fw={300}>{Math.round(model.rmse * 1000) / 1000}</TableTh>
                                <TableTh ta="center" fw={300}>{Math.round(model.direction * 100) / 100}</TableTh>
                                <TableTh ta="center" fw={300}>{formatDate(model.created)}</TableTh>
                                <TableTh>
                                    <ActionIcon disabled={model._id == initialSelected} variant='transparent' onClick={() => {
                                        setSelectedId(model._id)
                                        open()
                                    }}>
                                        <IconTrash color='red' />
                                    </ActionIcon>
                                </TableTh>
                            </TableTr>
                        ))}
                    </TableTbody>
                </Table>
            </Card>
            <Modal opened={opened} onClose={close} title="Are you sure you want to delete this model?" centered>
                <Group>
                    <Button onClick={close} variant='light'>Cancel</Button>
                    <Button onClick={() => {
                        handleDelete(selectedId)
                        close()
                        router.refresh()
                    }} color="red">Delete</Button>
                </Group>
            </Modal>
        </div>
    )
}

export default ModelTable