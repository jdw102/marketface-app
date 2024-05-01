import React from 'react'
import { Grid, GridCol, Text } from '@mantine/core'
import DateTimeWrapper from '@/components/dateTimeWrapper'


const Page = async () => {

    const tickerDate = await fetch(`http://127.0.0.1:5000/get_time_ranges`, {next: {revalidate: 0}}).then((res) => res.json());

    return (
        <div>                
            <DateTimeWrapper min_date={new Date(tickerDate.min_date)} max_date={new Date(tickerDate.max_date)}/>
        </div>
    )
}

export default Page