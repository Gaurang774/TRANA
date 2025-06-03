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
      ambulances: {
        Row: {
          ambulance_number: string
          assigned_emergency_id: string | null
          created_at: string
          crew_members: Json | null
          current_location: Json | null
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          ambulance_number: string
          assigned_emergency_id?: string | null
          created_at?: string
          crew_members?: Json | null
          current_location?: Json | null
          id?: string
          status: string
          updated_at?: string
        }
        Update: {
          ambulance_number?: string
          assigned_emergency_id?: string | null
          created_at?: string
          crew_members?: Json | null
          current_location?: Json | null
          id?: string
          status?: string
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
      emergencies: {
        Row: {
          assigned_to: string | null
          coordinates: Json | null
          created_at: string
          id: string
          location: string
          notes: string | null
          priority: string
          reported_by: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          coordinates?: Json | null
          created_at?: string
          id?: string
          location: string
          notes?: string | null
          priority: string
          reported_by?: string | null
          status: string
          type: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          coordinates?: Json | null
          created_at?: string
          id?: string
          location?: string
          notes?: string | null
          priority?: string
          reported_by?: string | null
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
      hospital_beds: {
        Row: {
          assigned_doctor_id: string | null
          bed_number: string
          created_at: string
          department: string
          id: string
          notes: string | null
          patient_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_doctor_id?: string | null
          bed_number: string
          created_at?: string
          department: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          assigned_doctor_id?: string | null
          bed_number?: string
          created_at?: string
          department?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          status?: string
          updated_at?: string
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
            foreignKeyName: "hospital_beds_patient_id_fkey"
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
      profiles: {
        Row: {
          created_at: string
          department: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          specialty: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role: string
          specialty?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
