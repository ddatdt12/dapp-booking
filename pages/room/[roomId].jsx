import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { globalActions } from '@/store/globalSlices'
import { useDispatch, useSelector } from 'react-redux'
import { Title, ImageGrid, Description, Calendar, Actions, Review, AddReview } from '@/components'
import {
  getReviews,
  getApartment,
  getBookedDates,
  getSecurityFee,
  getQualifiedReviewers,
} from '@/services/blockchain'
import { useAccount } from 'wagmi'

export default function Room({}) {
  const router = useRouter()
  const { roomId } = router.query
  const dispatch = useDispatch()
  const { address } = useAccount()

  const { setApartment, setTimestamps, setReviewModal, setReviews, setSecurityFee } = globalActions
  const { apartment, timestamps, reviews } = useSelector((states) => states.globalStates)
  const [qualifiedReviewers, setQualifiedReviewers] = useState([])

  console.log('roomId', roomId);
  useEffect(() => {
    ;(async () => {
      const apartmentData = await getApartment(roomId)
      dispatch(setApartment(apartmentData))
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const timestampsData = await getBookedDates(roomId)
      dispatch(setTimestamps(timestampsData))
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const qualifiedReviewers = await getQualifiedReviewers(roomId)
      setQualifiedReviewers(qualifiedReviewers)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const reviewsData = await getReviews(roomId)
      dispatch(setReviews(reviewsData))
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const securityFee = await getSecurityFee()
      dispatch(setSecurityFee(securityFee))
    })()
  }, [])

  const handleReviewOpen = () => {
    dispatch(setReviewModal('scale-100'))
  }

  return (
    <>
      <Head>
        <title>Room | {apartment?.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="py-8 px-10 sm:px-20 md:px-32 space-y-8">
        <Title apartment={apartment} />

        <ImageGrid
          first={apartment?.images[0]}
          second={apartment?.images[1]}
          third={apartment?.images[2]}
          forth={apartment?.images[3]}
          fifth={apartment?.images[4]}
        />

        <Description apartment={apartment} />
        <Calendar apartment={apartment} timestamps={timestamps} />
        <Actions apartment={apartment} />

        <div className="flex flex-col justify-between flex-wrap space-y-2">
          <div className="flex justify-start items-center space-x-2">
            <h1 className="text-xl font-semibold">Reviews</h1>
            {qualifiedReviewers?.includes(address) && (
              <button
                className="cursor-pointer text-pink-500 hover:text-pink-700"
                onClick={handleReviewOpen}
              >
                Drop your review
              </button>
            )}
          </div>
          <div>
            {reviews.map((review, i) => (
              <Review key={i} review={review} />
            ))}
            {reviews.length < 1 && 'No reviews yet!'}
          </div>
        </div>
      </div>
      <AddReview roomId={roomId} />
    </>
  )
}
