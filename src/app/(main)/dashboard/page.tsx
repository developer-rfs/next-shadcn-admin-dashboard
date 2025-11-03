import { redirect } from "next/navigation";

export default function Page() {
  redirect("/dashboard/tournaments");
  return null;
}
