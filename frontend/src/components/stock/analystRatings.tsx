"use client";
import { getSimulatedDate } from '@/lib/timeDifference';
import React, { useEffect, useState } from 'react'
import { Card, Progress, Group, Title, Text, Stack, RingProgress } from '@mantine/core';


function getColorValue(number: number) {
    if (number >= 75) {
        return "green";
    } else if (number >= 50) {
        return "yellow";
    } else if (number >= 25) {
        return "orange";
    } else {
        return "red";
    }
}


const AnalystRatings = ({ ticker, title }: { ticker: string, title: string }) => {
    const [analystStats, setAnalystStats] = useState({
        count: 0,
        buys: 0,
        neutral: 0,
        sell: 0
    })

    useEffect(() => {
        const currDate = getSimulatedDate(localStorage)
        const fetchAnalystStats = async () => {
            const res = await fetch(`http://127.0.0.1:5000/analyst_stats?symbol=${ticker}&curr_date=${currDate}`)
            const data = await res.json()
            setAnalystStats(data)
        }
        fetchAnalystStats()
    }, [])


    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" >
            <Group pb={10} justify="space-between">
                <Title order={4} ta="left" >{analystStats.count} {title}</Title>
            </Group>
            <Group justify='center'>
                <RingProgress
                    sections={
                        [
                            {
                                value: 100,
                                color: getColorValue(analystStats.buys / analystStats.count * 100)
                            }
                        ]
                    }
                    label={
                        <Text ta="center" fw={500}>
                            {analystStats.buys == 0 || analystStats.count == 0 ? 0 : Math.round((analystStats.buys / analystStats.count) * 100)}%
                        </Text>
                    }
                />
                <Stack w="70%">
                    <Group w="100%">
                        <Progress
                            w="80%"
                            value={analystStats.buys / analystStats.count * 100}
                            size="lg"
                            color='green'
                        />
                        <Text>
                            {analystStats.buys == 0 || analystStats.count == 0 ? 0 : Math.round((analystStats.buys / analystStats.count) * 100)}%
                            Buy
                        </Text>
                    </Group>
                    <Group w="100%">
                        <Progress
                            w="80%"
                            value={analystStats.neutral / analystStats.count * 100}
                            color="gray"
                            size="lg"
                        />
                        <Text>
                            {analystStats.neutral == 0 || analystStats.count == 0 ? 0 : Math.round((analystStats.neutral / analystStats.count) * 100)}%
                            Hold
                        </Text>
                    </Group>
                    <Group w="100%">
                        <Progress
                            w="80%"
                            value={analystStats.sell / analystStats.count * 100}
                            color="red"
                            size="lg"
                        />
                        <Text>
                            {analystStats.sell == 0 || analystStats.count == 0 ? 0 : Math.round((analystStats.sell / analystStats.count) * 100)}%
                            Sell
                        </Text>
                    </Group>
                </Stack>
            </Group>
        </Card>
    )
}

export default AnalystRatings