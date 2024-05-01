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
    return (
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <Shell tickers={tickers}>
                {children}
            </Shell>
        </MantineProvider>
    )
}

export default Provider