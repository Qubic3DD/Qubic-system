// vehicle-distribution.component.ts
import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-vehicle-distribution',
  templateUrl: './vehicle-distribution.component.html',
  styleUrls: ['./vehicle-distribution.component.css']
})
export class VehicleDistributionComponent implements AfterViewInit {
  @Input() distribution: any;
  @ViewChild('chart') chartRef!: ElementRef;
  chart: any;

  ngAfterViewInit() {
    if (this.distribution) {
      this.createChart();
    }
  }

  createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    const labels = Object.keys(this.distribution);
    const data = Object.values(this.distribution);

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#3B82F6', // blue
            '#10B981', // green
            '#F59E0B', // yellow
            '#EF4444', // red
            '#8B5CF6'  // purple
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '80%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                family: 'Inter'
              }
            }
          }
        }
      }
    });
  }
}