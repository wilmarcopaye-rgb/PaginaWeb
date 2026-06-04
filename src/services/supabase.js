
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pcnxnzkquaoitmdkkgpl.supabase.co";
const supabaseKey = "sb_publishable_lNIFFmHF1X4hgF2-KC08aw_OaLmT10g";

export const supabase = createClient(supabaseUrl, supabaseKey);