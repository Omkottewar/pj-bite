"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import User, { ISavedAddress } from "@/models/User";
import { revalidatePath } from "next/cache";

export async function addAddress(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  await dbConnect();

  const newAddress: ISavedAddress = {
    label: formData.get("label") as string,
    street: formData.get("street") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    zip: formData.get("zip") as string,
    phone: formData.get("phone") as string,
  };

  await User.findByIdAndUpdate(userId, {
    $push: { savedAddresses: newAddress }
  });

  revalidatePath("/dashboard");
}

export async function removeAddress(addressId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  await dbConnect();

  await User.findByIdAndUpdate(userId, {
    $pull: { savedAddresses: { _id: addressId } }
  });

  revalidatePath("/dashboard");
}
