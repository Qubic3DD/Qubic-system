import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface DailyPoint { date: string; impressions: number; scans: number; }
interface DeviceCount { deviceId: string; count: number; percent: number; }

@Component({
  selector: 'app-campaign-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './campaign-analytics.component.html',
  styleUrls: ['./campaign-analytics.component.css']
})
export class CampaignAnalyticsComponent {
  private route = inject(ActivatedRoute);

  id = 0;
  loading = true;
  error = '';
  days = 14;
  pendingDays = 14;

  name = '';
  startDate = '';
  endDate = '';
  price?: number;
  requiredImpressions?: number;
  ctaUrl?: string;

  impressions = 0;
  scans = 0;
  ctr = 0;
  cpm?: number; // effective CPM from backend (based on impressions gained)
  cps?: number; // effective CPS (2% of effective CPM)
  baseCpm?: number; // Budget / RequiredImpressions * 1000
  baseCps?: number; // 2% of baseCpm
  expectedScans?: number; // 2% of required impressions
  effectiveStr?: number; // scans/impressions * 100 (alias of ctr)

  daily: DailyPoint[] = [];
  osCounts: Record<string, number> = {};
  impressionsBySlot: Record<string, number> = {};
  scansBySlot: Record<string, number> = {};
  scansByLocation: Record<string, number> = {};
  topTablets: DeviceCount[] = [];
  heatmap: number[][] = [];

  private charts: Record<string, any> = {};

  async ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    // Print handling to ensure charts size to card height in PDF
    window.addEventListener('beforeprint', this.handleBeforePrint);
    window.addEventListener('afterprint', this.handleAfterPrint);
    try {
      const res = await fetch(`/api/campaigns/${this.id}/analytics?days=${this.days}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      this.name = data.name;
      this.startDate = data.startDate;
      this.endDate = data.endDate;
      this.price = data.price;
      this.requiredImpressions = data.requiredImpressions;
      this.ctaUrl = data.ctaUrl;
      this.impressions = data.impressions;
      this.scans = data.scans;
      this.ctr = data.ctr;
      this.cpm = data.cpm;
      this.cps = data.cps;
      this.daily = data.daily || [];
      this.osCounts = data.osCounts || {};
      this.impressionsBySlot = data.impressionsBySlot || {};
      this.scansBySlot = data.scansBySlot || {};
      this.topTablets = data.topTablets || [];
      this.scansByLocation = data.scansByLocation || {};
      this.heatmap = data.heatmap || [];
      this.loading = false;
      // Compute base CPM/CPS on client: base CPM = Budget / RequiredImpressions * 1000; base CPS = 2% of base CPM
      if (typeof this.price === 'number' && typeof this.requiredImpressions === 'number' && this.requiredImpressions > 0) {
        this.baseCpm = (this.price / this.requiredImpressions) * 1000;
        this.baseCps = this.baseCpm * 0.02;
        this.expectedScans = Math.floor(this.requiredImpressions * 0.02);
      } else {
        this.baseCpm = undefined;
        this.baseCps = undefined;
        this.expectedScans = undefined;
      }
      this.effectiveStr = this.ctr;
      setTimeout(() => this.renderCharts(), 0);
    } catch (e: any) {
      this.error = e?.message || 'Failed to load analytics';
      this.loading = false;
    }
  }
  onPendingDaysInput(event: Event) {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val)) {
      this.pendingDays = val;
    }
  }

  applyDays() {
    const v = this.pendingDays;
    if (Number.isFinite(v) && v > 0 && v <= 365 && v !== this.days) {
      this.days = v;
      this.reloadAnalytics();
    }
  }

  private async reloadAnalytics() {
    try {
      const res = await fetch(`/api/campaigns/${this.id}/analytics?days=${this.days}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      this.impressions = data.impressions;
      this.scans = data.scans;
      this.ctr = data.ctr;
      this.daily = data.daily || [];
      this.renderCharts();
    } catch (e: any) {
      this.error = e?.message || 'Failed to reload analytics';
    }
  }

  private async whenChartReady(maxMs = 2000): Promise<boolean> {
    const start = performance.now();
    while (!(window as any).Chart && performance.now() - start < maxMs) {
      await new Promise(r => setTimeout(r, 50));
    }
    return !!(window as any).Chart;
  }

  private destroyCharts(): void {
    Object.keys(this.charts).forEach(id => {
      try { this.charts[id]?.destroy?.(); } catch {}
      delete this.charts[id];
    });
  }

  ngOnDestroy() {
    this.destroyCharts();
    window.removeEventListener('beforeprint', this.handleBeforePrint);
    window.removeEventListener('afterprint', this.handleAfterPrint);
  }

  private async createIfReady(id: string, config: any, tries = 10): Promise<void> {
    for (let i = 0; i < tries; i++) {
      const el = document.getElementById(id) as HTMLCanvasElement | null;
      const ready = !!el && typeof el.getContext === 'function' && el.offsetParent !== null && el.clientWidth >= 0;
      if (ready && el) {
        try { this.charts[id]?.destroy?.(); } catch {}
        // @ts-ignore
        const ChartCtor = (window as any).Chart;
        this.charts[id] = new ChartCtor(el.getContext('2d'), config);
        return;
      }
      await new Promise(r => setTimeout(r, 50));
    }
  }

  async renderCharts() {
    if (!(await this.whenChartReady())) return;

    const labels = this.daily.map(d => d.date);
    const imp = this.daily.map(d => d.impressions);
    const scans = this.daily.map(d => d.scans);

    await this.createIfReady('trendChart', {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { type: 'line', label: 'Impressions', data: imp, borderColor: '#8D29FF', backgroundColor: 'rgba(141,41,255,.2)', tension: .3 },
            { type: 'bar', label: 'Scans', data: scans, backgroundColor: '#005AED' },
          ]
        },
        options: { 
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { 
              position: 'bottom',
              labels: { color: '#f9fafb' }
            } 
          }, 
          scales: { 
            x: { 
              grid: { display: false },
              ticks: { color: '#d1d5db' }
            }, 
            y: { 
              beginAtZero: true,
              ticks: { color: '#d1d5db' },
              grid: { color: '#374151' }
            } 
          } 
        }
      });

    const osLabels = Object.keys(this.osCounts);
    const osVals = Object.values(this.osCounts);
    await this.createIfReady('osDonut', {
        type: 'doughnut',
        data: { labels: osLabels, datasets: [{ data: osVals, backgroundColor: ['#005AED','#8D29FF','#E300FF','#10B981','#EAB308','#94A3B8'] }] },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          radius: '90%',
          cutout: '60%',
          layout: { padding: 10 },
          plugins: {
            legend: { 
              position: 'right',
              align: 'start',
              labels: { 
                padding: 8, 
                boxWidth: 12, 
                boxHeight: 12, 
                font: { size: 11 },
                usePointStyle: true
              } 
            }
          }
        }
      });

    // Scans by Location (top N) vertical bars
    const locLabels = Object.keys(this.scansByLocation).slice(0, 8);
    const locVals = locLabels.map(k => this.scansByLocation[k]);
    await this.createIfReady('scanLocationBars', {
        type: 'bar',
        data: { labels: locLabels, datasets: [{ label: 'Scans', data: locVals, backgroundColor: '#10B981' }] },
        options: { 
          responsive: false, 
          maintainAspectRatio: false, 
          plugins: { 
            legend: { display: false } 
          }, 
          scales: { 
            x: {
              ticks: { color: '#d1d5db' },
              grid: { color: '#374151' }
            },
            y: { 
              beginAtZero: true,
              ticks: { color: '#d1d5db' },
              grid: { color: '#374151' }
            } 
          } 
        }
      });

    // Vertical bars for slots
    const slotLabels = Object.keys(this.impressionsBySlot);
    const slotVals = Object.values(this.impressionsBySlot);
    const scanSlotVals = Object.values(this.scansBySlot);
    await this.createIfReady('impSlotBarsV', {
        type: 'bar',
        data: { labels: slotLabels, datasets: [{ label: 'Impressions', data: slotVals, backgroundColor: '#8D29FF' }] },
        options: { 
          plugins: { legend: { display: false } }, 
          scales: { 
            x: {
              ticks: { color: '#d1d5db' },
              grid: { color: '#374151' }
            },
            y: { 
              beginAtZero: true,
              ticks: { color: '#d1d5db' },
              grid: { color: '#374151' }
            } 
          } 
        }
      });

    await this.createIfReady('scanSlotBarsV', {
        type: 'bar',
        data: { labels: slotLabels, datasets: [{ label: 'Scans', data: scanSlotVals, backgroundColor: '#005AED' }] },
        options: { 
          plugins: { legend: { display: false } }, 
          scales: { 
            x: {
              ticks: { color: '#d1d5db' },
              grid: { color: '#374151' }
            },
            y: { 
              beginAtZero: true,
              ticks: { color: '#d1d5db' },
              grid: { color: '#374151' }
            } 
          } 
        }
      });

    // Heatmap: draw enhanced canvas with proper heatmap colors and correct axis labels
    const canvas = document.getElementById('heatmap') as HTMLCanvasElement;
    if (canvas) {
      const rows = this.heatmap.length, cols = rows ? this.heatmap[0].length : 0;
      if (rows === 0 || cols === 0) return;
      
      // Calculate dimensions to fill the card width
      const containerWidth = canvas.parentElement?.clientWidth || 800;
      const padding = 80; // Space for axis labels
      const availableWidth = containerWidth - padding;
      const availableHeight = 200; // Fixed height for heatmap
      
      const cellWidth = Math.floor(availableWidth / cols);
      const cellHeight = Math.floor(availableHeight / rows);
      const cellSize = Math.min(cellWidth, cellHeight, 30); // Max 30px per cell
      
      canvas.width = cols * cellSize + padding;
      canvas.height = rows * cellSize + padding;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set background
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Find max value for color scaling
      let max = 0;
      for (const r of this.heatmap) {
        for (const v of r) {
          max = Math.max(max, v);
        }
      }
      
      // Draw heatmap cells with proper heatmap colors - show all blocks including zeros
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = this.heatmap[r][c];
          const t = max ? v / max : 0;
          
          // Proper heatmap color scheme: dark blue (zero) -> blue (low) -> green -> yellow -> red (high)
          let color;
          if (t === 0) {
            color = '#1e3a8a'; // Dark blue for zero values (cold but visible)
          } else if (t < 0.25) {
            // Dark blue to light blue
            const intensity = t / 0.25;
            color = `rgb(${Math.floor(30 + intensity * 30)}, ${Math.floor(60 + intensity * 100)}, ${Math.floor(120 + intensity * 100)})`;
          } else if (t < 0.5) {
            // Light blue to green
            const intensity = (t - 0.25) / 0.25;
            color = `rgb(${Math.floor(60 + intensity * 100)}, ${Math.floor(160 + intensity * 60)}, ${Math.floor(220 - intensity * 100)})`;
          } else if (t < 0.75) {
            // Green to yellow
            const intensity = (t - 0.5) / 0.25;
            color = `rgb(${Math.floor(160 + intensity * 80)}, ${Math.floor(220 - intensity * 20)}, ${Math.floor(120 - intensity * 120)})`;
          } else {
            // Yellow to red
            const intensity = (t - 0.75) / 0.25;
            color = `rgb(${Math.floor(240 + intensity * 15)}, ${Math.floor(200 - intensity * 200)}, ${Math.floor(0 + intensity * 0)})`;
          }
          
          ctx.fillStyle = color;
          ctx.fillRect(
            c * cellSize + 60, // X offset for Y-axis labels
            r * cellSize + 20, // Y offset for X-axis labels
            cellSize - 1,
            cellSize - 1
          );
        }
      }
      
      // Draw color legend on the right side
      const legendWidth = 60;
      const legendHeight = 120;
      const legendX =  710; // Moved 2x further right (10 -> 20)
      const legendY = 20;
      
      // Color gradient bar (vertical) - no background box, longer
      const barWidth = 8;
      const barHeight = 185; // Made 1.5x longer (150 * 1.5 = 225)
      const barX = legendX + (legendWidth - barWidth) / 2;
      const barY = legendY + 5; // Adjusted position for longer bar
      
      // Create vertical gradient
      const gradient = ctx.createLinearGradient(0, barY, 0, barY + barHeight);
      gradient.addColorStop(0, '#dc2626'); // Red (high)
      gradient.addColorStop(0.25, '#f59e0b'); // Yellow
      gradient.addColorStop(0.5, '#10b981'); // Green
      gradient.addColorStop(0.75, '#3b82f6'); // Blue
      gradient.addColorStop(1, '#1e3a8a'); // Dark blue (zero/low)
      
      ctx.fillStyle = gradient;
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // High and Low labels only
      ctx.fillStyle = '#d1d5db';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('High', legendX + legendWidth/2, barY - 5);
      ctx.fillText('Low', legendX + legendWidth/2, barY + barHeight + 15);
      
      // Draw axis labels - Y-axis is 7 days, X-axis is 24 hours
      ctx.fillStyle = '#d1d5db';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      
      // Y-axis labels (Days: Sun-Sat)
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let r = 0; r < rows; r++) {
        const dayName = dayNames[r] || `D${r+1}`;
        ctx.fillText(
          dayName,
          30,
          r * cellSize + cellSize/2 + 25
        );
      }
      
      // X-axis labels (Hours: 0-23)
      for (let c = 0; c < cols; c++) {
        const hour = c;
        ctx.fillText(
          hour.toString().padStart(2, '0'),
          c * cellSize + cellSize/2 + 60,
          rows * cellSize + 45
        );
      }
      
      // Add axis titles
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      
      // Y-axis title (rotated) - Days
      ctx.save();
      ctx.translate(20, rows * cellSize / 2 + 20);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Day of Week', 0, 0);
      ctx.restore();
      
      // X-axis title - Hours
      ctx.fillText('Hour of Day', cols * cellSize / 2 + 60, rows * cellSize + 65);
    }
  }

  private handleBeforePrint = () => {
    // Force trend chart canvas to fill its fixed-height wrapper during print
    const wrapper = document.querySelector('.chart-fixed-h') as HTMLElement | null;
    const canvas = document.getElementById('trendChart') as HTMLCanvasElement | null;
    if (wrapper && canvas) {
      const h = wrapper.clientHeight;
      if (h > 0) {
        canvas.style.height = `${h}px`;
        canvas.style.width = '100%';
        try { this.charts['trendChart']?.resize?.(); } catch {}
      }
    }
  };

  private handleAfterPrint = () => {
    const canvas = document.getElementById('trendChart') as HTMLCanvasElement | null;
    if (canvas) {
      canvas.style.height = '';
      canvas.style.width = '';
      try { this.charts['trendChart']?.resize?.(); } catch {}
    }
  };

  print() { window.print(); }
}
