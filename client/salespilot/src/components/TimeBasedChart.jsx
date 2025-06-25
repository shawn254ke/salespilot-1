import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

const TimeBasedChart = ({ leads }) => {
  const [viewType, setViewType] = useState('weekly');

  const generateChartData = () => {
    const now = new Date();
    const data = [];

    if (viewType === 'weekly') {
      // Generate data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        
        const leadsCount = leads.filter(lead => {
          const leadDate = new Date(lead.createdOn);
          return leadDate.toDateString() === date.toDateString();
        }).length;

        data.push({
          period: dateStr,
          leads: leadsCount,
          conversions: leads.filter(lead => {
            const leadDate = new Date(lead.createdOn);
            return leadDate.toDateString() === date.toDateString() && 
                   lead.status === 'Converted';
          }).length
        });
      }
    } else {
      // Generate data for the last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toLocaleDateString('en-US', { 
          month: 'short',
          year: '2-digit'
        });
        
        const leadsCount = leads.filter(lead => {
          const leadDate = new Date(lead.createdOn);
          return leadDate.getMonth() === date.getMonth() && 
                 leadDate.getFullYear() === date.getFullYear();
        }).length;

        data.push({
          period: monthStr,
          leads: leadsCount,
          conversions: leads.filter(lead => {
            const leadDate = new Date(lead.createdOn);
            return leadDate.getMonth() === date.getMonth() && 
                   leadDate.getFullYear() === date.getFullYear() &&
                   lead.status === 'Converted';
          }).length
        });
      }
    }

    return data;
  };

  const chartData = generateChartData();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Leads Over Time
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={viewType === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={viewType === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('monthly')}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="period" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              formatter={(value, name) => [
                `${value} ${name}`, 
                name === 'leads' ? 'Total Leads' : 'Conversions'
              ]}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="leads" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="conversions" 
              stroke="#059669" 
              strokeWidth={2}
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TimeBasedChart;
