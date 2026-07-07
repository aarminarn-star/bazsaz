import { useState, useEffect } from 'react'
import { fetchProducts } from '../lib/supabase'

const CatalogBottomSheet = ({ selectedDoorId, selectedHandleId, onSelectDoor, onSelectHandle, onProceed }) => {
  const [activeTab, setActiveTab] = useState('doors')
  const [doors, setDoors] = useState([])
  const [handles, setHandles] = useState([])
  const [loading, setLoading] = useState(false)
  const [doorsError, setDoorsError] = useState(null)
  const [handlesError, setHandlesError] = useState(null)
  const [doorsEmpty, setDoorsEmpty] = useState(false)
  const [handlesEmpty, setHandlesEmpty] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const [doorsResult, handlesResult] = await Promise.all([
        fetchProducts('doors'),
        fetchProducts('handles'),
      ])
      
      // Handle doors result
      setDoors(doorsResult.data || [])
      setDoorsError(doorsResult.error)
      setDoorsEmpty(doorsResult.empty)
      
      // Handle handles result
      setHandles(handlesResult.data || [])
      setHandlesError(handlesResult.error)
      setHandlesEmpty(handlesResult.empty)
    } catch (err) {
      console.error('Error loading products:', err)
      setDoorsError({ message: err.message })
      setHandlesError({ message: err.message })
    } finally {
      setLoading(false)
    }
  }

  const products = activeTab === 'doors' ? doors : handles
  const selectedId = activeTab === 'doors' ? selectedDoorId : selectedHandleId
  const onSelect = activeTab === 'doors' ? onSelectDoor : onSelectHandle
  const error = activeTab === 'doors' ? doorsError : handlesError
  const isEmpty = activeTab === 'doors' ? doorsEmpty : handlesEmpty

  return (
    <div className="bg-white border-t border-gray-200 shadow-xl rounded-t-3xl max-h-96 overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 sticky top-0 bg-white">
        <button
          onClick={() => setActiveTab('doors')}
          className={`flex-1 py-4 font-bold text-center transition-colors ${
            activeTab === 'doors'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🚪 درب‌ها
        </button>
        <button
          onClick={() => setActiveTab('handles')}
          className={`flex-1 py-4 font-bold text-center transition-colors ${
            activeTab === 'handles'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🔐 دستگیره‌ها
        </button>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
          </div>
        ) : error ? (
          // 🔴 DIAGNOSTIC: SHOW ERROR MESSAGE
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4">
            <p className="text-red-600 font-bold mb-2">❌ خطا در ارتباط با دیتابیس:</p>
            <p className="text-red-700 text-sm font-mono break-words">
              {error.message}
            </p>
            {error.code && (
              <p className="text-red-600 text-xs mt-2">
                <strong>کد خطا:</strong> {error.code}
              </p>
            )}
            {error.status && (
              <p className="text-red-600 text-xs mt-1">
                <strong>وضعیت:</strong> {error.status}
              </p>
            )}
            {error.details && (
              <p className="text-red-600 text-xs mt-2 font-mono">
                <strong>جزئیات:</strong> {JSON.stringify(error.details)}
              </p>
            )}
            <button
              onClick={loadProducts}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              تلاش دوباره
            </button>
          </div>
        ) : isEmpty ? (
          // 🟡 DIAGNOSTIC: SHOW EMPTY DATABASE WARNING
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
            <p className="text-yellow-700 font-bold mb-2">⚠️ دیتابیس خالی است</p>
            <p className="text-yellow-700 text-sm">
              ارتباط برقرار شد اما دیتابیس خالی است - احتمالاً به خاطر تنظیمات RLS در سوپابیس
            </p>
            <p className="text-yellow-600 text-xs mt-2">
              <strong>تب فعلی:</strong> {activeTab === 'doors' ? 'درب‌ها' : 'دستگیره‌ها'}
            </p>
            <button
              onClick={loadProducts}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              تلاش دوباره
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>محصولی یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => onSelect(product.id)}
                className={`aspect-square rounded-lg overflow-hidden border-3 transition-all ${
                  selectedId === product.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <button
          onClick={onProceed}
          disabled={!selectedDoorId}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            selectedDoorId
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          ادامه برای ثبت سفارش
        </button>
      </div>
    </div>
  )
}

export default CatalogBottomSheet
