"use client"
import { AppShell, Anchor, Burger, Group, Skeleton, Text, UnstyledButton, Divider, Button, ActionIcon, Image, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function Shell({ children, tickers }: {
  children: React.ReactNode, tickers: any
}) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 75 }}
      navbar={{
        width: 300, breakpoint: 'sm', collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <a href="/" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Image src="/logo.png" alt="Marketface" height={40} />
              <Title order={3} fw={700} ml="sm" mt={17} c="indigo">Marketface</Title>
            </a>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="none">
        {tickers ? (
          tickers.map((ticker: {
            name: string,
            symbol: string,
            image: string
          }, key: number) => (
            <a key={key} href={`/stock/${ticker.symbol}`} >
              <Button w="100%" variant='subtle' color="dark" radius="xs" size="xl" display='flex' styles={{inner: {
                width: '100%'
              },
              label: {
                width: '100%'
              }
              }} >
                <Group justify='space-between' w="100%">
                  <Text>{ticker.name}</Text>
                  <Text fw={700} ta="right">{ticker.symbol}</Text>
                </Group>
              </Button>
              <Divider />
            </a>
          ))
        ) : (
          <Skeleton height={40} radius="xl" />
        )

        }
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}