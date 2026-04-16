import { redirect } from "next/navigation";

export default function RootPage() {
  // Automatically redirect the root URL to your home page
  redirect("/onboarding");
}