import type { NextPage } from 'next'
import { Divider, Grid, Card, Text, useTheme } from '@geist-ui/core'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import Plus from '@geist-ui/icons/plus'
import Layout from 'components/layout'
import { DomainData } from 'lib/interfaces'
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
  const { data: domains } = useSWR<DomainData>(`/api/domains`)

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
          <Grid xs={24} sm={12} md={8}>
            <Card width="100%" onClick={() => router.push(`/domains`)} className="domain-card domain-card-new">
              <Plus size={35} />
              <Text>New</Text>
            </Card>
          </Grid>
          {
            domains && domains.domain && domains.domain.map((domain) => {
              return (
                <Grid xs={24} sm={12} md={8} key={domain.domain}>
                  <Card width="100%" onClick={() => router.push(`/${domain.domain}/data`)} className="domain-card">
                    <Text h4 my={0}>{domain.domain}</Text>
                    <Text>Data: {`0`}</Text>
                    <Text font={0.9} style={{ color: 'var(--body-color)' }}>{timeAgo(domain.createdAt)}</Text>
                  </Card>
                </Grid>
              )
            })
          }
        </Grid.Container>
      </Layout>
      <style jsx global>{`
        .domain-overview .domain-card {
          cursor: pointer;
          position: relative;
          border: none;
          box-shadow: 0px 2px 4px rgba(0,0,0,.1);
          transition: box-shadow .15s ease;
        }
        .domain-overview .domain-card:hover {
          box-shadow: 0px 4px 8px rgba(0,0,0,.12);
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
