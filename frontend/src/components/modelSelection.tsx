"use client"
import React, { useState } from 'react'
import ModelTable from './modelTable'
import { Group, Select, Button, Anchor, Stack, Modal } from '@mantine/core'
import ModelComparisonCharts from './modelComparisonCharts'
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation'

interface ModelTableProps {
    models: any,
    saved_models: any
}

const ModelSelection = ({ models, saved_models }: ModelTableProps) => {
    const initialModel = saved_models["NVDA"]
    const [selectedStock, setSelectedStock] = useState<string | null>("NVDA")
    const [selectedModel, setSelectedModel] = useState<string | null>(initialModel)
    models = models.filter((model: any) => model.symbol === selectedStock)
    const [opened, { open, close }] = useDisclosure(false);
    const router = useRouter();

    const handleSave = (id: string | null) => {
        fetch(`http://127.0.0.1:5000/save_model?model_id=${id}&symbol=${selectedStock}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then()
    }

    return (
        <div>
            <Group mb={20}>
                <Select
                    value={selectedStock}
                    onChange={(value) => {
                        setSelectedStock(value)
                        setSelectedModel(value? saved_models[value]: initialModel)
                    }}
                    data={Object.keys(saved_models)}
                    placeholder="Select a stock"
                />
                <Anchor href={`/create_model/${selectedStock}`}>
                    <Button>
                        Create New Model
                    </Button>
                </Anchor>
            </Group>
            <div style={{marginBottom: 20}}>
                <ModelTable models={models} setSelectedModel={setSelectedModel} selectedModelId={selectedModel} initialSelected={initialModel}/>
                <Group mt={10}>
                    <Button variant="light" onClick={() => setSelectedModel(initialModel)}>Reset</Button>
                    <Button  onClick={open}>Save</Button>
                </Group>
            </div>
            <div>
                <ModelComparisonCharts models={models} selectedModelId={selectedModel} />
            </div>
            <Modal opened={opened} onClose={close} title="Are you sure you want to change your model? All past predicted prices will be cleared." centered>
                <Group>
                    <Button onClick={close} variant='light'>Cancel</Button>
                    <Button onClick={() => {
                        handleSave(selectedModel)
                        close()
                        router.refresh()
                    }} >Save</Button>
                </Group>
            </Modal>
        </div >
    )
}

export default ModelSelection