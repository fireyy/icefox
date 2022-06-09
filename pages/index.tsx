import type { NextPage } from 'next'
import Layout from 'components/layout'
import useTranslation from 'next-translate/useTranslation'

const Home: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <Layout title={t('Dashboard')}>
      {t('Dashboard')}
    </Layout>
  )
}

export default Home
