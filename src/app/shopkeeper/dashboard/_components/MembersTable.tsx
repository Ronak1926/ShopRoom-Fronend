"use client";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { MEMBERS } from "../_data/constants";

const TH =
  "text-[10px] font-semibold tracking-widest uppercase text-(--color-text-hint) pb-2 border-b border-(--color-border-default) text-left";
const TD =
  "border-b border-(--color-bg-page) h-14 align-middle text-[13px] text-(--color-text-secondary)";

export default function MembersTable() {
  return (
    <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-[14px] p-6 mt-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-(--color-text-primary)">
          Active Members
        </span>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-xs font-semibold text-(--color-text-secondary) border border-(--color-border-default) rounded-lg px-3 h-8 cursor-pointer bg-(--color-bg-surface) hover:bg-(--color-bg-page) transition-colors font-[inherit]">
            <FilterListOutlinedIcon sx={{ fontSize: 14 }} /> Filter
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-(--color-text-secondary) border border-(--color-border-default) rounded-lg px-3 h-8 cursor-pointer bg-(--color-bg-surface) hover:bg-(--color-bg-page) transition-colors font-[inherit]">
            <FileDownloadOutlinedIcon sx={{ fontSize: 14 }} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr>
            <th className={`${TH} w-[35%]`}>Member Name</th>
            <th className={`${TH} w-[20%]`}>Joined Date</th>
            <th className={`${TH} w-[20%]`}>Last Seen</th>
            <th className={`${TH} w-[15%]`}>Notifications</th>
            <th className={`${TH} w-[10%]`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {MEMBERS.map((m) => (
            <tr key={m.id}>
              <td className={TD}>
                <div className="flex items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mr-2.5 ${m.avatarBgClass}`}
                  >
                    <PersonOutlinedIcon
                      sx={{
                        fontSize: 17,
                        color: "var(--color-text-secondary)",
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-(--color-text-primary)">
                      {m.name}
                    </div>
                    <div className="text-xs text-(--color-text-secondary)">
                      {m.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className={TD}>{m.joined}</td>
              <td className={TD}>
                {m.online ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-(--color-online)" />
                    Online Now
                  </div>
                ) : (
                  m.lastSeen
                )}
              </td>
              <td className={TD}>
                {m.notifOn ? (
                  <NotificationsOutlinedIcon
                    sx={{ fontSize: 18, color: "var(--color-brand-primary)" }}
                  />
                ) : (
                  <NotificationsOffOutlinedIcon
                    sx={{ fontSize: 18, color: "var(--color-text-secondary)" }}
                  />
                )}
              </td>
              <td className={TD}>
                <button className="w-8 h-8 flex items-center justify-center bg-transparent border-0 rounded-lg cursor-pointer text-(--color-text-secondary) hover:bg-(--color-bg-page) transition-colors">
                  <MoreVertOutlinedIcon sx={{ fontSize: 18 }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-(--color-text-secondary)">
          Showing 3 of 312 members
        </span>
        <div className="flex gap-1.5">
          <button className="w-7 h-7 flex items-center justify-center border border-(--color-border-default) rounded-md bg-(--color-bg-surface) cursor-pointer text-(--color-text-secondary) hover:bg-(--color-bg-page) transition-colors">
            <ChevronLeftOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center border border-(--color-border-default) rounded-md bg-(--color-bg-surface) cursor-pointer text-(--color-text-secondary) hover:bg-(--color-bg-page) transition-colors">
            <ChevronRightOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
