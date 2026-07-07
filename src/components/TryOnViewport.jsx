import { useState, useEffect } from 'react'
import { fetchProducts } from '../lib/supabase'

const TryOnViewport = ({ backgroundPhoto, selectedDoorId, onShowResult, onEditPhoto }) => {
  const [doorImage, setDoorImage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedDoorId) {
      loadDoorImage()
    }
  }, [selectedDoorId])

  const loadDoorImage = async () => {
    setLoading(true)
    try {
      const products = await fetchProducts('doors')
      const selectedDoor = products.find(p => p.id === selectedDoorId)
      if (selectedDoor) {
        setDoorImage(selectedDoor.image_url)
      }
    } catch (err) {
      console.error('Error loading door image:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 relative bg-black overflow-hidden">
      {/* Background Photo */}
      {backgroundPhoto && (
        <img
          src={backgroundPhoto}
          alt="Room"
          className="w-full h-full object-cover"
        />
      )}

      {/* Door Overlay - Clean Static Container */}
      {doorImage && !loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={doorImage}
            alt="Door"
            className="h-full max-w-xs object-contain"
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>در حال بارگذاری...</p>
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-6 right-6 left-6 flex justify-between items-center z-10">
        <button
          onClick={onEditPhoto}
          className="bg-white bg-opacity-90 text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-opacity-100 transition-all"
        >
          عکس مجدد
        </button>
        <h2 className="text-white font-bold text-lg">پیش‌نمایش</h2>
      </div>
    </div>
  )
}

export default TryOnViewport
