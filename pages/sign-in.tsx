import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import { getServerSession } from 'next-auth/next'
import { getProviders, signIn } from 'next-auth/react'
import { Button, Image, Card, Divider } from '@geist-ui/core'
import { authOptions } from 'lib/auth'
import Layout from 'components/layout'

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const handleClick = (username: string) => {
    signIn("credentials", { username })
  }

  return (
    <>
      <Layout title='Sign In'>
        <div className="sign-in">
          <Image src="/icefox.svg" width="142px" height="140px" mb={0.5} alt="" />
          <Card>
            {Object.values(providers!).map((provider) => (
              <div key={provider.name}>
                {
                  provider.name !== 'devAuth' && <Button
                    className="!h-12 !px-5 !text-lg"
                    onClick={() => signIn(provider.id)}
                  >
                    Sign in with {provider.name}
                  </Button>
                }
                {
                  process.env.NODE_ENV === 'development' && provider.name === 'devAuth' && (
                    <>
                      <Divider>OR</Divider>
                      <Button
                        className="!h-12 !px-5 !text-lg"
                        onClick={() => handleClick('admin')}
                      >
                        Sign in with Admin
                      </Button>
                      <Button
                        className="!h-12 !px-5 !text-lg"
                        onClick={() => handleClick('user')}
                      >
                        Sign in with User
                      </Button>
                    </>
                  )
                }
              </div>
            ))}
          </Card>
        </div>
      </Layout>
      <style jsx>{`
        .sign-in {
          display: flex;
          height: 100vh;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context, authOptions)
  const providers = await getProviders()

  if (session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: { providers },
    }
  }

  return {
    props: { providers },
  }
}

export default SignIn
