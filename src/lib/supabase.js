import { createClient } from '@supabase/supabase-js'

// Hardcoded Supabase credentials (as per project specification)
const SUPABASE_URL = 'https://uisfekhtycxfnpwgywvg.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_Mv99fVAf4gNnJNbq7U0X0g_YLdFvdcA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ✅ SAFE PRODUCT FETCH - NO created_at ORDERING
export const fetchProducts = async (type) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, title, image_url')
      .eq('type', type)

    if (error) {
      console.error(`❌ Error fetching ${type}:`, error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error(`❌ Unexpected error fetching ${type}:`, err)
    return []
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
