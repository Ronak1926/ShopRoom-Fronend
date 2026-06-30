import SignOutConfirmation from "@/components/ui/SignOutConfirmation";

export default function CustomerLogoutPage() {
  return (
    <SignOutConfirmation
      cookieName="token"
      namePayloadKey="fullName"
      redirectTo="/customer/login"
      description="You'll need to sign back in to browse rooms and connect with your favourite shops."
    />
  );
}
