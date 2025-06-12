import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

export const CostGraph = ({ data }: { data: { timestamp: string; totalCost: number }[] }) => {

    return <div className="report-tab">
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                        <YAxis unit="$" />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="totalCost"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            dot={{ r: 4 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
}