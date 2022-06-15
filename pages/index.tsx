import type { NextPage } from 'next'
import { Divider, Grid, Card, Text, useTheme } from '@geist-ui/core'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import Plus from '@geist-ui/icons/plus'
import Layout from 'components/layout'
import { DomainItems } from 'lib/interfaces'
import { timeAgo } from 'lib/utils'

type OverviewType = {
  user: number,
  key: number,
  domain: number,
  publish: number,
}

const Home: NextPage<unknown> = () => {
  const router = useRouter()
  const theme = useTheme()

  const { data = { user: 0, key: 0, domain: 0, publish: 0 } } = useSWR<OverviewType>('/api/overview')
  const { data: domains } = useSWR<DomainItems>(`/api/domains`)

  return (
      <>
      <Layout title="Dashboard">
        <Grid.Container gap={2}>
          {
            Object.keys(data).map((d, index) => (
              <Grid xs={24} sm={12} md={6} key={index}>
                <Card width="100%">
                  <Text h4 my={0} style={{ textTransform: 'uppercase' }}>{d}</Text>
                  <Text>{data?.[d as keyof OverviewType]}</Text>
                </Card>
              </Grid>
            ))
          }
        </Grid.Container>
        <Divider my={5} />
        <Grid.Container gap={2} marginTop={1} justify="flex-start" className="domain-overview">
          {
            domains && domains.map((domain) => {
              return (
                <Grid xs={24} sm={12} md={8} key={domain.domain}>
                  <Card width="100%" onClick={() => router.push(`/${domain.domain}/data`)} className="domain-card">
                    <Text h4 my={0}>{domain.domain}</Text>
                    <Text>Data: {`0`}</Text>
                    <Card.Footer>
                      <Text>{timeAgo(domain.createdAt)}</Text>
                    </Card.Footer>
                  </Card>
                </Grid>
              )
            })
          }
          <Grid xs={24} sm={12} md={8}>
            <Card width="100%" onClick={() => router.push(`/domains`)} className="domain-card domain-card-new">
              <Plus size={35} />
              <Text>New</Text>
            </Card>
          </Grid>
        </Grid.Container>
      </Layout>
      <style jsx global>{`
        .domain-overview .domain-card {
          cursor: pointer;
          position: relative;
        }
        .domain-overview .domain-card:hover {
          border-color: ${theme.palette.foreground};
        }
        .domain-card-new {
          display: flex;
        }
        .domain-card-new .content {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
      `}</style>
    </>
  )
}

export default Home
