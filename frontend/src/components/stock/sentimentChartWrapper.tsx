"use client"
import React, { useState, useEffect } from 'react'
import StockChart from './stockChart';
import SentimentChart from './sentimentChart';

export interface SentimentData {
    date: string;
    value: number;
}

const SentimentChartWrapper = ({ ticker }: { ticker: string }) => {
    const [sentimentData, setSentimentData] = useState({
        stocktwits: [],
    });

    const [timeframe, setTimeframe] = useState<string>('1W');

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/stocktwits_sentiment?symbol=${ticker}&timeframe=${timeframe}`);
                const data = await response.json();
                setSentimentData(data);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchStockData();
    }, [ticker, timeframe]);

    const stocktwits: SentimentData[] = Object.entries(sentimentData).map(([key, {date, score}]) => ({
        date : date as string,
        value: score as unknown as number,
    }));
    const allData = {
        stocktwits
    }

    return (
        <div style={{ height: "75vh" }}>            
            <SentimentChart data={allData} timeframe={timeframe} setTimeframe={setTimeframe}/>
        </div>
    )
}

export default SentimentChartWrapper