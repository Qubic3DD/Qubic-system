
import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
import Chart from 'chart.js/auto';
import { AnalyticsService } from '../../services/analytics.service';
import {MetricsCardComponent} from '../../components/dashboard/metrics-card/metrics-card.component'
import {CampaignStatusComponent} from '../../components/dashboard/campaign-status/campaign-status.component'
import {VehicleDistributionComponent} from'../../components/dashboard/vehicle-distribution/vehicle-distribution.component'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardsComponent } from "../cards/cards.component";
import { CampaignsComponent } from "../campaigns/campaigns.component";
import { ActiveCampaignsComponent } from "../active-campaigns/active-campaigns.component";
import { RevenueTrendComponent } from "../revenue-trend/revenue-trend.component";
import { CampaignService } from '../../services/campaign.service';
import { TabletService } from '../../services/tablet.service';
import { TabletMonitorService } from '../../services/tablet-monitor.service';
import { AdvertiserService } from '../../services/advertiser.service';
import { forkJoin, of, catchError } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MetricsCardComponent, CampaignStatusComponent, VehicleDistributionComponent, CommonModule, FormsModule, CardsComponent, CampaignsComponent, ActiveCampaignsComponent, RevenueTrendComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponentAdvertiser implements AfterViewInit, OnDestroy {
 analyticsData: any = {};
  isLoading = true;
  error: string | null = null;
  private impressionsChart: Chart | null = null;
  selectedTimeRange = 'Last 12 Months';

  isSidebarCollapsed = false;
  constructor(
    private analyticsService: AnalyticsService,
    private campaignService: CampaignService,
    private tabletService: TabletService,
    private tabletMonitorService: TabletMonitorService,
    private advertiserService: AdvertiserService
  ) {}
ngOnInit() {
    this.loadAnalyticsData();
    this.loadSupportData();
  }

  loadAnalyticsData() {
    this.analyticsService.getAnalytics().subscribe({
      next: (data) => {
        // Preserve activeDrivers if it was already set by tablet monitor
        const currentActiveDrivers = this.analyticsData?.activeDrivers;
        this.analyticsData = data.analytics;
        if (currentActiveDrivers !== undefined) {
          this.analyticsData.activeDrivers = currentActiveDrivers;
        }
        this.isLoading = false;
        setTimeout(() => this.initCharts(), 100);
      },
      error: (err) => {
        this.error = 'Failed to load analytics data';
        this.isLoading = false;
        console.error('Analytics error:', err);
        setTimeout(() => this.initCharts(), 100);
      }
    });
  }

  totalAdvertisers: number | null = null;
  activeTabletsCount: number | null = null;
  activeCampaignsRows: Array<{ campaign: string; advertiser?: string; impressions?: number; clicks?: number; ctr?: string; spend?: string; id?: number; }> = [];
  topTablets: Array<{ deviceId: string; alias?: string; impressions: number; orderIndex: number }> = [];

  private loadSupportData() {
    // Active campaigns list (name + price used as spend approx)
    this.campaignService.getActiveCampaigns().subscribe({
      next: (resp) => {
        const active = resp?.data || [];
        this.activeCampaignsRows = active.map(c => ({
          campaign: c.name,
          impressions: c.accumulatedImpressions,
          ctr: undefined,
          spend: c.price ? ('R' + c.price) : undefined,
          id: c.id
        }));
      },
      error: () => {}
    });

    // Tablet active count via monitor (online=true) and active drivers count
    this.tabletMonitorService.getMonitor().subscribe({
      next: (resp) => {
        const rows = resp?.data || [];
        this.activeTabletsCount = rows.filter(r => r.online).length;
        
        // Active drivers count (same logic as driver pager)
        const assignedDriverIds = rows.filter(r => r.driverId != null).map(r => Number(r.driverId));
        this.analyticsData.activeDrivers = assignedDriverIds.length;
        console.log('Dashboard - Active drivers calculated:', this.analyticsData.activeDrivers, 'from', assignedDriverIds);
        
        // Trigger change detection to update the UI
        setTimeout(() => this.initCharts(), 100);
        const hasRowImpressions = rows.some(r => (r as any).impressions != null);
        const indexMap = new Map<string, number>();
        rows.forEach((r, idx) => { if (r.deviceId) indexMap.set(r.deviceId, idx); });
        if (hasRowImpressions) {
          const list = rows.map(r => ({
            deviceId: r.deviceId || 'TAB-UNK',
            alias: r.alias || r.deviceId || 'TAB-UNK',
            impressions: Number((r as any).impressions || 0),
            orderIndex: indexMap.get(r.deviceId || '') ?? 0
          }));
          this.topTablets = list.sort((a, b) => b.impressions - a.impressions).slice(0, 4);
        } else {
          const deviceIds = rows.map(r => r.deviceId).filter((d): d is string => !!d);
          if (deviceIds.length > 0) {
            const calls = deviceIds.map(id => this.tabletMonitorService.getImpressions(id).pipe(
              catchError(() => of(0))
            ));
            forkJoin(calls).subscribe({
              next: (counts) => {
                const list = deviceIds.map((id, idx) => {
                  const row = rows.find(r => r.deviceId === id);
                  return { deviceId: id, alias: row?.alias || id, impressions: Number(counts[idx] || 0), orderIndex: indexMap.get(id) ?? idx };
                });
                this.topTablets = list.sort((a, b) => b.impressions - a.impressions).slice(0, 4);
              },
              error: () => { this.topTablets = []; }
            });
          } else {
            this.topTablets = [];
          }
        }
      },
      error: () => {}
    });

    // Advertisers count
    this.advertiserService.getAllAdvertisers().subscribe({
      next: (resp) => {
        this.totalAdvertisers = (resp?.data || []).length;
      },
      error: () => {}
    });

  }
// Add to dashboard.component.ts
private initCharts() {
  this.createImpressionsChart();
  this.createCampaignPerformanceChart();
}

private createImpressionsChart() {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const ctx = document.getElementById('impressionsChart') as HTMLCanvasElement;
  
  if (!ctx) {
    console.error('Canvas element with id "impressionsChart" not found');
    return;
  }

  // Destroy existing chart if it exists
  if (this.impressionsChart) {
    this.impressionsChart.destroy();
    this.impressionsChart = null;
  }

  // Generate data based on selected time range
  const { labels, data } = this.generateChartData();


  try {
    this.impressionsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
          label: 'Impressions',
        data: data,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            callback: function(value) {
                return value.toLocaleString();
            },
            color: isDarkMode ? '#9CA3AF' : '#6B7280'
          }
        },
        x: {
          grid: {
            display: false,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: isDarkMode ? '#9CA3AF' : '#6B7280'
          }
        }
      }
    }
  });
    console.log('Impressions chart created successfully');
  } catch (error) {
    console.error('Error creating impressions chart:', error);
  }
}


  private generateRealMonthLabels(months: number): string[] {
    const labels: string[] = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      labels.push(`${monthName} ${year}`);
    }
    
    return labels;
  }

  private generateRealMonthlyData(totalImpressions: number, months: number): number[] {
    // Distribute total impressions across months with realistic weights
    // More recent months get higher weights
    const weights = [];
    for (let i = 0; i < months; i++) {
      // Current month gets highest weight, older months get less
      const weight = (months - i) / (months * (months + 1) / 2);
      weights.push(weight);
    }
    
    return weights.map(weight => Math.round(totalImpressions * weight));
  }

private createCampaignPerformanceChart() {
  const campaignCtx = document.getElementById('campaignPerformanceChart') as HTMLCanvasElement;
  
  if (!campaignCtx || !this.analyticsData) return;

  new Chart(campaignCtx, {
    type: 'bar',
    data: {
      labels: ['Active', 'Inactive', 'Saved'],
      datasets: [{
        label: 'Campaigns',
        data: [
          this.analyticsData.activeCampaigns,
          this.analyticsData.inactiveCampaigns,
          this.analyticsData.totalSavedCampaigns
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(107, 114, 128, 0.7)',
          'rgba(16, 185, 129, 0.7)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(107, 114, 128)',
          'rgb(16, 185, 129)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}
formatCurrency(amount: number): string {
    return 'R' + (amount?.toFixed(2) || '0.00');
  }

  // Format numbers with commas
  formatNumber(num: number): string {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
  }

  // Calculate percentage
  calculatePercentage(part: number, total: number): number {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  }

  // Get total partners (drivers + advertisers)
  getTotalPartners(): number {
    return (this.analyticsData?.activeDrivers || 0) + (this.analyticsData?.advertisers || 0);
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngAfterViewInit() {
    // Remove duplicate chart inits; charts are initialized in initCharts() after data load
  }

  ngOnDestroy() {
    // Clean up chart instances
    if (this.impressionsChart) {
      this.impressionsChart.destroy();
      this.impressionsChart = null;
    }
  }

  onTimeRangeChange() {
    this.createImpressionsChart();
  }

  generateChartData() {
    let labels: string[];
    let data: number[];

    // If no analytics data is available, return empty data
    if (!this.analyticsData) {
      return { labels: [], data: [] };
    }

    switch (this.selectedTimeRange) {
      case 'Last 30 Days':
        // Use real daily impressions data from backend
        if (this.analyticsData.dailyImpressions && Array.isArray(this.analyticsData.dailyImpressions)) {
          labels = this.analyticsData.dailyImpressions.map((day: any) => day.date);
          data = this.analyticsData.dailyImpressions.map((day: any) => day.impressions);
        } else {
          // Fallback: generate labels and show zeros
          labels = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          });
          data = new Array(30).fill(0);
        }
        break;
      
      case 'Last 6 Months':
        // Use real monthly impressions data from backend
        if (this.analyticsData.monthlyImpressions && Array.isArray(this.analyticsData.monthlyImpressions)) {
          const monthlyData = this.analyticsData.monthlyImpressions.slice(-6); // Last 6 months
          labels = monthlyData.map((month: any) => month.date);
          data = monthlyData.map((month: any) => month.impressions);
        } else {
          labels = this.generateRealMonthLabels(6);
          data = new Array(6).fill(0);
        }
        break;
      
      case 'Last 12 Months':
      default:
        // Use real monthly impressions data from backend
        if (this.analyticsData.monthlyImpressions && Array.isArray(this.analyticsData.monthlyImpressions)) {
          labels = this.analyticsData.monthlyImpressions.map((month: any) => month.date);
          data = this.analyticsData.monthlyImpressions.map((month: any) => month.impressions);
        } else {
          labels = this.generateRealMonthLabels(12);
          data = new Array(12).fill(0);
        }
        break;
    }

    return { labels, data };
  }





  private campaignsChart() {
    const campaignCtx = document.getElementById('campaignChart') as HTMLCanvasElement | null;
    if (!campaignCtx) return;
    new Chart(campaignCtx, {
      type: 'line',
      data: {
        labels: this.activeCampaignsRows?.map(c => c.campaign).slice(0, 5) || ['No Data'],
        datasets: [{
          label: 'Performance',
          data: this.activeCampaignsRows?.map(c => c.impressions || 0).slice(0, 5) || [0],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { display: false },
          x: { display: false }
        }
      }
    });

  }
  private tabletChart() {
    const tabletCtx = document.getElementById('tabletChart') as HTMLCanvasElement | null;
    if (!tabletCtx) return;
    new Chart(tabletCtx, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Inactive', 'Maintenance'],
        datasets: [{
          data: [this.activeTabletsCount || 0, 0, 0], // Use real tablet data
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
    private impressionsChartLegacy() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const ctx = document.getElementById('impressionsChart') as HTMLCanvasElement | null;
    if (!ctx) return;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.generateRealMonthLabels(12),
        datasets: [{
          label: 'Impressions',
          data: this.analyticsData?.totalImpressions ? this.generateRealMonthlyData(this.analyticsData.totalImpressions, 12) : new Array(12).fill(0),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
               color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              lineWidth: 1,

            },
            ticks: {
              callback: function(value) {
                return value.toLocaleString() + ' impressions';
              },
              color: isDarkMode ? '#9CA3AF' : '#6B7280'
            }
          },
          x: {
            grid: {
              display: false,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              display: false ,
                color: isDarkMode ? '#9CA3AF' : '#6B7280'
            }
          }
        }
      }
    });
  }
}