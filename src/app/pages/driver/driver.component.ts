import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DriverProfile } from '../../api/Response/interfaces';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { TabletMonitorService, TabletMonitorRow } from '../../services/tablet-monitor.service';
import { AssignmentEventsService } from '../../services/assignment-events.service';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css'],
})
export class DriverComponent implements OnInit {
  drivers: any[] = [];
  filteredDrivers: any[] = [];
  searchQuery = '';
  showAddDriverModal = false;
  isLoading = false;
  assignedDriverIds: Set<number> = new Set<number>();
  assignedCount = 0;
  unassignedCount = 0;
  pausedCount = 0;
  totalRideCount = 0;
  // Ride counts keyed by driverId
  rideCounts: { [driverId: number]: number } = {};
  // Assign tablet modal state
  showAssignTabletModal = false;
  assignTargetDriver: any | null = null;
  unassignedDevices: TabletMonitorRow[] = [];
  selectedDeviceId: string | null = null;

  filters = [
    { id: 'all', label: 'All Drivers', active: true },
    { id: 'active', label: 'Active', active: false },
    { id: 'inactive', label: 'Inactive', active: false },
  ];

  newDriver: any = {
    email: '',
    phoneNo: '',
    firstName: '',
    lastName: '',
    password: '',
    roles: ['DRIVER'],
    status: 'Active',
    fleetName: '',
    servicesOffered: [] as string[],
  };

  selectedPlatforms: { uber: boolean; bolt: boolean; indriver: boolean; other: boolean } = {
    uber: false,
    bolt: false,
    indriver: false,
    other: false,
  };
  otherPlatform: string = '';

  constructor(private http: HttpClient, public router: Router, private tabletMonitorService: TabletMonitorService, private assignmentEvents: AssignmentEventsService) {}

  ngOnInit(): void {
    this.fetchDrivers();
    this.loadAssignments();
    
    // Refresh assignments every 10 seconds to catch automatic tablet logins
    setInterval(() => {
      this.loadAssignments();
    }, 10000);
    
    // Listen to cross-page assignment events to keep in sync
    this.assignmentEvents.events$.subscribe(evt => {
      if (evt.action === 'assign') {
        // Mark driver as Active (assigned)
        const d = this.drivers.find(x => x.id === evt.driverId);
        if (d) {
          d.status = 'Active';
        }
        this.loadAssignments();
      }
      if (evt.action === 'unassign') {
        this.loadAssignments();
      }
    });
  }

  fetchDriversd(): Observable<DriverProfile[]> {
  // PRODUCTION BACKEND (commented out for local testing)
  // return this.http.get<any>('https://backend.qubic3d.co.za/profile/drivers').pipe(
  
  // LOCAL BACKEND (for testing)
  return this.http.get<any>('http://localhost:8181/profile/drivers').pipe(
    map((response: { data: any; }) => response.data) // extract data here
  );
}

fetchDrivers(): void {
  this.isLoading = true;
  // PRODUCTION BACKEND (commented out for local testing)
  // this.http.get<any>('https://backend.qubic3d.co.za/profile/drivers').subscribe({
  
  // LOCAL BACKEND (for testing)
  this.http.get<any>('http://localhost:8181/profile/drivers').subscribe({
    next: (response) => {
      this.drivers = response.data;
      this.filteredDrivers = [...this.drivers];
      this.isLoading = false;
      this.updateCounts();
      this.loadRideCounts();
    },
    error: (error) => {
      console.error('Error fetching drivers:', error);
      this.isLoading = false;
    },
  });
}

refreshAll(): void {
  this.fetchDrivers();
  this.loadAssignments();
}

  private loadAssignments(): void {
    this.tabletMonitorService.getMonitor().subscribe({
      next: (res) => {
        const rows = (res?.data || []) as TabletMonitorRow[];
        const ids = rows.filter(r => r.driverId != null).map(r => Number(r.driverId));
        this.assignedDriverIds = new Set<number>(ids);
        this.syncDriverStatuses();
        this.updateCounts();
      },
      error: (err) => {
        console.error('Error loading tablet assignments:', err);
      }
    });
  }

  private updateCounts(): void {
    const total = this.drivers?.length || 0;
    const assigned = this.drivers.filter(d => this.assignedDriverIds.has(d.id)).length;
    const paused = this.drivers.filter(d => {
      const status = (d.status || '').toString().toLowerCase();
      return status === 'inactive' || status === 'paused';
    }).length;
    this.assignedCount = assigned;
    this.unassignedCount = Math.max(0, total - assigned);
    this.pausedCount = paused;
  }

  private syncDriverStatuses(): void {
    if (!Array.isArray(this.drivers)) return;
    this.drivers.forEach(d => {
      const current = (d.status || '').toString().toLowerCase();
      if (current === 'paused') {
        return; // preserve paused status - never auto-unpause
      }
      if (this.assignedDriverIds.has(d.id)) {
        d.status = 'Active';
      } else {
        d.status = 'Unassigned';
      }
    });
    // keep filtered list in sync when no search query
    if (!this.searchQuery) {
      this.filteredDrivers = [...this.drivers];
    }
  }

  private loadRideCounts(): void {
    try {
      const ids: number[] = Array.isArray(this.drivers) ? this.drivers.map(d => Number(d.id)).filter(id => !Number.isNaN(id)) : [];
      if (ids.length === 0) {
        this.rideCounts = {};
        this.totalRideCount = 0;
        return;
      }
      // PRODUCTION BACKEND (commented out for local testing)
      // this.http.post<any>('https://backend.qubic3d.co.za/api/rides/count/drivers', ids).subscribe({
      
      // LOCAL BACKEND (for testing)
      this.http.post<any>('http://localhost:8181/api/rides/count/drivers', ids).subscribe({
        next: (res) => {
          this.rideCounts = (res && res.data) ? res.data : {};
          const values = Object.values(this.rideCounts || {});
          this.totalRideCount = values.reduce((sum: number, v: any) => sum + (Number(v) || 0), 0);
        },
        error: (err) => {
          console.error('Error loading ride counts:', err);
          this.rideCounts = {};
          this.totalRideCount = 0;
        }
      });
    } catch (e) {
      console.error('Unexpected error loading ride counts:', e);
      this.rideCounts = {};
      this.totalRideCount = 0;
    }
  }

  getRideCountFor(driverId: number): number {
    const val = this.rideCounts?.[Number(driverId)];
    return typeof val === 'number' && Number.isFinite(val) ? val : 0;
  }

    viewDriverDetails(userName: string): void {
  this.router.navigate(['/drivers/details'], {
    queryParams: { username: userName },
  });
}
  
  getDocumentUrlByUsernameAndPurpose(
    username: string,
    purpose: string
  ): string {
    if (!username || !purpose) return '';
    const encodedUsername = encodeURIComponent(username);
    const encodedPurpose = encodeURIComponent(purpose);
    // PRODUCTION BACKEND (commented out for local testing)
    // return `https://backend.qubic3d.co.za/api/v1/files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
    
    // LOCAL BACKEND (for testing)
    return `http://localhost:8181/api/v1/files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
  }
    getInitials(name: string): string {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}
imageLoadFailed: { [email: string]: boolean } = {};

onImageError(email: string) {
  this.imageLoadFailed[email] = true;
}

  filterDrivers(): void {
    if (!this.searchQuery) {
      this.filteredDrivers = [...this.drivers];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredDrivers = this.drivers.filter(
      (driver) =>
        driver.firstName?.toLowerCase().includes(query) ||
        driver.lastName?.toLowerCase().includes(query) ||
        driver.email?.toLowerCase().includes(query) ||
        driver.phoneNo?.includes(query)
    );
  }

  toggleFilter(filterId: string): void {
    this.filters.forEach((filter) => {
      filter.active = filter.id === filterId;
    });

    if (filterId === 'all') {
      this.filteredDrivers = [...this.drivers];
    } else {
      this.filteredDrivers = this.drivers.filter(
        (driver) => driver.status?.toLowerCase() === filterId.toLowerCase()
      );
    }
  }

  openAddDriverModal(): void {
    this.showAddDriverModal = true;
  }

  closeAddDriverModal(): void {
    this.showAddDriverModal = false;
    this.newDriver = {
      userHandle: '',
      userName: '',
      email: '',
      phoneNo: '',
      firstName: '',
      lastName: '',
      password: '',
      roles: ['DRIVER'],
      status: 'Active',
      fleetName: '',
      servicesOffered: [] as string[],
    };
    this.selectedPlatforms = { uber: false, bolt: false, indriver: false, other: false };
    this.otherPlatform = '';
  }

  addDriver(): void {
    this.isLoading = true;
    // build servicesOffered from selection
    const platforms: string[] = [];
    if (this.selectedPlatforms.uber) platforms.push('Uber');
    if (this.selectedPlatforms.bolt) platforms.push('Bolt');
    if (this.selectedPlatforms.indriver) platforms.push('inDriver');
    if (this.selectedPlatforms.other && this.otherPlatform?.trim()) {
      const extras = this.otherPlatform.split(',').map(p => p.trim()).filter(p => p.length > 0);
      platforms.push(...extras);
    }
    this.newDriver.servicesOffered = platforms;
    if (!this.newDriver.fleetName || !this.newDriver.fleetName.trim()) {
      this.newDriver.fleetName = 'N/A';
    }
    // simple guard to avoid empty password
    if (!this.newDriver.password || !this.newDriver.password.trim()) {
      this.isLoading = false;
      alert('Please enter a password');
      return;
    }
    // simple guard to avoid empty fleet name
    if (!this.newDriver.fleetName || !this.newDriver.fleetName.trim()) {
      this.isLoading = false;
      alert('Please enter a fleet name');
      return;
    }
    // simple guard to avoid empty services offered
    if (!this.newDriver.servicesOffered || this.newDriver.servicesOffered.length === 0) {
      this.isLoading = false;
      alert('Please select at least one ride-hailing platform');
      return;
    }
    // Map to backend AddDriverRequest fields - only send required fields
    const body = {
      email: this.newDriver.email,
      firstName: this.newDriver.firstName,
      lastName: this.newDriver.lastName,
      password: this.newDriver.password,
      phoneNumber: this.newDriver.phoneNo,
      fleetName: this.newDriver.fleetName,
      servicesOffered: this.newDriver.servicesOffered
    };

    // Debug: Log the request body
    console.log('Sending driver data:', body);

    // PRODUCTION BACKEND (commented out for local testing)
    // this.http
    //   .post<any>('https://backend.qubic3d.co.za/api/fleet-owners/drivers/add', body)
    
    // LOCAL BACKEND (for testing)
    this.http
      .post<any>('http://localhost:8181/api/fleet-owners/drivers/add', body)
      .subscribe({
        next: () => {
          this.fetchDrivers();
          this.closeAddDriverModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error adding driver:', error);
          console.error('Error details:', error.error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          this.isLoading = false;
        },
      });
  }

  editDriver(driver: any) {
    this.router.navigate(['/drivers/edit', driver.email]);
  }


  pauseDriver(driver: any): void {
    // Only allow pausing if driver is assigned (Active status)
    if (!this.assignedDriverIds.has(driver.id)) {
      alert('Only assigned drivers can be paused. Please assign a tablet first.');
      return;
    }

    // Optimistic UI update
    const previous = driver.status;
    driver.status = 'Paused';
    this.updateCounts();

    // PRODUCTION BACKEND (commented out for local testing)
    // this.http.post<any>('https://backend.qubic3d.co.za/api/drivers/pause', { id: driver.id })
    
    // LOCAL BACKEND (for testing)
    this.http.post<any>('http://localhost:8181/api/drivers/pause', { id: driver.id })
      .subscribe({
        next: () => {
          // success - nothing else
        },
        error: (error) => {
          console.error('Error pausing driver:', error);
          driver.status = previous;
          this.updateCounts();
        }
      });
  }

  resumeDriver(driver: any): void {
    const previous = driver.status;
    driver.status = 'Active';
    this.updateCounts();

    // PRODUCTION BACKEND (commented out for local testing)
    // this.http.post<any>('https://backend.qubic3d.co.za/profile/drivers/resume', { id: driver.id })
    
    // LOCAL BACKEND (for testing)
    this.http.post<any>('http://localhost:8181/api/drivers/resume', { id: driver.id })
      .subscribe({
        next: () => {},
        error: (error) => {
          console.error('Error resuming driver:', error);
          driver.status = previous;
          this.updateCounts();
        }
      });
  }

  // Helpers for template display
  getFleetName(driver: any): string {
    // Return the fleet name if it exists, otherwise show N/A
    return driver?.fleetName || 'N/A';
  }

  getHailingPlatforms(driver: any): string[] {
    return Array.isArray(driver?.servicesOffered) ? driver.servicesOffered : [];
  }

  // Open assign-tablet modal for an unassigned driver
  openAssignTabletForDriver(driver: any, event?: Event): void {
    if (event) { event.stopPropagation(); }
    this.assignTargetDriver = driver;
    this.selectedDeviceId = null;
    this.showAssignTabletModal = true;
    // Load unassigned devices from monitor
    this.tabletMonitorService.getMonitor().subscribe({
      next: (res) => {
        const rows = (res?.data || []) as TabletMonitorRow[];
        this.unassignedDevices = rows.filter(r => r.driverId == null);
        this.selectedDeviceId = this.unassignedDevices[0]?.deviceId ?? null;
      },
      error: () => {
        this.unassignedDevices = [];
      }
    });
  }

  closeAssignTabletModal(): void {
    this.showAssignTabletModal = false;
    this.assignTargetDriver = null;
    this.selectedDeviceId = null;
  }

  confirmAssignTablet(): void {
    if (!this.assignTargetDriver || !this.selectedDeviceId) return;
    const driverId = Number(this.assignTargetDriver.id);
    this.tabletMonitorService.assign(this.selectedDeviceId, driverId).subscribe({
      next: () => {
        this.closeAssignTabletModal();
        // Update local driver status
        const d = this.drivers.find(x => x.id === driverId);
        if (d) d.status = 'Active';
        this.assignmentEvents.emit({ action: 'assign', driverId, deviceId: this.selectedDeviceId! });
        this.loadAssignments();
      },
      error: () => {
        // keep modal open for retry
      }
    });
  }

  deleteDriver(id: number): void {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.isLoading = true;
      this.http
        // PRODUCTION BACKEND (commented out for local testing)
        // .delete(`https://backend.qubic3d.co.za/api/drivers/${id}`)
        
        // LOCAL BACKEND (for testing)
        .delete(`http://localhost:8181/api/drivers/${id}`)
        .subscribe({
          next: () => {
            this.fetchDrivers();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error deleting driver:', error);
            this.isLoading = false;
          },
        });
    }
  }
  goToEditDriver(driverId: string) {
    this.router.navigate(['/drivers', driverId, 'edit']); // Adjust route as needed
  }
}
