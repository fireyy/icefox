import type { NextPage } from 'next'
import Layout from 'components/layout'
import { useRouter } from 'next/router'

const Data: NextPage = () => {
  const router = useRouter()

  return (
    <Layout title="Data">
      Data: {router.asPath}
    </Layout>
  )
}

export default Data
