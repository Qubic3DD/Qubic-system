import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabletMonitorService, TabletMonitorRow } from '../../services/tablet-monitor.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-campaigns',
  imports: [CommonModule],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.css'
})
export class CampaignsComponent implements OnInit, OnDestroy, AfterViewInit {
  tabletData: TabletMonitorRow[] = [];
  isLoading = false;
  error: string | null = null;
  private refreshTimer: any = null;
  private tabletChart: Chart | null = null;

  // Status counts
  activeCount = 0;
  inactiveCount = 0;
  maintenanceCount = 0;

  constructor(private tabletMonitorService: TabletMonitorService) {}

  ngOnInit(): void {
    this.loadTabletData();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    if (this.tabletChart) {
      this.tabletChart.destroy();
    }
  }

  ngAfterViewInit(): void {
    // Chart will be created after data loads
  }

  loadTabletData(): void {
    this.isLoading = true;
    this.error = null;

    this.tabletMonitorService.getMonitor().subscribe({
      next: (response) => {
        this.tabletData = response?.data || [];
        this.updateStatusCounts();
        this.isLoading = false;
        setTimeout(() => this.createTabletChart(), 100); // Small delay to ensure canvas is ready
      },
      error: (error) => {
        this.error = 'Failed to load tablet data';
        this.isLoading = false;
        console.error('Error loading tablet data:', error);
      }
    });
  }

  private updateStatusCounts(): void {
    this.activeCount = this.tabletData.filter(tablet => tablet.online === true).length;
    this.inactiveCount = this.tabletData.filter(tablet => tablet.online === false).length;
    // For now, we'll consider offline tablets as maintenance
    // In a real system, you might have a separate maintenance status
    this.maintenanceCount = this.inactiveCount;
  }

  private createTabletChart(): void {
    const canvas = document.getElementById('tabletChart') as HTMLCanvasElement;
    if (!canvas) return;

    // Destroy existing chart if it exists
    if (this.tabletChart) {
      this.tabletChart.destroy();
    }

    const isDarkMode = document.documentElement.classList.contains('dark');
    
    this.tabletChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Inactive', 'Maintenance'],
        datasets: [{
          data: [this.activeCount, this.inactiveCount, this.maintenanceCount],
          backgroundColor: [
            '#10b981', // Green for Active
            '#f59e0b', // Yellow for Inactive  
            '#ef4444'  // Red for Maintenance
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false // We're using custom legend in HTML
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        }
      }
    });
  }

  private startAutoRefresh(): void {
    // Refresh every 30 seconds
    this.refreshTimer = setInterval(() => {
      this.loadTabletData();
    }, 30000);
  }

  refreshData(): void {
    this.loadTabletData();
  }
}
