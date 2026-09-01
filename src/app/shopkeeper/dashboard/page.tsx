"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import Sidebar from "./_components/Sidebar";
import TopBar from "./_components/TopBar";
import DashboardHero from "./_components/DashboardHero";
import StatCards from "./_components/StatCards";
import RecentActivityCard from "./_components/RecentActivityCard";
import RecentNotificationsTable from "./_components/RecentNotificationsTable";
import RoomInsightsCard from "./_components/RoomInsightsCard";
import MembersTable from "./_components/MembersTable";
import DashboardSkeleton from "./_components/DashboardSkeleton";
import ShareModal from "@/components/ui/ShareModal";
import ChartCardSkeleton from "./_components/ChartCardSkeleton";
import { useDashboardData, joinsByDay, joinTrend } from "./_hooks/useDashboardData";
import { buildSampleMetrics } from "./_data/sampleMetrics";
import { DEFAULT_RANGE_DAYS, rangeLabel, rangeSpanLabel } from "./_data/ranges";

const MEMBERS_ANCHOR = "room-members";

// Recharts is the heaviest thing on the page and nothing above the fold needs
// it, so the four chart cards arrive on their own with a skeleton in place.
// next/dynamic only accepts an inline options literal, hence the repetition.
const PerformanceChart = dynamic(() => import("./_components/PerformanceChart"), {
  ssr: false,
  loading: () => <ChartCardSkeleton />,
});
const AudienceLocationCard = dynamic(() => import("./_components/AudienceLocationCard"), {
  ssr: false,
  loading: () => <ChartCardSkeleton />,
});
const MemberGrowthChart = dynamic(() => import("./_components/MemberGrowthChart"), {
  ssr: false,
  loading: () => <ChartCardSkeleton />,
});
const EngagementFunnel = dynamic(() => import("./_components/EngagementFunnel"), {
  ssr: false,
  loading: () => <ChartCardSkeleton />,
});

export default function ShopkeeperDashboard() {
  const router = useRouter();
  const { data, loading, error, reload } = useDashboardData();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [rangeDays, setRangeDays] = useState<number>(DEFAULT_RANGE_DAYS);
  const [showShare, setShowShare] = useState(false);

  const trend = useMemo(
    () => joinTrend(data?.members ?? [], rangeDays),
    [data?.members, rangeDays],
  );
  const joins = useMemo(
    () => joinsByDay(data?.members ?? [], rangeDays),
    [data?.members, rangeDays],
  );
  const metrics = useMemo(
    () => buildSampleMetrics(rangeDays, data?.membersTotal ?? 0, data?.designs ?? []),
    [rangeDays, data?.membersTotal, data?.designs],
  );

  function handleNavChange(id: string) {
    if (id === "myroom") router.push(`/shopkeeper/room/${data?.roomId ?? "_"}`);
    else if (id === "profile") router.push("/shopkeeper/profile");
    else if (id === "members") scrollToMembers();
    else setActiveNav(id);
  }

  function scrollToMembers() {
    document.getElementById(MEMBERS_ANCHOR)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex h-screen bg-(--color-bg-page) text-(--color-text-primary) overflow-hidden">
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar
          inviteLink={data?.inviteLink ?? undefined}
          onShareClick={() => setShowShare(true)}
        />

        <main className="flex-1 p-7 overflow-y-auto">
          {!data ? (
            loading ? (
              <DashboardSkeleton />
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-(--color-border-strong) bg-(--color-bg-surface) py-16 px-6 text-center">
                <p className="text-[13px] text-(--color-text-secondary)">
                  {error ?? "Could not load your dashboard."}
                </p>
                <button
                  type="button"
                  onClick={() => void reload()}
                  className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-(--color-border-default) text-[12.5px] font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
                >
                  <RefreshOutlinedIcon sx={{ fontSize: 15 }} />
                  Try again
                </button>
              </div>
            )
          ) : (
            <div className="flex flex-col gap-5">
              <DashboardHero
                data={data}
                rangeDays={rangeDays}
                onRangeChange={setRangeDays}
                rangeSpan={rangeSpanLabel(rangeDays)}
                onShare={() => setShowShare(true)}
              />

              <StatCards
                data={data}
                metrics={metrics}
                memberDelta={trend.delta}
                windowLabel={`vs previous ${rangeDays} days`}
              />

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
                <div className="xl:col-span-5 min-w-0">
                  <PerformanceChart series={metrics.series} rangeLabel={rangeLabel(rangeDays)} />
                </div>
                <div className="xl:col-span-3 min-w-0">
                  <AudienceLocationCard
                    audience={data.audience}
                    hasCoordinates={data.hasCoordinates}
                    onViewMembers={scrollToMembers}
                  />
                </div>
                <div className="xl:col-span-4 min-w-0">
                  <RecentActivityCard sends={metrics.recent} />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
                <div className="xl:col-span-7 min-w-0">
                  <MemberGrowthChart
                    joins={joins}
                    delta={trend.delta}
                    windowLabel={`vs previous ${rangeDays} days`}
                  />
                </div>
                <div className="xl:col-span-5 min-w-0">
                  <EngagementFunnel metrics={metrics} />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                <div className="xl:col-span-7 min-w-0">
                  <RecentNotificationsTable sends={metrics.recent} />
                </div>
                <div className="xl:col-span-5 min-w-0">
                  <RoomInsightsCard
                    membersTotal={data.membersTotal}
                    newMembers={trend.count}
                    newMembersDelta={trend.delta}
                    activeMembers={metrics.insights.activeMembers}
                    returningMembers={metrics.insights.returningMembers}
                    engagementScore={metrics.insights.engagementScore}
                    windowLabel={`vs previous ${rangeDays} days`}
                  />
                </div>
              </div>

              <div id={MEMBERS_ANCHOR}>
                <MembersTable />
              </div>
            </div>
          )}
        </main>
      </div>

      {showShare && data?.inviteLink && (
        <ShareModal inviteLink={data.inviteLink} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
