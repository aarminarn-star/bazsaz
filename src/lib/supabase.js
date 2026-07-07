import { createClient } from '@supabase/supabase-js'

// ✅ HARDCODED SUPABASE CREDENTIALS - VERIFIED FOR PRODUCTION
const SUPABASE_URL = 'https://uisfekhtycxfnpwgywvg.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_Mv99fVAf4gNnJNbq7U0X0g_YLdFvdcA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ✅ SAFE PRODUCT FETCH - CLEAN QUERY WITH DIAGNOSTICS
export const fetchProducts = async (type) => {
  try {
    console.log(`📥 Fetching products for type: ${type}`)
    
    // CLEAN QUERY - NO ORDER BY, NO created_at
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('type', type)

    // IF ERROR - RETURN ERROR OBJECT WITH MESSAGE
    if (error) {
      console.error(`❌ Supabase error for ${type}:`, error)
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
      console.warn(`⚠️ No products found for type: ${type}`)
      return {
        data: [],
        error: null,
        empty: true,
      }
    }

    console.log(`✅ Found ${data.length} products for type: ${type}`)
    return {
      data,
      error: null,
      empty: false,
    }
  } catch (err) {
    console.error(`💥 Unexpected error fetching ${type}:`, err)
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
