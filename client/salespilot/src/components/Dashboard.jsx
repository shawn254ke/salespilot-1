import React from 'react';
import { getStatusCount, getConversionRate } from '../models/leads';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

import { 
  UsersIcon, 
  PhoneCallIcon, 
  ThumbsUpIcon, 
  CheckCircleIcon, 
  XCircleIcon
} from 'lucide-react';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer, 
  Tooltip
} from 'recharts';
import TimeBasedChart from './TimeBasedChart';

const Dashboard = ({ leads }) => {
  const newLeads = getStatusCount(leads, 'New');
  const contactedLeads = getStatusCount(leads, 'Contacted');
  const interestedLeads = getStatusCount(leads, 'Interested');
  const convertedLeads = getStatusCount(leads, 'Converted');
  const lostLeads = getStatusCount(leads, 'Lost');
  const conversionRate = getConversionRate(leads);

  const lineChartData = [
    { name: 'New', value: newLeads },
    { name: 'Contacted', value: contactedLeads },
    { name: 'Interested', value: interestedLeads },
    { name: 'Converted', value: convertedLeads },
    { name: 'Lost', value: lostLeads },
  ];

  const statusCardData = [
    {
      title: 'New Leads',
      value: newLeads,
      icon: UsersIcon,
      color: 'text-status-new',
      bgColor: 'bg-status-new',
    },
    {
      title: 'Contacted',
      value: contactedLeads,
      icon: PhoneCallIcon,
      color: 'text-status-contacted',
      bgColor: 'bg-status-contacted',
    },
    {
      title: 'Interested',
      value: interestedLeads  ,
      icon: ThumbsUpIcon,
      color: 'text-status-interested',
      bgColor: 'bg-status-interested',
    },
    {
      title: 'Converted',
      value: convertedLeads,
      icon: CheckCircleIcon,
      color: 'text-status-converted',
      bgColor: 'bg-status-converted',
    },
    {
      title: 'Lost',
      value: lostLeads, 
      icon: XCircleIcon,
      color: 'text-status-lost',
      bgColor: 'bg-status-lost',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statusCardData.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`${card.bgColor} bg-opacity-10 p-2 rounded-full`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {((card.value / leads.length) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <defs>
                  <linearGradient id="pipelineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
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
                  formatter={(value) => [`${value} leads`, 'Count']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#3b82f6' }}
                  fill="url(#pipelineGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center">
            <div className="relative h-40 w-40">
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-4xl font-bold">{conversionRate.toFixed(1)}%</span> 
              </div>
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#059669"
                  strokeWidth="10"
                  strokeDasharray={`${conversionRate * 2.83} 283`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {convertedLeads} converted out of {leads.length} total leads
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <TimeBasedChart leads={leads} />
      </div>
    </div>
  );
};

export default Dashboard;
