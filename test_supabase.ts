import { supabase } from "./src/lib/supabase";

async function check() {
  const { data, error } = await supabase.from("faqs").select("*").limit(1);
  console.log("faqs:", data, error);
  
  const { data: d2, error: e2 } = await supabase.from("exam_links").select("count").limit(1);
  console.log("exam_links count error:", e2);
}

check();
