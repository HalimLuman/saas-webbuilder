import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixStuckDeployments() {
    console.log("Fixing stuck deployments...");

    const { data, error } = await supabase
        .from("deployments")
        .update({ status: "success" })
        .eq("status", "building");

    if (error) {
        console.error("Error updating deployments:", error);
    } else {
        console.log("Successfully updated deployments:", data);
    }
}

fixStuckDeployments();
