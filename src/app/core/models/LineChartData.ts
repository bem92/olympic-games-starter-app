export interface LineChartSeries {
  name: string;
  value: number;
}

export interface LineChartData {
  name: string;
  series: LineChartSeries[];
}
