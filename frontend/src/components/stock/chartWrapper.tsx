"use client"
import React, { useState, useEffect } from 'react'
import StockChart from './stockChart';
import { getSimulatedDate } from '@/lib/timeDifference';


export interface StockData {
    date: string;
    value: number;
    predicted?: number | null;
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
    return `${monthName} ${day}${ending}`;
}


const ChartWrapper = ({ ticker }: { ticker: string }) => {
    const [stockData, setStockData] = useState([]);

    const [predictions, setPredictions] = useState([]);

    const [timeframe, setTimeframe] = useState<string>('1W');

    useEffect(() => {
        const fetchStockData = async () => {
            const curr_date = getSimulatedDate(localStorage);
            try {
                const response = await fetch(`http://127.0.0.1:5000/stock_data?symbol=${ticker}&timeframe=${timeframe}&curr_date=${curr_date}`);
                const data = await response.json();
                console.log(data)
                setStockData(data.stock_data);
                setPredictions(data.predictions);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchStockData();
    }, [ticker, timeframe]);


    // useEffect(() => {
    //     const curr_date = getSimulatedDate(localStorage);
    //     const fetchPredictions = async () => {
    //         try {
    //             const predictions = await fetch(`http://127.0.0.1:5000/predict?symbol=${ticker}&curr_date=${curr_date.toISOString()}`,
    //             {
    //                 next: {
    //                     revalidate: 0
    //                 }
    //             }
    //         ).then((res) => res.json());
    //             setPredictions(predictions);
    //             console.log(predictions)
    //         } catch (error) {
    //             console.error('Error fetching predictions:', error);
    //         }
    //     }
    //     fetchPredictions();
    // }, []);



    const allData = {
        closingPrice: stockData.map((d: any) => ({ date: formatDate(d.date), value: d.close, predicted: null })),
        openPrice: stockData.map((d: any) => ({ date: formatDate(d.date), value: d.open })),
        highPrice: stockData.map((d: any) => ({ date: formatDate(d.date), value: d.high })),
        volume: stockData.map((d: any) => ({ date: formatDate(d.date), value: d.volume }))
    }

    if (predictions.length > 0){
        allData.closingPrice[allData.closingPrice.length - 1].predicted = allData.closingPrice[allData.closingPrice.length - 1].value;
    }

    predictions.forEach((p: any) => {
        const date = formatDate(p.date);
        const index = allData.closingPrice.findIndex((d: any) => d.date == date);
        if (index != -1) {
            allData.closingPrice[index].predicted = p.close;
        }
        else{
            allData.closingPrice.push({
                date: date,
                value: null,
                predicted: p.close
            })
        }
    })
    

    console.log(allData)

    const handleMakePrediction = async () => {
        const curr_date = getSimulatedDate(localStorage);
        try {
            const predictions = await fetch(`http://127.0.0.1:5000/predict?symbol=${ticker}&curr_date=${curr_date}`, {
                next: {
                    revalidate: 0
                }
            }).then((res) => res.json());
            setPredictions(predictions);
            console.log(predictions)
        } catch (error) {
            console.error('Error fetching predictions:', error);
        }
    }


    return (
        <div>
            <StockChart
                data={allData}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                handleMakePrediction={handleMakePrediction}/>
        </div>
    )
}

export default ChartWrapper