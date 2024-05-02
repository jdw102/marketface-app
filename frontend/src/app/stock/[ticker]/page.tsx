import { Grid, GridCol, Stack, Title } from "@mantine/core";
import TwitsFeed from "@/components/stock/twitsFeed";
import HeadlineFeed from "@/components/stock/headlinesFeed";
import ChartWrapper from "@/components/stock/chartWrapper";
import SentimentChart from "@/components/stock/sentimentChart";
import SentimentRing from "@/components/stock/sentimentRing";
import StockChart from "@/components/stock/stockChart";
import AnalystRatings from "@/components/stock/analystRatings";




export default async function Page({ params }: { params: { ticker: string } }) {


  // const stockTwits = await fetch(`${process.env.API_URL}/stocktwits?symbol=${params.ticker}`, { next: { revalidate: 0 } }).then((res) => res.json());
  // const headlines = await fetch(`${process.env.API_URL}/headlines?symbol=${params.ticker}`, { next: { revalidate: 0 } }).then((res) => res.json());
  return (
    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.25rem' }}>
      <Grid align="stretch">
        <GridCol span={12}>
          <Title order={3}>
            {params.ticker} Dashboard
          </Title>
        </GridCol>
        <GridCol span={12}>
          <ChartWrapper ticker={params.ticker} />
        </GridCol>
        <GridCol span={6}>
          <Stack justify="space-between" h="100%">
            <div >
              <SentimentRing title="Stocktwits Sentiment" ticker={params.ticker} api="stocktwits_sentiment_score"
                timeframeOptions={['30MIN', '1HR', '3HR', '12HR', '1D']}
              />
            </div>
            <div >
              <SentimentRing title="News Sentiment" ticker={params.ticker} api="headlines_sentiment_score"
                timeframeOptions={['1D', '1W', '1M', '1Y']}
              />
            </div>
          </Stack>
        </GridCol>
        <GridCol span={6}>
          <div style={{ height: "75vh" }}>
            <SentimentChart ticker={params.ticker} timeframeOptions={['1W', '1M', '3M', 'YTD', '1Y', 'All']} />
          </div>
        </GridCol>
        <GridCol span={6}>
          <div style={{ height: "75vh" }}>
            <TwitsFeed ticker={params.ticker} title="StockTwits Feed" />
          </div>
        </GridCol>
        <GridCol span={6} >
          <div style={{ height: "75vh" }}>
            <HeadlineFeed ticker={params.ticker} title="Headlines" />
          </div>
        </GridCol>
        <GridCol>
          <div>
            <AnalystRatings ticker={params.ticker} title="Analyst Ratings"/>
          </div>
        </GridCol>
      </Grid>
    </div>
  )
}