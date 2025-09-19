import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent implements OnInit {
  isLoading = true;
  error: string | null = null;

  // Summary KPIs
  totalRevenueApprox: number = 0;
  totalCampaigns: number = 0;
  totalImpressions: number = 0;

  // Invoices/Payouts demo lists (placeholder for now)
  invoices: Array<{ id: string; date: string; amount: number; status: 'Paid'|'Unpaid'|'Overdue' } > = [];
  payouts: Array<{ id: string; date: string; amount: number; recipient: string; status: 'Sent'|'Pending' } > = [];

  constructor(private analytics: AnalyticsService, private campaigns: CampaignService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    // Fetch analytics summary
    this.analytics.getAnalytics().subscribe({
      next: (data) => {
        const a = data?.analytics || {};
        this.totalCampaigns = a.totalCampaigns || 0;
        this.totalImpressions = a.totalImpressions || 0;
      },
      error: (err) => { this.error = 'Failed to load analytics'; console.error(err); },
    });
    // Approximate revenue: sum of active campaign prices
    this.campaigns.getActiveCampaigns().subscribe({
      next: (resp) => {
        const list = resp?.data || [];
        this.totalRevenueApprox = list.reduce((sum: number, c: any) => sum + (Number(c.price || 0)), 0);
        // Generate simple invoice/payout placeholders from campaigns
        this.invoices = list.slice(0, 5).map((c: any, i: number) => ({
          id: 'INV-' + String(1000 + i),
          date: new Date().toISOString(),
          amount: Number(c.price || 0),
          status: i % 3 === 0 ? 'Overdue' : (i % 2 === 0 ? 'Unpaid' : 'Paid')
        }));
        this.payouts = list.slice(0, 5).map((c: any, i: number) => ({
          id: 'PO-' + String(2000 + i),
          date: new Date().toISOString(),
          amount: Math.round(Number(c.price || 0) * 0.3),
          recipient: 'Driver/Owner #' + (i + 1),
          status: i % 2 === 0 ? 'Pending' : 'Sent'
        }));
        this.isLoading = false;
      },
      error: (err) => { this.error = 'Failed to load campaigns'; this.isLoading = false; console.error(err); }
    });
  }
}


