import { useEffect } from 'react'
import { Booking } from '@/components'
import { useRouter } from 'next/router'
import { globalActions } from '@/store/globalSlices'
import { useDispatch, useSelector } from 'react-redux'
import { getBookings, getApartment } from '@/services/blockchain'

const Bookings = ({ apartmentData, bookingsData }) => {
  const router = useRouter()
  const { roomId } = router.query

  const dispatch = useDispatch()

  const { setApartment, setBookings } = globalActions
  const { apartment, bookings } = useSelector((states) => states.globalStates)

  useEffect(() => {
    ;(async () => {
      const apartmentData = await getApartment(roomId)
      dispatch(setApartment(apartmentData))
    })()
  }, [])
  useEffect(() => {
    ;(async () => {
      const bookingsData = await getBookings(roomId)
      dispatch(setBookings(bookingsData))
    })()
  }, [])

  return (
    <div className="w-full sm:w-3/5 mx-auto mt-8">
      <h1 className="text-center text-3xl text-black font-bold">Bookings</h1>
      {bookings.length < 1 && <div>No bookings for this apartment yet</div>}

      {bookings.map((booking, i) => (
        <Booking key={i} id={roomId} booking={booking} apartment={apartment} />
      ))}
    </div>
  )
}

export default Bookings
