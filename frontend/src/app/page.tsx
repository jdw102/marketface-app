
import { Title, Text, Button, Container, Group, Stack, Center, Badge, Anchor, Card, CardSection, Image, SimpleGrid, Divider } from "@mantine/core";
import { IconAffiliate, IconMoodSmile, IconGauge } from "@tabler/icons-react";


export default async function HeroText() {
  const tickers = await fetch(`${process.env.API_URL}/tickers`).then((res) => res.json());

  const mockdata = [

    {
      title: "Sentiment Sources",
      description:
        "Stocktwits is a social media platform designed for sharing ideas between investors, traders, and entrepreneurs. Benzinga is a financial news and analysis service providing stock market insights, news, and analysis.",
      icon: IconMoodSmile
    },
    {
      title: "Model Architectures",
      description:
        "LSTM (Long Short-Term Memory), Bi-Directional LSTM, and CNN (Convolutional Neural Network) are some of the types of network architectures available.",
      icon: IconAffiliate
    },
    {
      title: "Performance Metrics",
      icon: IconGauge
    }
  ];

  return (
    <div>
      <Center h="80vh">
        <Container size={1400} >
          <Stack gap="xl" justify="center">
            <Group justify="center">
              <Title w="80%" ta="center">
                Market sentimen and predictions for{" "}
                <Text component="span" inherit c="indigo">
                  anyone
                </Text>
              </Title>
            </Group>
            <Container p={0} size={600}>
              <Text size="lg" color="dimmed" >
                Marketface provides insights into the stock market by utilizing machine learning for sentiment analysis and price predictions.
              </Text>
            </Container>

            <Group justify='center'>
              <Button

                size="lg"
                variant="default"
                color="gray"
              >
                View Models
              </Button>
              <Button size="lg">
                About This Project
              </Button>
            </Group>
          </Stack>
        </Container>
      </Center>
      <Container size={1400} mt={60}>
        <Title order={2} ta="center">
          Things to know
        </Title>
        <Text
          color="dimmed"
          ta="center"
          mt="md"
        >Each stock has a dashboard with historical prices, sentiment, and prediction capabilities.
          Try creating a custom model with different features and hyperparameters. You can analyze the accuracy of the model on test dates and compare their performances.
        </Text>
        <Group justify="center" mt={30}>
          <Divider c="indigo" w={100} color="indigo" />
        </Group>
        <SimpleGrid
          mt={50}
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 10, sm: 'xl' }}
        >
          {
            mockdata.map((feature) => (
              <Card
                key={feature.title}
                shadow="md"
                radius="md"
                p="xl"
              >
                <feature.icon size={50} stroke={2} />
                <Text size="xl" fw={700} mt="md">
                  {feature.title}
                </Text>
                {
                  feature.title == "Performance Metrics" ?
                    <Text size="sm" color="dimmed" mt="sm">
                      <Text component="span" fw={500}>Root Mean Squared Error (RMSE):</Text> RMSE measures the average magnitude of the errors in predictions. <br />
                      <Text component="span" fw={500}>Mean Absolute Percentage Error (MAPE):</Text> MAPE measures the average absolute percentage difference between actual and predicted values. <br />
                      <Text component="span" fw={500}>Direction Accuracy:</Text> Measures how often the model correctly predicts whether the price will go up or down
                    </Text>
                    : <Text size="sm" color="dimmed" mt="sm">
                      {feature.description}
                    </Text>
                }

              </Card>
            ))
          }
        </SimpleGrid>
      </Container>
      <Container size={1400} mt={100}>
        <Stack>
          <Group justify="center">
            <Badge color="pink" size="xl" variant="filled">
              Stocks we currently support
            </Badge>
          </Group>
        </Stack>
        <Group justify="space-between" align="center" mt="5vh">
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
      </Container>
    </div>
  );
}

