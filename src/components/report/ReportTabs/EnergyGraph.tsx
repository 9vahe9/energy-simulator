import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";


export const EnergyGraph = ({ data }: { data: { timestamp: string; totalEnergy: number }[] }) => {

    return (
        <div className="report-tab">
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                    <YAxis unit="kWt" />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="totalEnergy"
                        stroke="#8884d8"
                        fill="#8884d8"
                        dot={{ r: 4 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
