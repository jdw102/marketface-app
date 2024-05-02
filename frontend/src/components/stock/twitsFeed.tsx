"use client";
import React, { use, useEffect, useState } from 'react';
import { Text, Paper, Avatar, Badge, Card, Title, Group, ActionIcon, Tooltip, LoadingOverlay } from '@mantine/core';
import { getSimulatedDate } from '@/lib/timeDifference';
import { IconRefresh } from '@tabler/icons-react';


interface Text {
    _id: string,
    avatar_url: string,
    body: string,
    created_at: string,
    likes: number,
    sentiment: string,
    stock: string,
    username: string
}

interface TextFeedProps {
    title: string,
    ticker: string
}


const TwitsFeed: React.FC<TextFeedProps> = ({ title, ticker }) => {
    const [feed, setFeed] = useState<Text[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchStockTwits = async () => {
            const curr_date = getSimulatedDate(localStorage);
            setCurrentTime(curr_date);
            try {
                const response = await fetch(`http://127.0.0.1:5000/stocktwits?symbol=${ticker}&curr_date=${curr_date.toISOString()}&num=${10}`, { next: { revalidate: 0 } });
                const data = await response.json();
                setFeed(data.twits);
            } catch (error) {
                console.error('Error fetching stocktwits:', error);
            }
        }
        fetchStockTwits();
    }, []);

    const fetchStockTwits = async () => {
        const curr_date = getSimulatedDate(localStorage);
        setCurrentTime(curr_date);
        try {
            const response = await fetch(`http://127.0.0.1:5000/stocktwits?symbol=${ticker}&curr_date=${curr_date.toISOString()}&num=${10}`, { next: { revalidate: 0 } });
            const data = await response.json();
            setFeed(data.twits);
        } catch (error) {
            console.error('Error fetching stocktwits:', error);
        }
    }


    const handleClick = async () => {
        setLoading(true);
        fetchStockTwits();
        setLoading(false);
    }


    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" >
            <Group pb={10} justify="space-between">
                <Title order={4} ta="left" >{title}</Title>
                <Tooltip label="Refresh" position="top" withArrow>
                    <ActionIcon variant="transparent" size='lg' style={{ marginLeft: '10px' }} onClick={() => handleClick()}>
                        <IconRefresh />
                    </ActionIcon>
                </Tooltip>
            </Group>
            <div style={{ overflowY: 'scroll' }}>
                {feed.map((text) => {
                    const calculateTimeSincePosted = (createdAt: string): { hours: string, minutes: string } => {
                        const postedTime = new Date(createdAt)
                        postedTime.setHours(postedTime.getHours() - 1);
                        const timeDifference = Math.abs(currentTime.getTime() - postedTime.getTime());
                        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);

                        return { hours: hours.toString(), minutes: minutes.toString() };
                    };

                    const timeSincePosted = calculateTimeSincePosted(text.created_at);
                    let timeString = '';
                    if (timeSincePosted.hours === '0') {
                        timeString = `${timeSincePosted.minutes} minutes ago`;
                    }
                    else {
                        timeString = `${timeSincePosted.hours} hours ${timeSincePosted.minutes} minutes ago`;
                    }
                    return (
                        <Paper key={text._id} shadow="xs" p="md" style={{ marginBottom: '16px' }}>
                            <Group justify='space-between' w='100%'>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <Avatar size="md" radius="xl" src={text.avatar_url} />
                                    <Text fw={500} style={{ marginLeft: '8px' }}>
                                        {text.username}
                                    </Text>
                                </div>
                                <Text size="xs" c="gray" style={{ marginLeft: 'auto' }}>
                                    {timeString}
                                </Text>
                            </Group>
                            <Text style={{ overflowWrap: 'anywhere' }}>{text.body}</Text>
                            <Group justify="space-between" w="100%">
                                <Badge color="blue" variant="light" style={{ marginTop: '8px' }}>
                                    {text.likes} Likes
                                </Badge>
                                {
                                    text.sentiment &&
                                    <Badge color={text.sentiment === 'Bullish' ? 'green' : 'red'} variant="light" style={{ marginTop: '8px' }}>
                                        {text.sentiment}
                                    </Badge>
                                }
                            </Group>
                        </Paper>
                    )
                }
                )}
                <LoadingOverlay
                    visible={loading}
                    zIndex={1000}
                    overlayProps={{ radius: 'sm', blur: 2 }}
                    loaderProps={{ color: 'pink', type: 'bars' }}
                />
            </div>
        </Card>
    );
};

export default TwitsFeed;