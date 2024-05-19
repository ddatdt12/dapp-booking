import { Category, Collection } from '@/components'
import { getApartments } from '@/services/blockchain'
import Head from 'next/head'
import { use, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

// const getApartmentTest = cache(async () => {
//   const data = await getApartments()
//   return data
// })

export default function Home() {
  const [apartments, setApartments] = useState([])

  useEffect(() => {
    getApartments().then((data) => {
      setApartments(data)
    })
  }, [])

  return (
    <div>
      <Head>
        <title>Home Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Category />
      <Collection appartments={apartments} />
    </div>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
