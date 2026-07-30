import { currentUser } from "@clerk/nextjs/server";

export async function isAdmin() {
  const user = await currentUser();
  const adminEmail = process.env.ADMIN_EMAIL;

  return Boolean(
    adminEmail &&
      user?.emailAddresses.some((email) => email.emailAddress === adminEmail)
  );
}
