import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MaturityData {
  category: string;
  current: number;
  improved: number;
}

interface MaturityRadarChartProps {
  data: MaturityData[];
  title: string;
  showImproved?: boolean;
}

export const MaturityRadarChart = ({ data, title, showImproved = true }: MaturityRadarChartProps) => {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
            tickLine={false}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
          />
          <Radar
            name="Current Maturity"
            dataKey="current"
            stroke="hsl(var(--destructive))"
            fill="hsl(var(--destructive))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          {showImproved && (
            <Radar
              name="With IT Control Box"
              dataKey="improved"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          )}
          <Legend 
            wrapperStyle={{ 
              paddingTop: "20px",
              fontSize: "12px"
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
