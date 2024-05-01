"use client";
import React from 'react';
import { Text, Paper, Grid, GridCol, Card, Title } from '@mantine/core';
import { getSimulatedDate } from '@/lib/timeDifference';


interface Headline {
    _id: string,
    date: string,
    headline: string,
    stock: string
}

interface HeadlinesFeedProps {
    ticker: string,
    title: string
}

const HeadlineFeed: React.FC<HeadlinesFeedProps> = ({ ticker, title }) => {

    const [feed, setFeed] = React.useState<Headline[]>([]);
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        const fetchHeadlines = async () => {
            const curr_date = getSimulatedDate(localStorage);
            console.log(curr_date);
            setCurrentTime(curr_date);
            try {
                const response = await fetch(`http://127.0.0.1:5000/headlines?symbol=${ticker}&curr_date=${curr_date.toISOString()}`, { next: { revalidate: 0 } });
                const data = await response.json();
                setFeed(data);
            } catch (error) {
                console.error('Error fetching headlines:', error);
            }
        }
        fetchHeadlines();
    }
    , []);

    

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" >
            <Title order={4} ta="left"  pb={10}>{title}</Title>
            <div style={{ overflowY: 'scroll' }}>
                {feed && feed.map((text, key) => {
                    const date = new Date(text.date);
                    const month = date.toLocaleString('default', { month: 'long' });
                    const day = date.getDate();
                    const formattedDate = `${month} ${day}`;

                    return (
                        <Paper key={key} p="sm" shadow="xs" radius="md" style={{ marginBottom: '10px' }}>
                                <Text size="sm" fw={500}>{formattedDate}</Text>
                                <Text size="lg">{text.headline}</Text>
                                <Text size="sm" c="gray" mt="xs">Benzinga</Text>
                        </Paper>
                    );
                })}
            </div>
        </Card>
    );
};

export default HeadlineFeed;