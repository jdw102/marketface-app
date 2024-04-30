"use client"
import React from 'react'
import { useDisclosure } from '@mantine/hooks';
import { Table, TableTr, TableTh, TableThead, TableTbody, Title, Button, Anchor, ActionIcon, Modal, Group } from '@mantine/core';
import { IconEye, IconTrash } from '@tabler/icons-react';
import { handleWebpackExternalForEdgeRuntime } from 'next/dist/build/webpack/plugins/middleware-plugin';

interface ModelTableProps {
    models: any
}


const ModelTable = ({ models }: ModelTableProps) => {

    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const handleDelete = (id: string | null) => {
        fetch(`http://127.0.0.1:5000/delete_model?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => setSelectedId(null))
    }
    const [opened, { open, close }] = useDisclosure(false);


    return (
        <div>
            <Table highlightOnHover>
                <TableThead>
                    <TableTr>
                        <TableTh></TableTh>
                        <TableTh>Model Name</TableTh>
                        <TableTh>Stock</TableTh>
                        <TableTh>Features</TableTh>
                        <TableTh>Model Type</TableTh>
                        <TableTh>Epochs</TableTh>
                        <TableTh>Window Size</TableTh>
                        <TableTh>MAPE</TableTh>
                        <TableTh>RMSE</TableTh>
                        <TableTh>Direction Accuracy</TableTh>
                        <TableTh>Created</TableTh>
                        <TableTh></TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {models.map((model: any) => (
                        <TableTr key={model._id}>
                            <TableTh>
                                <Anchor href={`/model_info/${model.id}`}>
                                    <ActionIcon variant='transparent'>
                                        <IconEye />
                                    </ActionIcon>
                                </Anchor>
                            </TableTh>
                            <TableTh fw={300}>{model.model_name}</TableTh>
                            <TableTh fw={300}>{model.symbol}</TableTh>
                            <TableTh fw={300}>{model.features.length}</TableTh>
                            <TableTh fw={300}>{model.model_type}</TableTh>
                            <TableTh fw={300}>{model.epochs}</TableTh>
                            <TableTh fw={300}>{model.window}</TableTh>
                            <TableTh fw={300}>{Math.round(model.mape * 1000) / 1000}</TableTh>
                            <TableTh fw={300}>{Math.round(model.rmse * 1000) / 1000}</TableTh>
                            <TableTh fw={300}>{Math.round(model.direction * 100) / 100}</TableTh>
                            <TableTh fw={300}>{model.created}</TableTh>
                            <TableTh>
                                <ActionIcon variant='transparent' onClick={() => {
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
            <Group justify='center' mt={20}>
                <Anchor href='/create_model'>
                    <Button>
                        Create New Model
                    </Button>
                </Anchor>
            </Group>
            <Modal opened={opened} onClose={close} title="Are you sure you want to delete this model?" centered>
                <Group>
                    <Button onClick={close} variant='light'>Cancel</Button>
                    <Button onClick={() => {
                        handleDelete(selectedId)
                        close()
                    }} color="red">Delete</Button>
                </Group>
            </Modal>
        </div>
    )
}

export default ModelTable