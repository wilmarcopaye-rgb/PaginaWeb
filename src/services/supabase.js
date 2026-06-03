import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
'https://pcnxnzkquaoitmdkkgpl.supabase.co'

const supabaseKey =
'pcnxnzkquaoitmdkkgpl'

export const supabase =
createClient(
  supabaseUrl,
  supabaseKey
)