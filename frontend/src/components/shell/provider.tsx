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
    const tickerDate = await fetch(`http://127.0.0.1:5000/get_time_ranges`, {next: {revalidate: 0}}).then((res) => res.json());

    return (
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <Shell tickers={tickers} minDate={new Date(tickerDate.min_date)} maxDate={new Date(tickerDate.max_date)}>
                {children}
            </Shell>
        </MantineProvider>
    )
}

export default Provider