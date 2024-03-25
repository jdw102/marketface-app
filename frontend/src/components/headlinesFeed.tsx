import React from 'react';
import { Text, Paper, Grid, GridCol, Card, Title } from '@mantine/core';


interface Headline {
    _id: string,
    date: string,
    headline: string,
    stock: string
}

interface HeadlinesFeedProps {
    feed: Headline[],
    title: string
}

const HeadlineFeed: React.FC<HeadlinesFeedProps> = ({ feed, title }) => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" >
            <Title order={4} ta="left"  pb={10}>{title}</Title>
            <Grid >
                {feed.map((text) => {
                    const date = new Date(text.date);
                    const month = date.toLocaleString('default', { month: 'long' });
                    const day = date.getDate();
                    const formattedDate = `${month} ${day}`;

                    return (
                        <GridCol key={text._id} span={{base: 12, md: 6}}>
                            <Paper w="100%"  p="sm" shadow="xs" radius="md" style={{ marginBottom: '10px' }}>
                                    <Text size="sm" fw={500}>{formattedDate}</Text>
                                    <Text size="lg">{text.headline}</Text>
                                    <Text size="sm" c="gray" mt="xs">Benzinga</Text>
                            </Paper>
                        </GridCol>
                    );
                })}
            </Grid>
        </Card>
    );
};

export default HeadlineFeed;