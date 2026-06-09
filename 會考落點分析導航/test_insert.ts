import { supabase } from "./src/lib/supabase";

async function check() {
  const { data, error } = await supabase.from("exam_links").insert([{
    title: "Test FAQ",
    url: "",
    region: "全國",
    category: "常見問答",
    description: "This is a test FAQ."
  }]).select();
  console.log("Insert result:", data, error);
}

check();
