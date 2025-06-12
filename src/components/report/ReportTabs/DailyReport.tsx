import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { AreaChart, LineChart, XAxis, YAxis } from "recharts";

const { Title, Text } = Typography;

export const DailyReport = () => {
    const { t } = useTranslation();

    return <div className="report-tab">
        <Title level={3}>{t("report.tabs.consumption")}</Title>
        <AreaChart width={700} height={400}>
            <XAxis dataKey="day"/>
            <YAxis />
        </AreaChart>
    </div>
}