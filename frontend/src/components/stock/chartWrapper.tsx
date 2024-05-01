"use client"
import React, { useState, useEffect } from 'react'
import StockChart from './stockChart';
import { getSimulatedDate } from '@/lib/timeDifference';

export interface StockData {
    date: string;
    value: number;
}

const ChartWrapper = ({ ticker }: { ticker: string }) => {
    const [stockData, setStockData] = useState([]);

     const [predictions, setPredictions] = useState([]);

    const [timeframe, setTimeframe] = useState<string>('1W');

    useEffect(() => {
        const fetchStockData = async () => {
            const curr_date = getSimulatedDate(localStorage);
            console.log(curr_date);
            try {  
                // const predictions = await fetch(`http://127.0.0.1:5000/predict?symbol=${ticker}&window=10`, { next: { revalidate: 0 } }).then((res) => res.json());
                const response = await fetch(`http://127.0.0.1:5000/stock_data?symbol=${ticker}&timeframe=${timeframe}&curr_date=${curr_date}`);
                const data = await response.json();
                // setPredictions(predictions);
                setStockData(data);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchStockData();
    }, [ticker, timeframe]);

    const allData = {
        closingPrice: stockData.map((d: any) => ({ date: d.date, value: d.close })),
        openPrice: stockData.map((d: any) => ({ date: d.date, value: d.open })),
        highPrice: stockData.map((d: any) => ({ date: d.date, value: d.high })),
        volume: stockData.map((d: any) => ({ date: d.date, value: d.volume }))
    }

    const allPredictions = {
        closingPrice: predictions.map((p: any) => ({ date: p.date, value: p.close })),
        openPrice: predictions.map((p: any) => ({ date: p.date, value: p.open })),
        highPrice: predictions.map((p: any) => ({ date: p.date, value: p.high })),
        volume: predictions.map((p: any) => ({ date: p.date, value: p.volume }))
    }

    return (
        <div>            
            <StockChart data={allData} timeframe={timeframe} prediction={allPredictions} setTimeframe={setTimeframe}/>
        </div>
    )
}

export default ChartWrapper