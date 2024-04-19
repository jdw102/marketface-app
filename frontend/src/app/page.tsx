import { Title, Card, Grid, GridCol, CardSection, Image, Badge, Group, Text, Anchor, Button, Stack } from "@mantine/core";


export default async function Home() {
  const tickers = await fetch(`${process.env.API_URL}/tickers`).then((res) => res.json());
  return (
    <main>
      <Stack mt="15vh">
        <Title order={1} ta="center">Welcome</Title>
        <Title order={4} ta="center">
          Navigate to a stock using the navbar on the left to get started
        </Title>
        <Group justify="center" align="center" mt="5vh">
          {tickers.map((ticker: {
            name: string,
            symbol: string,
            image: string
          }, key: number) => (
            <Anchor key={key} href={`/stock/${ticker.symbol}`}>
              <Card padding="lg" radius="md" className="card">
                <CardSection >
                  <Image p={30} src={ticker.image} alt={ticker.name} height={130} fit="contain" />
                </CardSection>
              </Card>
            </Anchor>
          ))}
        </Group>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5vh' }}>
          <Button>
            About This Project
          </Button>
        </div>
        
      </Stack>
    </main>
  );
}
