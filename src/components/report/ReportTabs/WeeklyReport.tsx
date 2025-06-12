import { Typography } from "antd";
<<<<<<< dev
import { useTranslation } from "react-i18next";
=======
>>>>>>> main
import { AreaChart, LineChart, XAxis, YAxis } from "recharts";

const { Title, Text } = Typography;

export const WeeklyReport = () => {
<<<<<<< dev
    const { t } = useTranslation();

    return <div className="report-tab">
                <Title level={3}>{t("report.tabs.consumption")}</Title>
=======
    return <div className="report-tab">
                <Title level={3}>Energy Consuption</Title>
>>>>>>> main
                <AreaChart width={700} height={400}>
                    <XAxis dataKey="day"/>
                    <YAxis />
                </AreaChart>
            </div>
}