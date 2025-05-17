"use client";

import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlashcards } from '@/hooks/use-flashcards';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarDays, CheckCircle, Layers, Loader2, Target } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { format, subDays, parseISO } from 'date-fns';
import type { DailyReviewSummary } from '@/lib/types';

function DashboardStatsDisplay() {
  const { stats, isLoading: flashcardsLoading } = useFlashcards();
  const { user } = useAuth();

  if (flashcardsLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Loading...</CardTitle>
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    { title: "Cards Due Today", value: stats.dueToday, icon: CalendarDays, color: "text-destructive" },
    { title: "Total Cards", value: stats.totalCards, icon: Layers, color: "text-primary" },
    { title: "Cards Mastered", value: stats.cardsMastered, icon: CheckCircle, color: "text-green-500" },
    { title: "Reviewed Today", value: stats.reviewedTodayCount, icon: Target, color: "text-accent" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.title} className="shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            <item.icon className={`h-5 w-5 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ReviewHistoryChart() {
  const { dailySummaries, isLoading: flashcardsLoading } = useFlashcards();

  if (flashcardsLoading) {
    return (
       <Card className="shadow-lg col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Review History (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  // Prepare data for the last 7 days
  const chartData: { name: string; reviewed: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const summary = dailySummaries.find(s => s.date === dateStr);
    chartData.push({
      name: format(date, 'MMM d'),
      reviewed: summary ? summary.cardsReviewed : 0,
    });
  }


  return (
    <Card className="shadow-lg col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>Review History (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--chart-1))' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }}/>
            <Bar dataKey="reviewed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30}/>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


export default function DashboardPage() {
  const { user } = useAuth();
  const { isLoading: flashcardsLoading } = useFlashcards();

  return (
    <div className="space-y-8">
      <PageHeader 
        title={`Welcome, ${user?.name || 'User'}!`}
        description="Here's an overview of your learning progress."
      />
      
      <DashboardStatsDisplay />

      <ReviewHistoryChart />

    </div>
  );
}
