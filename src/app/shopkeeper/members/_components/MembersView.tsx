"use client";

import ShopkeeperShell from "@/components/shopkeeper/ShopkeeperShell";
import MembersTable from "@/components/shopkeeper/MembersTable";

export default function MembersView({ initialQuery }: { initialQuery: string }) {
  return (
    <ShopkeeperShell>
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-1 text-[28px] font-bold text-(--color-text-primary)">Members</h1>
        <p className="mb-6 text-[14px] text-(--color-text-secondary)">Everyone who has joined your room.</p>
        <MembersTable variant="full" initialQuery={initialQuery} />
      </div>
    </ShopkeeperShell>
  );
}
