"use client"
import React, { useState, useEffect } from 'react'
import StockChart from './stockChart';

export interface StockData {
    date: string;
    value: number;
}

const ChartWrapper = ({ ticker }: { ticker: string }) => {
    const [stockData, setStockData] = useState({
        Close: [],
        Open: [],
        High: [],
        Volume: []
    });

    const [timeframe, setTimeframe] = useState<string>('1W');

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/stock_data?symbol=${ticker}&timeframe=${timeframe}`);
                const data = await response.json();
                setStockData(data);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchStockData();
        console.log("TEST")
    }, [ticker, timeframe]);

    const closingPrice: StockData[] = Object.entries(stockData.Close).map(([date, price]) => ({
        date,
        value: price as number
    }));
    const openPrice: StockData[] = Object.entries(stockData.Open).map(([date, price]) => ({
        date,
        value: price as number
    }));
    const highPrice: StockData[] = Object.entries(stockData.High).map(([date, price]) => ({
        date,
        value: price as number
    }));
    const volume: StockData[] = Object.entries(stockData.Volume).map(([date, vol]) => ({
        date,
        value: vol as number
    }));
    const allData = {
        closingPrice,
        openPrice,
        highPrice,
        volume
    }

    return (
        <div>            
            <StockChart data={allData} timeframe={timeframe} setTimeframe={setTimeframe}/>
        </div>
    )
}

export default ChartWrapper