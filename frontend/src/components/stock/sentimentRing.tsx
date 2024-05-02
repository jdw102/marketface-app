"use client";
import React, { useEffect, useState } from 'react';
import { Button, Card, Title, Group, RingProgress, Text, Center, Loader, ActionIcon, Tooltip } from '@mantine/core';
import { getSimulatedDate } from '@/lib/timeDifference';
import { IconRefresh } from '@tabler/icons-react';
import { DonutChart } from '@mantine/charts';


interface SentimentRingProps {
    title: string,
    ticker: string,
    api: string,
    timeframeOptions: string[]
}

interface SentimentData {
    num_pos: number,
    num_neg: number
    num_neu: number,
    score: number
}



const SentimentRing: React.FC<SentimentRingProps> = ({ title, ticker, api, timeframeOptions }) => {
    const [sentimentData, setSentimentData] = useState<SentimentData>({ num_pos: 0, num_neg: 0, num_neu: 0, score: 0 });
    const [timeframe, setTimeframe] = useState<string>(timeframeOptions[0]);
    const [loading, setLoading] = useState<boolean>(false);




    const fetchScore = async (tf: string) => {
        try {
            const curr_date = getSimulatedDate(localStorage);
            const response = await fetch(`http://127.0.0.1:5000/${api}?symbol=${ticker}&curr_date=${curr_date.toISOString()}&timeframe=${tf}`, { next: { revalidate: 0 } });
            const data = await response.json();
            setSentimentData(data);
        } catch (error) {
            console.error('Error fetching stocktwits:', error);
        }
    }

    useEffect(() => {
        const initialFetch = async () => {
            setLoading(true);
            const curr_date = getSimulatedDate(localStorage);
            try {
                const response = await fetch(`http://127.0.0.1:5000/${api}?symbol=${ticker}&curr_date=${curr_date.toISOString()}&timeframe=${timeframe}`, { next: { revalidate: 0 } });
                const data = await response.json();
                setSentimentData(data);
            } catch (error) {
                console.error('Error fetching stocktwits:', error);
            }
            setLoading(false);
        }
        initialFetch();

    }, []);

    const handleClick = async (tf: string) => {
        setLoading(true);
        setTimeframe(tf)
        await fetchScore(tf);
        setLoading(false);
    }
    let chartData = []
    if (sentimentData.num_neg + sentimentData.num_neu + sentimentData.num_pos == 0) {
        chartData = [
            { name: 'Neutral', value: 1, color: 'gray' },
        ]
    }
    else{
        chartData = [
            { name: 'Positive', value: sentimentData.num_pos, color: 'green' },
            { name: 'Neutral', value: sentimentData.num_neu, color: 'gray' },
            { name: 'Negative', value: sentimentData.num_neg, color: 'red' },
        ]
    }

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" >
            <Group align="center" pb={10} justify="space-between">
                <Title order={4} ta="left" >{title}</Title>
                <Tooltip label="Refresh" position="top" withArrow>
                    <ActionIcon variant="transparent" size='lg' style={{ marginLeft: '10px' }} onClick={() => handleClick(timeframe)}>
                        <IconRefresh />
                    </ActionIcon>
                </Tooltip>
            </Group>
            <Center mb={20}>
                {
                    loading || !sentimentData ?
                        <Loader size={135}
                        /> :
                        <DonutChart
                            data={chartData}
                            size={135}
                            paddingAngle={5}
                            withTooltip={sentimentData.num_neg + sentimentData.num_neu + sentimentData.num_pos > 0}
                            thickness={18}
                            styles={{
                                label: {
                                    fontSize: "1.5rem",
                                    fontWeight: 500
                                }
                            }}
                            chartLabel={sentimentData.score.toFixed(4).toString()}
                        />
                }
            </Center>
            <Group justify='center' mt={10}>
                {
                    timeframeOptions.map((option) => {
                        return <Button disabled={loading} variant={timeframe == option ? "filled" : "light"} size='sm' key={option} onClick={() => handleClick(option)}>{option}</Button>
                    }
                    )
                }
            </Group>
        </Card>
    );
};

export default SentimentRing;