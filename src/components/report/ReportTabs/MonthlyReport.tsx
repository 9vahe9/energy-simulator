import { Typography } from "antd";
import { AreaChart, LineChart, XAxis, YAxis } from "recharts";

const { Title } = Typography;

export const MonthlyReport = () => {
    return <div className="report-tab">
                <Title level={3}>Energy Consuption</Title>
                <AreaChart width={700} height={400}>
                    <XAxis dataKey="day"/>
                    <YAxis />
                </AreaChart>
            </div>
}