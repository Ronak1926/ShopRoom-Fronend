import SignOutConfirmation from "@/components/ui/SignOutConfirmation";

export default function ShopkeeperLogoutPage() {
  return (
    <SignOutConfirmation
      cookieName="shopkeeper_token"
      namePayloadKey="shopName"
      redirectTo="/login?tab=shopkeeper"
      description="You'll need to sign back in to manage your shop and send stock alerts to your room."
    />
  );
}
