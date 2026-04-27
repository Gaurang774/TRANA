// Mock User and Session types to replace @supabase/supabase-js
export interface User {
  id: string;
  email?: string;
  user_metadata?: any;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

// ─── Mock Data Store ────────────────────────────────────────────────────────

const mockEmergencies = [
  {
    id: 'em-001',
    emergency_number: 'EM-2026-001',
    type: 'Cardiac Arrest',
    location: 'Sector 15, Gurugram, Haryana',
    status: 'in_progress',
    priority: 'critical',
    reported_by: 'Control Room',
    assigned_to: 'AMB-001',
    responding_unit: 'AMB-001',
    notes: 'Male, 58 years old, chest pain reported. CPR in progress.',
    description: 'Patient collapsed at office building, bystander CPR initiated.',
    caller_name: 'Rajesh Sharma',
    caller_phone: '+91 98765 43210',
    eta_minutes: 4,
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'em-002',
    emergency_number: 'EM-2026-002',
    type: 'Road Traffic Accident',
    location: 'NH-48, Near Manesar Toll, Haryana',
    status: 'dispatched',
    priority: 'high',
    reported_by: 'Highway Patrol',
    assigned_to: 'AMB-002',
    responding_unit: 'AMB-002',
    notes: '2 vehicles involved, 3 casualties reported.',
    description: 'Multi-vehicle collision on the highway. 3 injured, 1 critical.',
    caller_name: 'Traffic Police',
    caller_phone: '112',
    eta_minutes: 8,
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'em-003',
    emergency_number: 'EM-2026-003',
    type: 'Fall Injury',
    location: 'DLF Phase 3, Cyber City, Gurugram',
    status: 'pending',
    priority: 'medium',
    reported_by: 'Building Security',
    assigned_to: null,
    responding_unit: null,
    notes: 'Construction worker fell from scaffolding, conscious but in pain.',
    description: 'Fall from approximately 3 meters height. Suspected fracture.',
    caller_name: 'Amit Verma',
    caller_phone: '+91 87654 32109',
    eta_minutes: null,
    created_at: new Date(Date.now() - 3 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60000).toISOString(),
  },
  {
    id: 'em-004',
    emergency_number: 'EM-2026-004',
    type: 'Breathing Difficulty',
    location: 'Saket, New Delhi',
    status: 'pending',
    priority: 'high',
    reported_by: 'Family Member',
    assigned_to: null,
    responding_unit: null,
    notes: 'Elderly female, 72 years, severe asthma attack.',
    description: 'Known asthmatic patient not responding to inhaler.',
    caller_name: 'Priya Singh',
    caller_phone: '+91 99887 76655',
    eta_minutes: null,
    created_at: new Date(Date.now() - 1 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60000).toISOString(),
  },
];

const mockAmbulances = [
  {
    id: 'AMB-001',
    name: 'Ambulance 001',
    vehicle_number: 'DL-01-AB-1234',
    status: 'en-route',
    latitude: 28.4595,
    longitude: 77.0266,
    current_address: 'Sector 15, Gurugram',
    driver_name: 'Suresh Kumar',
    driver_phone: '+91 98765 00001',
    equipment: ['AED', 'Ventilator', 'Stretcher'],
    last_updated: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 'AMB-002',
    name: 'Ambulance 002',
    vehicle_number: 'HR-26-CD-5678',
    status: 'en-route',
    latitude: 28.4089,
    longitude: 76.9501,
    current_address: 'NH-48, Manesar',
    driver_name: 'Vikram Yadav',
    driver_phone: '+91 98765 00002',
    equipment: ['AED', 'Stretcher', 'Oxygen'],
    last_updated: new Date(Date.now() - 1 * 60000).toISOString(),
  },
  {
    id: 'AMB-003',
    name: 'Ambulance 003',
    vehicle_number: 'DL-03-EF-9012',
    status: 'available',
    latitude: 28.5355,
    longitude: 77.2100,
    current_address: 'AIIMS Hospital, New Delhi',
    driver_name: 'Ramesh Patel',
    driver_phone: '+91 98765 00003',
    equipment: ['AED', 'Ventilator', 'Stretcher', 'Oxygen'],
    last_updated: new Date(Date.now() - 5 * 60000).toISOString(),
  },
];

const mockHospitalBeds = [
  { id: 'bed-001', bed_number: 'ICU-01', department: 'ICU', status: 'occupied', patient_id: 'p-001' },
  { id: 'bed-002', bed_number: 'ICU-02', department: 'ICU', status: 'occupied', patient_id: 'p-002' },
  { id: 'bed-003', bed_number: 'ICU-03', department: 'ICU', status: 'available', patient_id: null },
  { id: 'bed-004', bed_number: 'ICU-04', department: 'ICU', status: 'reserved', patient_id: null },
  { id: 'bed-005', bed_number: 'GEN-01', department: 'General Ward', status: 'occupied', patient_id: 'p-003' },
  { id: 'bed-006', bed_number: 'GEN-02', department: 'General Ward', status: 'available', patient_id: null },
];

const mockNotifications = [
  { id: 'notif-001', type: 'emergency', title: 'Critical Alert', message: 'Cardiac arrest reported in Sector 15', is_read: false, created_at: new Date().toISOString() },
  { id: 'notif-002', type: 'system', title: 'System Status', message: 'All ambulance systems operational', is_read: true, created_at: new Date(Date.now() - 3600000).toISOString() },
];

// ─── Data Lookup ────────────────────────────────────────────────────────────

const mockTables: Record<string, any[]> = {
  emergencies: mockEmergencies,
  ambulances: mockAmbulances,
  hospital_beds: mockHospitalBeds,
  notifications: mockNotifications,
};

// ─── Mock Real-time Channel ─────────────────────────────────────────────────

class MockChannel {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  on(event: string, filter: any, callback: (payload: any) => void) {
    return this;
  }
  subscribe(statusCallback?: (status: string) => void) {
    if (statusCallback) {
      setTimeout(() => statusCallback('SUBSCRIBED'), 0);
    }
    return this;
  }
  unsubscribe() {
    return { error: null };
  }
}

// ─── Mock Query Builder ─────────────────────────────────────────────────────

class MockQueryBuilder {
  private tableName: string;
  private filters: Array<{ type: string; column: string; value: any }> = [];
  private orderColumn: string | null = null;
  private orderAsc: boolean = true;
  private limitCount: number | null = null;
  private isSingle: boolean = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(_columns?: string) { return this; }
  insert(data: any) { return this; }
  update(data: any) { return this; }
  delete() { return this; }
  eq(column: string, value: any) {
    this.filters.push({ type: 'eq', column, value });
    return this;
  }
  neq(column: string, value: any) {
    this.filters.push({ type: 'neq', column, value });
    return this;
  }
  order(column: string, options?: { ascending?: boolean }) {
    this.orderColumn = column;
    this.orderAsc = options?.ascending ?? true;
    return this;
  }
  limit(count: number) {
    this.limitCount = count;
    return this;
  }
  single() {
    this.isSingle = true;
    return this;
  }

  then(resolve: (value: { data: any; error: any }) => void) {
    let data = [...(mockTables[this.tableName] || [])];
    for (const f of this.filters) {
      if (f.type === 'eq') data = data.filter((row) => row[f.column] === f.value);
      if (f.type === 'neq') data = data.filter((row) => row[f.column] !== f.value);
    }
    if (this.orderColumn) {
      const col = this.orderColumn;
      const asc = this.orderAsc;
      data.sort((a, b) => {
        if (a[col] < b[col]) return asc ? -1 : 1;
        if (a[col] > b[col]) return asc ? 1 : -1;
        return 0;
      });
    }
    if (this.limitCount !== null) data = data.slice(0, this.limitCount);
    const result = this.isSingle ? { data: data[0] || null, error: null } : { data, error: null };
    resolve(result);
  }
}

// ─── Mock Supabase Client ───────────────────────────────────────────────────

export const supabase = {
  from: (tableName: string) => new MockQueryBuilder(tableName),
  rpc: async (_fnName: string, _args?: any) => ({ data: null, error: null }),
  channel: (name: string) => new MockChannel(name),
  removeChannel: (channel: any) => ({ error: null }),
  removeAllChannels: () => ({ error: null }),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      setTimeout(() => callback('INITIAL_SESSION', null), 0);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Auth is mock-only.' } }),
    signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Auth is mock-only.' } }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ error: { message: 'Auth is mock-only.' } }),
  },
};