import React from 'react'
import { MantineProvider } from '@mantine/core';
import { Shell } from './shell';
import { theme } from '../../../theme';

const Provider = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const tickers = await fetch(`${process.env.API_URL}/tickers`).then((res) => res.json());
    const originalDate = await fetch(`${process.env.API_URL}/get_date`, {next: {revalidate: 0}}).then((res) => res.json());
    const date = new Date(originalDate.date);
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 5);
    currentDate.setHours(currentDate.getHours() - 4)
    date.setSeconds(currentDate.getSeconds());
    return (
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <Shell originalDate={date} tickers={tickers}>
                {children}
            </Shell>
        </MantineProvider>
    )
}

export default Provider