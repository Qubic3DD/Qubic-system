
import { Component, AfterViewInit, Input } from '@angular/core';
import Chart from 'chart.js/auto';
import { AnalyticsService } from '../../services/analytics.service';
import {MetricsCardComponent} from '../../components/dashboard/metrics-card/metrics-card.component'
import {CampaignStatusComponent} from '../../components/dashboard/campaign-status/campaign-status.component'
import {VehicleDistributionComponent} from'../../components/dashboard/vehicle-distribution/vehicle-distribution.component'
import { CommonModule } from '@angular/common';
import { CardsComponent } from "../cards/cards.component";
import { CampaignsComponent } from "../campaigns/campaigns.component";
import { ActiveCampaignsComponent } from "../active-campaigns/active-campaigns.component";
import { RevenueTrendComponent } from "../revenue-trend/revenue-trend.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MetricsCardComponent, CampaignStatusComponent, VehicleDistributionComponent, CommonModule, CardsComponent, CampaignsComponent, ActiveCampaignsComponent, RevenueTrendComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
 analyticsData: any;
  isLoading = true;
  error: string | null = null;

  isSidebarCollapsed = false;
 constructor(private analyticsService: AnalyticsService) {}
ngOnInit() {
    this.loadAnalyticsData();
  }

 loadAnalyticsData() {
    this.analyticsService.getAnalytics().subscribe({
      next: (data) => {
        this.analyticsData = data.analytics;
        this.isLoading = false;
        setTimeout(() => this.initCharts(), 0); // Wait for view to update
      },
      error: (err) => {
        this.error = 'Failed to load analytics data';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
// Add to dashboard.component.ts
private initCharts() {
  this.createRevenueChart();
  this.createCampaignPerformanceChart();
}

private createRevenueChart() {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
  
  if (!ctx) return;

  // Sample data - in a real app you would use actual revenue data from analyticsData
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [65, 59, 80, 81, 56, 55, 40, 72, 68, 85, 90, 95];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue',
        data: data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
              return 'R' + value + 'k';
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
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngAfterViewInit() {
  this.revenueChart()
  this.campaignsChart()
  this.tabletChart()
    
  }

    activeCampaigns = [
    { campaign: 'Summer Sale Promotion', advertiser: 'Metro Retail', impressions: 25420, clicks: 1240, ctr: '4.8%', spend: 'R3,200' },
    { campaign: 'New Restaurant Launch', advertiser: 'Fusion Foods', impressions: 18650, clicks: 982, ctr: '5.2%', spend: 'R2,400' },
    { campaign: 'Mobile App Download', advertiser: 'TechStart Inc', impressions: 31250, clicks: 2150, ctr: '6.8%', spend: 'R4,100' },
    { campaign: 'Holiday Special Offers', advertiser: 'City Mall', impressions: 28100, clicks: 1520, ctr: '5.4%', spend: 'R3,600' },
  ]

   recentAlerts = [
    { icon: '⚠️', message: 'Tablet TD-358 has low battery (15%)', time: '10 minutes ago' },
    { icon: '❗', message: 'Driver John Smith reported technical issue with tablet', time: '35 minutes ago' },
    { icon: '✅', message: 'Campaign "Summer Sale Promotion" exceeded target impressions', time: '2 hours ago' },
    { icon: '⚠️', message: '3 tablets went offline in the last hour', time: '1 hour ago' },
    { icon: '📊', message: 'System maintenance scheduled for tonight at 2 AM', time: '4 hours ago' },
  ];



  private campaignsChart() {
    const campaignCtx = document.getElementById('campaignChart') as HTMLCanvasElement;
    new Chart(campaignCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Performance',
          data: [65, 59, 80, 81, 56],
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
   const tabletCtx = document.getElementById('tabletChart') as HTMLCanvasElement;
    new Chart(tabletCtx, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Inactive', 'Maintenance'],
        datasets: [{
          data: [75, 15, 10],
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
    private revenueChart() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Revenue',
          data: [65, 59, 80, 81, 56, 55, 40, 72, 68, 85, 90, 95],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
                return 'R' + value + 'k';
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