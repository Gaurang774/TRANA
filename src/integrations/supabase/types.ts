export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ambulance_assignments: {
        Row: {
          ambulance_id: string | null
          created_at: string | null
          id: string
          role: string
          shift_end: string | null
          shift_start: string
          staff_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ambulance_id?: string | null
          created_at?: string | null
          id?: string
          role: string
          shift_end?: string | null
          shift_start: string
          staff_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          ambulance_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
          shift_end?: string | null
          shift_start?: string
          staff_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ambulance_assignments_ambulance_id_fkey"
            columns: ["ambulance_id"]
            isOneToOne: false
            referencedRelation: "ambulances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ambulance_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ambulances: {
        Row: {
          ambulance_number: string
          assigned_emergency_id: string | null
          base_station: string | null
          created_at: string
          crew_members: Json | null
          crew_size: number | null
          current_location: Json | null
          driver_id: string | null
          equipment_status: Json | null
          fuel_level: number | null
          id: string
          is_deleted: boolean | null
          last_maintenance: string | null
          license_plate: string | null
          mileage: number | null
          next_maintenance_date: string | null
          paramedic_id: string | null
          status: string
          type: string | null
          updated_at: string
        }
        Insert: {
          ambulance_number: string
          assigned_emergency_id?: string | null
          base_station?: string | null
          created_at?: string
          crew_members?: Json | null
          crew_size?: number | null
          current_location?: Json | null
          driver_id?: string | null
          equipment_status?: Json | null
          fuel_level?: number | null
          id?: string
          is_deleted?: boolean | null
          last_maintenance?: string | null
          license_plate?: string | null
          mileage?: number | null
          next_maintenance_date?: string | null
          paramedic_id?: string | null
          status: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          ambulance_number?: string
          assigned_emergency_id?: string | null
          base_station?: string | null
          created_at?: string
          crew_members?: Json | null
          crew_size?: number | null
          current_location?: Json | null
          driver_id?: string | null
          equipment_status?: Json | null
          fuel_level?: number | null
          id?: string
          is_deleted?: boolean | null
          last_maintenance?: string | null
          license_plate?: string | null
          mileage?: number | null
          next_maintenance_date?: string | null
          paramedic_id?: string | null
          status?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ambulances_assigned_emergency_id_fkey"
            columns: ["assigned_emergency_id"]
            isOneToOne: false
            referencedRelation: "emergencies"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_number: string | null
          appointment_time: string
          created_at: string
          department: string
          department_id: string | null
          diagnosis: string | null
          doctor_id: string | null
          duration_minutes: number | null
          fees: number | null
          hospital_id: string | null
          id: string
          is_deleted: boolean | null
          notes: string | null
          patient_email: string | null
          patient_name: string
          patient_phone: string | null
          payment_status: string | null
          prescription: string | null
          status: string
          symptoms: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_number?: string | null
          appointment_time: string
          created_at?: string
          department: string
          department_id?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          duration_minutes?: number | null
          fees?: number | null
          hospital_id?: string | null
          id?: string
          is_deleted?: boolean | null
          notes?: string | null
          patient_email?: string | null
          patient_name: string
          patient_phone?: string | null
          payment_status?: string | null
          prescription?: string | null
          status?: string
          symptoms?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_number?: string | null
          appointment_time?: string
          created_at?: string
          department?: string
          department_id?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          duration_minutes?: number | null
          fees?: number | null
          hospital_id?: string | null
          id?: string
          is_deleted?: boolean | null
          notes?: string | null
          patient_email?: string | null
          patient_name?: string
          patient_phone?: string | null
          payment_status?: string | null
          prescription?: string | null
          status?: string
          symptoms?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          head_doctor_id: string | null
          hospital_id: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          head_doctor_id?: string | null
          hospital_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          head_doctor_id?: string | null
          hospital_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_head_doctor_id_fkey"
            columns: ["head_doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      emergencies: {
        Row: {
          actual_arrival: string | null
          assigned_ambulance_id: string | null
          assigned_hospital_id: string | null
          assigned_to: string | null
          caller_name: string | null
          caller_phone: string | null
          coordinates: Json | null
          created_at: string
          description: string | null
          dispatcher_id: string | null
          emergency_number: string | null
          estimated_arrival: string | null
          eta_minutes: number | null
          id: string
          is_deleted: boolean | null
          location: string
          notes: string | null
          patient_age: number | null
          patient_gender: string | null
          patient_name: string | null
          priority: string
          reported_by: string | null
          responding_unit: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          actual_arrival?: string | null
          assigned_ambulance_id?: string | null
          assigned_hospital_id?: string | null
          assigned_to?: string | null
          caller_name?: string | null
          caller_phone?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          dispatcher_id?: string | null
          emergency_number?: string | null
          estimated_arrival?: string | null
          eta_minutes?: number | null
          id?: string
          is_deleted?: boolean | null
          location: string
          notes?: string | null
          patient_age?: number | null
          patient_gender?: string | null
          patient_name?: string | null
          priority: string
          reported_by?: string | null
          responding_unit?: string | null
          status: string
          type: string
          updated_at?: string
        }
        Update: {
          actual_arrival?: string | null
          assigned_ambulance_id?: string | null
          assigned_hospital_id?: string | null
          assigned_to?: string | null
          caller_name?: string | null
          caller_phone?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          dispatcher_id?: string | null
          emergency_number?: string | null
          estimated_arrival?: string | null
          eta_minutes?: number | null
          id?: string
          is_deleted?: boolean | null
          location?: string
          notes?: string | null
          patient_age?: number | null
          patient_gender?: string | null
          patient_name?: string | null
          priority?: string
          reported_by?: string | null
          responding_unit?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergencies_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergencies_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_logs: {
        Row: {
          action: string
          data: Json | null
          description: string | null
          emergency_id: string
          id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          data?: Json | null
          description?: string | null
          emergency_id: string
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          data?: Json | null
          description?: string | null
          emergency_id?: string
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_logs_emergency_id_fkey"
            columns: ["emergency_id"]
            isOneToOne: false
            referencedRelation: "emergencies"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_beds: {
        Row: {
          admission_date: string | null
          assigned_doctor_id: string | null
          bed_number: string
          bed_type: string | null
          created_at: string
          daily_rate: number | null
          department: string
          department_id: string | null
          equipment: Json | null
          estimated_discharge: string | null
          floor_number: number | null
          hospital_id: string | null
          id: string
          is_deleted: boolean | null
          notes: string | null
          patient_id: string | null
          patient_name: string | null
          room_number: string | null
          status: string
          updated_at: string
          ward: string | null
        }
        Insert: {
          admission_date?: string | null
          assigned_doctor_id?: string | null
          bed_number: string
          bed_type?: string | null
          created_at?: string
          daily_rate?: number | null
          department: string
          department_id?: string | null
          equipment?: Json | null
          estimated_discharge?: string | null
          floor_number?: number | null
          hospital_id?: string | null
          id?: string
          is_deleted?: boolean | null
          notes?: string | null
          patient_id?: string | null
          patient_name?: string | null
          room_number?: string | null
          status: string
          updated_at?: string
          ward?: string | null
        }
        Update: {
          admission_date?: string | null
          assigned_doctor_id?: string | null
          bed_number?: string
          bed_type?: string | null
          created_at?: string
          daily_rate?: number | null
          department?: string
          department_id?: string | null
          equipment?: Json | null
          estimated_discharge?: string | null
          floor_number?: number | null
          hospital_id?: string | null
          id?: string
          is_deleted?: boolean | null
          notes?: string | null
          patient_id?: string | null
          patient_name?: string | null
          room_number?: string | null
          status?: string
          updated_at?: string
          ward?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospital_beds_assigned_doctor_id_fkey"
            columns: ["assigned_doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_beds_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_beds_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_beds_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string
          available_beds: number | null
          coordinates: Json | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          total_beds: number | null
          updated_at: string | null
        }
        Insert: {
          address: string
          available_beds?: number | null
          coordinates?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          total_beds?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          available_beds?: number | null
          coordinates?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          total_beds?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      medical_inventory: {
        Row: {
          category: string
          cost_per_unit: number | null
          created_at: string
          description: string | null
          expiry_date: string | null
          id: string
          is_critical: boolean | null
          item_name: string
          location: string | null
          notes: string | null
          quantity_available: number
          quantity_reserved: number
          reorder_level: number | null
          sku: string | null
          supplier: string | null
          unit_type: string | null
          updated_at: string
        }
        Insert: {
          category: string
          cost_per_unit?: number | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          is_critical?: boolean | null
          item_name: string
          location?: string | null
          notes?: string | null
          quantity_available?: number
          quantity_reserved?: number
          reorder_level?: number | null
          sku?: string | null
          supplier?: string | null
          unit_type?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          cost_per_unit?: number | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          is_critical?: boolean | null
          item_name?: string
          location?: string | null
          notes?: string | null
          quantity_available?: number
          quantity_reserved?: number
          reorder_level?: number | null
          sku?: string | null
          supplier?: string | null
          unit_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          allergies: string[] | null
          attachments: string[] | null
          created_at: string | null
          diagnosis: string | null
          doctor_id: string | null
          follow_up_date: string | null
          hospital_id: string | null
          id: string
          is_deleted: boolean | null
          lab_results: Json | null
          medications: string | null
          notes: string | null
          patient_id: string | null
          record_type: string | null
          treatment: string | null
          updated_at: string | null
          visit_date: string | null
          vitals: Json | null
        }
        Insert: {
          allergies?: string[] | null
          attachments?: string[] | null
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          follow_up_date?: string | null
          hospital_id?: string | null
          id?: string
          is_deleted?: boolean | null
          lab_results?: Json | null
          medications?: string | null
          notes?: string | null
          patient_id?: string | null
          record_type?: string | null
          treatment?: string | null
          updated_at?: string | null
          visit_date?: string | null
          vitals?: Json | null
        }
        Update: {
          allergies?: string[] | null
          attachments?: string[] | null
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          follow_up_date?: string | null
          hospital_id?: string | null
          id?: string
          is_deleted?: boolean | null
          lab_results?: Json | null
          medications?: string | null
          notes?: string | null
          patient_id?: string | null
          record_type?: string | null
          treatment?: string | null
          updated_at?: string | null
          visit_date?: string | null
          vitals?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medicines: {
        Row: {
          active_ingredients: string | null
          brand_names: string[] | null
          created_at: string | null
          description: string | null
          dosage: string | null
          drug_class: string | null
          generic_name: string | null
          id: string
          interactions: string | null
          manufacturer: string | null
          name: string
          prescription_required: boolean | null
          side_effects: string | null
          updated_at: string | null
          uses: string | null
          warnings: string | null
        }
        Insert: {
          active_ingredients?: string | null
          brand_names?: string[] | null
          created_at?: string | null
          description?: string | null
          dosage?: string | null
          drug_class?: string | null
          generic_name?: string | null
          id?: string
          interactions?: string | null
          manufacturer?: string | null
          name: string
          prescription_required?: boolean | null
          side_effects?: string | null
          updated_at?: string | null
          uses?: string | null
          warnings?: string | null
        }
        Update: {
          active_ingredients?: string | null
          brand_names?: string[] | null
          created_at?: string | null
          description?: string | null
          dosage?: string | null
          drug_class?: string | null
          generic_name?: string | null
          id?: string
          interactions?: string | null
          manufacturer?: string | null
          name?: string
          prescription_required?: boolean | null
          side_effects?: string | null
          updated_at?: string | null
          uses?: string | null
          warnings?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          date_of_birth: string | null
          department: string | null
          email: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          license_number: string | null
          phone: string | null
          role: string
          specialty: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          license_number?: string | null
          phone?: string | null
          role?: string
          specialty?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          license_number?: string | null
          phone?: string | null
          role?: string
          specialty?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          content: Json | null
          created_at: string
          generated_by: string | null
          id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          generated_by?: string | null
          id?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          generated_by?: string | null
          id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          ambulance_id: string | null
          created_at: string
          destination: string
          distance: string | null
          estimated_time: string | null
          id: string
          name: string
          start_location: string
          status: string
          traffic_level: string | null
          updated_at: string
        }
        Insert: {
          ambulance_id?: string | null
          created_at?: string
          destination: string
          distance?: string | null
          estimated_time?: string | null
          id?: string
          name: string
          start_location: string
          status: string
          traffic_level?: string | null
          updated_at?: string
        }
        Update: {
          ambulance_id?: string | null
          created_at?: string
          destination?: string
          distance?: string | null
          estimated_time?: string | null
          id?: string
          name?: string
          start_location?: string
          status?: string
          traffic_level?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "routes_ambulance_id_fkey"
            columns: ["ambulance_id"]
            isOneToOne: false
            referencedRelation: "ambulances"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_assignments: {
        Row: {
          ambulance_id: string | null
          assignment_type: string
          created_at: string
          emergency_id: string | null
          id: string
          notes: string | null
          role: string
          shift_end: string | null
          shift_start: string | null
          staff_id: string
          status: string
          updated_at: string
        }
        Insert: {
          ambulance_id?: string | null
          assignment_type: string
          created_at?: string
          emergency_id?: string | null
          id?: string
          notes?: string | null
          role: string
          shift_end?: string | null
          shift_start?: string | null
          staff_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          ambulance_id?: string | null
          assignment_type?: string
          created_at?: string
          emergency_id?: string | null
          id?: string
          notes?: string | null
          role?: string
          shift_end?: string | null
          shift_start?: string | null
          staff_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_assignments_ambulance_id_fkey"
            columns: ["ambulance_id"]
            isOneToOne: false
            referencedRelation: "ambulances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_assignments_emergency_id_fkey"
            columns: ["emergency_id"]
            isOneToOne: false
            referencedRelation: "emergencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_medicine: {
        Args: {
          p_name: string
          p_generic_name?: string
          p_description?: string
          p_uses?: string
          p_dosage?: string
          p_side_effects?: string
          p_warnings?: string
          p_drug_class?: string
          p_prescription_required?: boolean
          p_active_ingredients?: string
          p_brand_names?: string[]
          p_interactions?: string
          p_manufacturer?: string
        }
        Returns: string
      }
      assign_ambulance: {
        Args: {
          p_emergency_id: string
          p_ambulance_id: string
          p_dispatcher_id: string
        }
        Returns: boolean
      }
      book_appointment: {
        Args:
          | {
              p_patient_id: string
              p_doctor_id: string
              p_hospital_id: string
              p_department_id: string
              p_appointment_date: string
              p_appointment_time: string
              p_symptoms?: string
            }
          | {
              p_patient_name: string
              p_department: string
              p_appointment_date: string
              p_appointment_time: string
              p_patient_phone?: string
              p_patient_email?: string
              p_doctor_id?: string
              p_notes?: string
            }
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_ambulance_location: {
        Args: {
          p_ambulance_id: string
          p_latitude: number
          p_longitude: number
          p_address?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
