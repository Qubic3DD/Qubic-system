// campaign-status.component.ts
import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-campaign-status',
  templateUrl: './campaign-status.component.html',
  styleUrls: ['./campaign-status.component.css']
})
export class CampaignStatusComponent implements AfterViewInit, OnChanges {
  @Input() activeCampaigns: number = 0;
  @Input() inactiveCampaigns: number = 0;
  @Input() totalCampaigns: number = 0;
  
  @ViewChild('campaignChart', { static: false }) campaignChartRef!: ElementRef<HTMLCanvasElement>;
  private campaignChart: Chart | null = null;

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.campaignChart && (changes['activeCampaigns'] || changes['inactiveCampaigns'])) {
      this.updateChart();
    }
  }

  private createChart() {
    if (!this.campaignChartRef) return;

    const ctx = this.campaignChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.campaignChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{
          data: [this.activeCampaigns, this.inactiveCampaigns],
          backgroundColor: ['#ec4899', '#9ca3af'], // pink-500 and gray-400
          borderWidth: 0,
          cutout: '70%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  private updateChart() {
    if (!this.campaignChart) return;

    this.campaignChart.data.datasets[0].data = [this.activeCampaigns, this.inactiveCampaigns];
    this.campaignChart.update();
  }

  get activePercentage(): number {
    return this.totalCampaigns > 0 ? Math.round((this.activeCampaigns / this.totalCampaigns) * 100) : 0;
  }

  get inactivePercentage(): number {
    return this.totalCampaigns > 0 ? Math.round((this.inactiveCampaigns / this.totalCampaigns) * 100) : 0;
  }
}