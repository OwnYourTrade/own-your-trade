import { redirect } from "next/navigation";

// Set meals now live within the Menu page. Keep this URL working for any
// existing links by redirecting to the menu's set-meals section.
export default function SetMealsRedirect() {
  redirect("/takeaway/demo/menu#set-meals");
}
