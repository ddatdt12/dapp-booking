import { useEffect, useState } from 'react'
import { truncate } from '@/utils/helper'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { FaTimes } from 'react-icons/fa'
import { getApartment, updateApartment } from '@/services/blockchain'

export default function Edit() {
  const { address } = useAccount()
  const router = useRouter()
  const { roomId } = router.query

  console.log('roomId', roomId)
  const [apartment, setApartment] = useState({
    id: roomId,
    name: '',
    description: '',
    location: '',
    rooms: 0,
    images: [],
    price: 0,
  })
  const [currentImage, setCurrentImage] = useState('')
  const navigate = useRouter()

  useEffect(() => {
    if (!roomId) return
    ;(async () => {
      const apartmentData = await getApartment(roomId)
      console.log('apartmentData', apartmentData)
      setApartment(apartmentData)
    })()
  }, [roomId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('handleSubmit apartment', apartment)
    if (!address) return
    if (!apartment.images.length) return
    if (
      !apartment.name ||
      !apartment.description ||
      !apartment.location ||
      !apartment.rooms ||
      !apartment.price
    )
      alert('Please fill all fields')

    const params = {
      ...apartment,
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await updateApartment(params)
          .then(async () => {
            navigate.push('/room/' + apartment.id)
            resolve()
          })
          .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'Apartment updated successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const addImage = (e) => {
    e.preventDefault()
    if (currentImage) {
      setApartment((prev) => ({ ...prev, images: [...prev.images, currentImage] }))
    }
    setCurrentImage('')
  }

  const removeImage = (e, index) => {
    e.preventDefault()
    const newLinks = apartment.images.filter((_, i) => i !== index)
    setApartment((prev) => ({ ...prev, images: newLinks }))
  }

  const updateApartmentField = (field, value) => {
    setApartment((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="h-screen flex justify-center mx-auto">
      <div className="w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-center items-center">
            <p className="font-semibold text-black">Edit Room</p>
          </div>

          <div className="flex flex-row justify-between items-center border border-gray-300 p-2 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="text"
              name="name"
              placeholder="Room Name "
              onChange={(e) => updateApartmentField('name', e.target.value)}
              value={apartment.name}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center border border-gray-300 p-2 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="price"
              placeholder="Price (ETH)"
              onChange={(e) => updateApartmentField('price', e.target.value)}
              value={apartment.price}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center border border-gray-300 p-2 rounded-xl mt-5">
            <input
              className="block flex-1 text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="url"
              name="images"
              placeholder="Images"
              onChange={(e) => setCurrentImage(e.target.value)}
              value={currentImage}
            />

            {apartment?.links?.length != 5 && (
              <button
                onClick={(e) => addImage(e)}
                type="button"
                className="p-2 bg-[#ff385c] text-white rounded-full text-sm"
              >
                Add image link
              </button>
            )}
          </div>

          <div
            className="flex flex-row justify-start items-center
          rounded-xl mt-5 space-x-1 flex-wrap"
          >
            {apartment.images.map((link, i) => (
              <div
                key={i}
                className="p-2 rounded-full text-gray-500 bg-gray-200 font-semibold
                flex items-center w-max cursor-pointer active:bg-gray-300
                transition duration-300 ease space-x-2 text-xs"
              >
                <span>{truncate(link, 4, 4, 11)}</span>
                <button
                  onClick={(e) => removeImage(e, i)}
                  type="button"
                  className="bg-transparent hover focus:outline-none"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>

          <div
            className="flex flex-row justify-between items-center
          border border-gray-300 p-2 rounded-xl mt-5"
          >
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="text"
              name="location"
              placeholder="Location"
              onChange={(e) => updateApartmentField('location', e.target.value)}
              value={apartment.location}
              required
            />
          </div>

          <div
            className="flex flex-row justify-between items-center
          border border-gray-300 p-2 rounded-xl mt-5"
          >
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="text"
              name="rooms"
              placeholder="Number of room"
              onChange={(e) => updateApartmentField('rooms', e.target.value)}
              value={apartment.rooms}
              required
            />
          </div>

          <div
            className="flex flex-row justify-between items-center
          border border-gray-300 p-2 rounded-xl mt-5"
          >
            <textarea
              className="block w-full text-sm resize-none
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 h-20"
              type="text"
              name="description"
              placeholder="Room Description"
              onChange={(e) => updateApartmentField('description', e.target.value)}
              value={apartment.description}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className={`flex flex-row justify-center items-center
            w-full text-white text-md bg-[#ff385c]
            py-2 px-5 rounded-full drop-shadow-xl hover:bg-white
            border-transparent border
            hover:hover:text-[#ff385c]
            hover:border-[#ff385c]
            mt-5 transition-all duration-500 ease-in-out ${
              !address ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!address}
          >
            Update Apartment
          </button>
        </form>
      </div>
    </div>
  )
}
