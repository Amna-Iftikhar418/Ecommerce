import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return userId;
}

export async function getAdminUser() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const role = user.publicMetadata?.role;
  if (role !== "ADMIN") redirect("/");
  return user;
}
