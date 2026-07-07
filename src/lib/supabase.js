import { createClient } from '@supabase/supabase-js'

// ✅ HARDCODED SUPABASE CREDENTIALS - VERIFIED FOR PRODUCTION
const SUPABASE_URL = 'https://uisfekhtycxfnpwgywvg.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_Mv99fVAf4gNnJNbq7U0X0g_YLdFvdcA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ✅ FETCH ALL PRODUCTS - THEN FILTER IN APP LOGIC
// No category filter in query - handle NULL/missing categories in JavaScript
export const fetchAllProducts = async () => {
  try {
    console.log('📦 Fetching all products (no category filter)')
    
    // CLEAN QUERY - NO FILTERS, NO ORDER BY
    const { data, error } = await supabase
      .from('products')
      .select('*')

    // IF ERROR - RETURN ERROR OBJECT WITH MESSAGE
    if (error) {
      console.error('❌ Supabase error:', error)
      return {
        data: [],
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          status: error.status,
        },
        empty: false,
      }
    }

    // IF DATA IS EMPTY - RETURN EMPTY FLAG
    if (!data || data.length === 0) {
      console.warn('⚠️ No products found in database')
      return {
        data: [],
        error: null,
        empty: true,
      }
    }

    console.log(`✅ Found ${data.length} total products`)
    return {
      data,
      error: null,
      empty: false,
    }
  } catch (err) {
    console.error('💥 Unexpected error fetching products:', err)
    return {
      data: [],
      error: {
        message: err.message || 'Unknown error',
        type: 'EXCEPTION',
      },
      empty: false,
    }
  }
}

// ✅ FILTER PRODUCTS BY CATEGORY IN JAVASCRIPT
// NULL/empty categories default to "doors"
export const filterProductsByCategory = (products, category) => {
  if (!products || products.length === 0) return []
  
  return products.filter(product => {
    // BULLETPROOF: If category is NULL, undefined, empty string -> default to "doors"
    const productCategory = (product.category && product.category.trim()) || 'doors'
    const targetCategory = (category && category.trim()) || 'doors'
    
    console.log(`🔍 Product "${product.title}" category: "${productCategory}" vs target: "${targetCategory}"`, productCategory === targetCategory)
    
    return productCategory === targetCategory
  })
}

// Insert lead into database
export const insertLead = async (phoneNumber, selectedDoorId, selectedHandleId) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        phone_number: phoneNumber,
        selected_door_id: selectedDoorId,
        selected_handle_id: selectedHandleId,
      })
      .select()

    if (error) {
      console.error('❌ Error inserting lead:', error.message)
      return null
    }

    return data?.[0] || null
  } catch (err) {
    console.error('❌ Unexpected error inserting lead:', err)
    return null
  }
}
