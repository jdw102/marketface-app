"use client"
import React, { useState, useEffect } from 'react'
import StockChart from './stockChart';
import { getSimulatedDate } from '@/lib/timeDifference';
import { Grid, GridCol, Card } from '@mantine/core';
import PriceSummary from './priceSummary';


export interface StockData {
    date: string;
    value: number;
    predicted?: number | null;
    interpolation?: number | null;
}



const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatDate(inputDate: string) {
    const parts = inputDate.split("-");
    const year = parseInt(parts[0]);
    const monthIndex = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);

    const monthName = months[monthIndex];
    const ending = day % 10 == 1 && day != 11 ? "st" : day % 10 == 2 && day != 12 ? "nd" : day % 10 == 3 && day != 13 ? "rd" : "th";
    return `${monthName} ${day}${ending}` + ", " + year.toString();
}


function formatPrediction(inputDate: string) {
    const date = new Date(inputDate);
    const extractedDate = date.toISOString().split('T')[0];
    return formatDate(extractedDate);
}


const ChartWrapper = ({ ticker }: { ticker: string }) => {
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [predictions, setPredictions] = useState([]);
    const [predicting, setPredicting] = useState<boolean>(false);
    const [timeframe, setTimeframe] = useState<string>('1W');
    const [modelStats, setModelStats] = useState<any>();
    const [mostRecent, setMostRecent] = useState<any>(null);

    useEffect(() => {
        const fetchStockData = async () => {
            const curr_date = getSimulatedDate(localStorage);
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:5000/stock_data?symbol=${ticker}&timeframe=${timeframe}&curr_date=${curr_date}`);
                const data = await response.json();
                setStockData(data.stock_data);
                setMostRecent({
                    date: formatDate(data.stock_data[data.stock_data.length - 1].date),
                    close: data.stock_data[data.stock_data.length - 1].close,
                    open: data.stock_data[data.stock_data.length - 1].open,
                    high: data.stock_data[data.stock_data.length - 1].high,
                    low: data.stock_data[data.stock_data.length - 1].low,
                    volume: data.stock_data[data.stock_data.length - 1].volume,
                    percentChange: (data.stock_data[data.stock_data.length - 1].close - data.stock_data[data.stock_data.length - 2].close) / data.stock_data[data.stock_data.length - 2].close,
                    priceChange: data.stock_data[data.stock_data.length - 1].close - data.stock_data[data.stock_data.length - 2].close
                })
                setPredictions(data.model_stats.predictions);
                setModelStats({
                    rmse: data.model_stats.rmse,
                    direction: data.model_stats.direction,
                    mape: data.model_stats.mape,
                    name: data.model_stats.name
                })
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchStockData();
    }, [ticker, timeframe]);



    const allData = {
        closingPrice: stockData.map((d: any) => ({ date: formatDate(d.date), value: d.close, predicted: null, interpolation: null })),
        openPrice: stockData.map((d: any) => ({ date: formatDate(d.date), value: d.open })),
        highPrice: stockData.map((d: any) => ({ date: formatDate(d.date), value: d.high })),
        volume: stockData.map((d: any) => ({ date: formatDate(d.date), value: d.volume }))
    }

    // if (predictions.length > 0){
    //     allData.closingPrice[allData.closingPrice.length - 1].interpolation = allData.closingPrice[allData.closingPrice.length - 1].value;
    // }
    predictions.slice(-allData.closingPrice.length).forEach((p: any) => {
        const date = formatPrediction(p.date);
        const index = allData.closingPrice.findIndex((d: any) => d.date == date);
        if (index != -1) {
            allData.closingPrice[index].predicted = p.close;
        }
        else {
            allData.closingPrice.push({
                date: date,
                value: null,
                predicted: p.close,
                interpolation: null
            })
        }
    })

    for (let i = allData.closingPrice.length - 1; i >= 0; i--) {
        if (allData.closingPrice[i].predicted) {
            modelStats.nextPrice = allData.closingPrice[i].predicted;
            modelStats.nextDate = allData.closingPrice[i].date;
            modelStats.predictedPriceChange = (allData.closingPrice[i].predicted - allData.closingPrice[i - 1].value);
            modelStats.predictedPercentChange = (allData.closingPrice[i].predicted - allData.closingPrice[i - 1].value) / allData.closingPrice[i - 1].value;
            break;
        }
    }


    for (let i = 0; i < allData.closingPrice.length; i++) {
        if (allData.closingPrice[i].predicted && i > 0 && !allData.closingPrice[i - 1].predicted) {
            allData.closingPrice[i - 1].interpolation = allData.closingPrice[i - 1].value;
            allData.closingPrice[i].interpolation = allData.closingPrice[i].predicted;
            break;
        }
    }


    const handleMakePrediction = async () => {
        const curr_date = getSimulatedDate(localStorage);
        setPredicting(true);
        try {
            const data = await fetch(`http://127.0.0.1:5000/predict?symbol=${ticker}&curr_date=${curr_date}`, {
                next: {
                    revalidate: 0
                }
            }).then((res) => res.json());
            setPredictions(data.predictions);
            setModelStats({
                rmse: data.rmse,
                direction: data.direction,
                mape: data.mape,
                name: data.name
            });
        } catch (error) {
            console.error('Error fetching predictions:', error);
        }
        setPredicting(false);
    }



    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" w="100%" >
            <Grid>
                <GridCol span={{sm: 12, md: 7, lg:8}}>
                    <StockChart
                        predicting={predicting}
                        loading={loading}
                        data={allData}
                        timeframe={timeframe}
                        setTimeframe={setTimeframe}
                        handleMakePrediction={handleMakePrediction}
                        modelStats={modelStats} />
                </GridCol>
                <GridCol span={{sm: 12, md: 5, lg:4}}>
                    <PriceSummary loading={loading || predicting} mostRecent={mostRecent} modelStats={modelStats} handleMakePrediction={handleMakePrediction}/>
                </GridCol>
            </Grid>
        </Card>
    )
}

export default ChartWrapper