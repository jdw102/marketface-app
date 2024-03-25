import { Grid, GridCol, Title } from "@mantine/core";
import TwitsFeed from "@/components/twitsFeed";
import HeadlineFeed from "@/components/headlinesFeed";
import ChartWrapper from "@/components/chartWrapper";
import SentimentChartWrapper from "@/components/sentimentChartWrapper";




export default async function Page({ params }: { params: { ticker: string } }) {

  
  const stockTwits = await fetch(`${process.env.API_URL}/stocktwits?symbol=${params.ticker}`, { next: { revalidate: 0 } }).then((res) => res.json());
  const headlines = await fetch(`${process.env.API_URL}/headlines?symbol=${params.ticker}`, { next: { revalidate: 0 } }).then((res) => res.json());
  return (
    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Grid>
        <GridCol span={12}>
          <Title order={3}>
            {params.ticker} Dashboard
          </Title>
        </GridCol>
        <GridCol span={12}>
          <ChartWrapper ticker={params.ticker} />
        </GridCol>
        <GridCol span={6}>
          <SentimentChartWrapper ticker={params.ticker} />
        </GridCol>
        <GridCol span={6}>
          <div style={{ height: "75vh" }}>
            <TwitsFeed feed={stockTwits} title="StockTwits Feed" />
          </div>
        </GridCol>
        <GridCol span={12}>
          <div >
            <HeadlineFeed feed={headlines} title="Headlines" />
          </div>
        </GridCol>
      </Grid>
    </div>
  )
}