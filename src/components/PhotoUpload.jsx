import { useState } from 'react'

const PhotoUpload = ({ onPhotoUpload }) => {
  const [uploadedPhoto, setUploadedPhoto] = useState(null)
  const [showOptions, setShowOptions] = useState(false)

  const handleFileSelect = (file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const photoUrl = e.target.result
        setUploadedPhoto(photoUrl)
        onPhotoUpload(photoUrl)
      }
      reader.readAsDataURL(file)
      setShowOptions(false)
    }
  }

  const handleCameraClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e) => handleFileSelect(e.target.files[0])
    input.click()
  }

  const handleGalleryClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => handleFileSelect(e.target.files[0])
    input.click()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-50 p-6">
      {/* Logo */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🚪 بازساز</h1>
        <p className="text-lg text-gray-600">کاتالوگ درب‌های ضد سرقت</p>
      </div>

      {/* Photo Slot */}
      <div
        className="w-full max-w-sm aspect-square rounded-2xl bg-white border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all mb-8 shadow-sm"
        onClick={() => setShowOptions(!showOptions)}
      >
        {uploadedPhoto ? (
          <div className="w-full h-full rounded-2xl overflow-hidden">
            <img src={uploadedPhoto} alt="Uploaded" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-4">📸</div>
            <p className="text-gray-600 font-medium">عکس خود را انتخاب کنید</p>
          </div>
        )}
      </div>

      {/* Options Drawer */}
      {showOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-end z-50" onClick={() => setShowOptions(false)}>
          <div
            className="w-full bg-white rounded-t-3xl p-8 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              <button
                onClick={handleCameraClick}
                className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-3"
              >
                <span className="text-2xl">📷</span>
                دوربین
              </button>
              <button
                onClick={handleGalleryClick}
                className="w-full py-4 bg-gray-200 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-3"
              >
                <span className="text-2xl">🖼️</span>
                گالری
              </button>
              <button
                onClick={() => setShowOptions(false)}
                className="w-full py-4 bg-gray-100 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors"
              >
                بازگشت
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      {uploadedPhoto && (
        <button
          onClick={() => onPhotoUpload(uploadedPhoto)}
          className="w-full max-w-sm py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-colors"
        >
          مشاهده نتیجه
        </button>
      )}
    </div>
  )
}

export default PhotoUpload
