import { useState } from 'react'
import { insertLead } from '../lib/supabase'

const LeadCapture = ({ phoneNumber, selectedDoorId, selectedHandleId, onPhoneChange, onBack }) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const isValidPhone = phoneNumber.length >= 10 && phoneNumber.match(/^[0-9]+$/)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await insertLead(phoneNumber, selectedDoorId, selectedHandleId)

      if (result) {
        setSuccess(true)
        // Redirect to WhatsApp
        const message = `سلام! من درب مدل ${selectedDoorId} و دستگیره ${selectedHandleId} را انتخاب کردم.`
        const whatsappUrl = `https://wa.me/989000000000?text=${encodeURIComponent(message)}`
        window.location.href = whatsappUrl
      } else {
        setError('خرابی در ثبت اطلاعات. لطفاً دوباره تلاش کنید.')
      }
    } catch (err) {
      setError('خطایی رخ داد. لطفاً دوباره تلاش کنید.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">تکمیل سفارش</h1>
        <p className="text-gray-600 mb-8">شماره تماس خود را وارد کنید</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✅ اطلاعات شما با موفقیت ثبت شد!
          </div>
        )}

        {/* Phone Input */}
        <div className="mb-8">
          <label className="block text-gray-700 font-bold mb-3">شماره تماس</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="09xxxxxxxxx"
            className="w-full py-4 px-4 border-2 border-gray-300 rounded-lg font-bold text-lg focus:outline-none focus:border-blue-500 transition-colors"
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isValidPhone || loading}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-4 ${
            isValidPhone && !loading
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'در حال ارسال...' : 'ادامه در WhatsApp'}
        </button>

        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={loading}
          className="w-full py-4 bg-gray-200 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-300 transition-colors"
        >
          بازگشت
        </button>
      </div>
    </div>
  )
}

export default LeadCapture
