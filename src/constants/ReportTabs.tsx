import type { TabsProps } from "antd";
import { DailyReport } from "../components/report/ReportTabs/DailyReport";
import { WeeklyReport } from "../components/report/ReportTabs/WeeklyReport";
import { MonthlyReport } from "../components/report/ReportTabs/MonthlyReport";

export const tabs: TabsProps ["items"] = [
    {
        key: "1",
        label: "Daily",
        children: <DailyReport />,
    },
    {
        key: "2",
        label: "Weekly",
        children: <WeeklyReport />,
    },
    {
        key: "3",
        label: "Monthly",
        children: <MonthlyReport />,
    },
]