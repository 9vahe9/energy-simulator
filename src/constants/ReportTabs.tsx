import type { TabsProps } from "antd";
import { DailyReport } from "../components/report/ReportTabs/DailyReport";
import { WeeklyReport } from "../components/report/ReportTabs/WeeklyReport";
import { MonthlyReport } from "../components/report/ReportTabs/MonthlyReport";
import { useTranslation } from "react-i18next";


export const useTabs = (): TabsProps ["items"] =>{
    
    const { t } = useTranslation();

    return [
        {
            key: "1",
            label: t("report.tabs.day"),
            children: <DailyReport />,
        },
        {
            key: "2",
            label: t("report.tabs.week"),
            children: <WeeklyReport />,
        },
        {
            key: "3",
            label: t("report.tabs.month"),
            children: <MonthlyReport />,
        },
    ]
} 
