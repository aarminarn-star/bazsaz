import { useState, useEffect } from 'react'
import { fetchAllProducts, filterProductsByCategory } from '../lib/supabase'

const CatalogBottomSheet = ({ selectedDoorId, selectedHandleId, onSelectDoor, onSelectHandle, onProceed }) => {
  const [activeTab, setActiveTab] = useState('doors')
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    setIsEmpty(false)
    
    try {
      const result = await fetchAllProducts()
      
      console.log('📊 fetchAllProducts result:', result)
      
      if (result.error) {
        console.error('❌ Error from fetch:', result.error)
        setError(result.error)
        setAllProducts([])
      } else if (result.empty) {
        console.warn('⚠️ Database is empty')
        setIsEmpty(true)
        setAllProducts([])
      } else {
        console.log(`✅ Loaded ${result.data.length} products:`, result.data)
        setAllProducts(result.data || [])
      }
    } catch (err) {
      console.error('💥 Error loading products:', err)
      setError({ message: err.message })
      setAllProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Filter products by active tab category
  const products = filterProductsByCategory(allProducts, activeTab)
  const selectedId = activeTab === 'doors' ? selectedDoorId : selectedHandleId
  const onSelect = activeTab === 'doors' ? onSelectDoor : onSelectHandle

  console.log(`📊 Active tab: "${activeTab}", Total products: ${allProducts.length}, Filtered: ${products.length}`)

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
          🚪 درب‌ها {activeTab === 'doors' && products.length > 0 && `(${products.length})`}
        </button>
        <button
          onClick={() => setActiveTab('handles')}
          className={`flex-1 py-4 font-bold text-center transition-colors ${
            activeTab === 'handles'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🔐 دستگیره‌ها {activeTab === 'handles' && products.length > 0 && `(${products.length})`}
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
              اتصال برقرار شد اما دیتابیس خالی است - احتمالاً به خاطر تنظیمات RLS در سوپابیس
            </p>
            <button
              onClick={loadProducts}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              تلاش دوباره
            </button>
          </div>
        ) : allProducts.length > 0 && products.length === 0 ? (
          // 🟠 NO PRODUCTS IN THIS CATEGORY (but others exist)
          <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-4">
            <p className="text-orange-700 font-bold mb-2">ℹ️ محصولی در این دسته یافت نشد</p>
            <p className="text-orange-700 text-sm">
              در کل {allProducts.length} محصول وجود دارد، اما برای این دسته محصولی موجود نیست.
            </p>
            <p className="text-orange-600 text-xs mt-2">
              فعلاً همه محصولات در تب "درب‌ها" قرار می‌گیرند.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>محصولی یافت نشد</p>
          </div>
        ) : (
          // ✅ SUCCESS: RENDER PRODUCTS GRID
          <div className="grid grid-cols-3 gap-4">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => onSelect(product.id)}
                className={`aspect-square rounded-lg overflow-hidden border-3 transition-all shadow-md hover:shadow-lg ${
                  selectedId === product.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                title={product.title || 'محصول'}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title || 'محصول'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23ccc" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <span>🖼️</span>
                  </div>
                )}
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
