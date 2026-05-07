export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      armorequipment: {
        Row: {
          class: number
          id: number
          is_silent: boolean
          slot: number
        }
        Insert: {
          class: number
          id?: number
          is_silent: boolean
          slot: number
        }
        Update: {
          class?: number
          id?: number
          is_silent?: boolean
          slot?: number
        }
        Relationships: [
          {
            foreignKeyName: "armorequipment_slot_fkey"
            columns: ["slot"]
            isOneToOne: false
            referencedRelation: "equipmentitem"
            referencedColumns: ["id"]
          },
        ]
      }
      character: {
        Row: {
          alignment: string
          background_story: string
          class: string
          color: string
          current_hp: number
          defense_class: number
          hp_bonus: number
          id: number
          level: number
          map: number | null
          max_hp: number
          name: string
          owner: string
          pos_x: number | null
          pos_y: number | null
          race: string
          speed: number
          world: string
        }
        Insert: {
          alignment: string
          background_story: string
          class: string
          color: string
          current_hp: number
          defense_class: number
          hp_bonus: number
          id?: number
          level: number
          map?: number | null
          max_hp: number
          name: string
          owner: string
          pos_x?: number | null
          pos_y?: number | null
          race: string
          speed: number
          world: string
        }
        Update: {
          alignment?: string
          background_story?: string
          class?: string
          color?: string
          current_hp?: number
          defense_class?: number
          hp_bonus?: number
          id?: number
          level?: number
          map?: number | null
          max_hp?: number
          name?: string
          owner?: string
          pos_x?: number | null
          pos_y?: number | null
          race?: string
          speed?: number
          world?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_map_fkey"
            columns: ["map"]
            isOneToOne: false
            referencedRelation: "map"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_world_fkey"
            columns: ["world"]
            isOneToOne: false
            referencedRelation: "world"
            referencedColumns: ["uuid"]
          },
        ]
      }
      characteristic: {
        Row: {
          character: number
          flag: string
          id: number
          name: string
          value: number
        }
        Insert: {
          character: number
          flag: string
          id?: number
          name: string
          value: number
        }
        Update: {
          character?: number
          flag?: string
          id?: number
          name?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "characteristic_character_fkey"
            columns: ["character"]
            isOneToOne: false
            referencedRelation: "character"
            referencedColumns: ["id"]
          },
        ]
      }
      characternote: {
        Row: {
          character: number
          id: number
          note: string
        }
        Insert: {
          character: number
          id?: number
          note: string
        }
        Update: {
          character?: number
          id?: number
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "characternote_character_fkey"
            columns: ["character"]
            isOneToOne: false
            referencedRelation: "character"
            referencedColumns: ["id"]
          },
        ]
      }
      classracespecialities: {
        Row: {
          character: number
          id: number
          sp_description: string
          sp_name: string
        }
        Insert: {
          character: number
          id?: number
          sp_description: string
          sp_name: string
        }
        Update: {
          character?: number
          id?: number
          sp_description?: string
          sp_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "classracespecialities_character_fkey"
            columns: ["character"]
            isOneToOne: false
            referencedRelation: "character"
            referencedColumns: ["id"]
          },
        ]
      }
      decorequipment: {
        Row: {
          id: number
          slot: number
        }
        Insert: {
          id?: number
          slot: number
        }
        Update: {
          id?: number
          slot?: number
        }
        Relationships: [
          {
            foreignKeyName: "decorequipment_slot_fkey"
            columns: ["slot"]
            isOneToOne: false
            referencedRelation: "equipmentitem"
            referencedColumns: ["id"]
          },
        ]
      }
      effect: {
        Row: {
          character: number
          effect_flag: string
          id: number
        }
        Insert: {
          character: number
          effect_flag: string
          id?: number
        }
        Update: {
          character?: number
          effect_flag?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "effect_character_fkey"
            columns: ["character"]
            isOneToOne: false
            referencedRelation: "character"
            referencedColumns: ["id"]
          },
        ]
      }
      equipmentitem: {
        Row: {
          creator: string
          description: string
          equipment_type_flag: string
          id: number
          name: string
        }
        Insert: {
          creator: string
          description: string
          equipment_type_flag: string
          id?: number
          name: string
        }
        Update: {
          creator?: string
          description?: string
          equipment_type_flag?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      equipmentslot: {
        Row: {
          amount: number
          character: number
          id: number
          is_visible: boolean
          item: number
        }
        Insert: {
          amount: number
          character: number
          id?: number
          is_visible: boolean
          item: number
        }
        Update: {
          amount?: number
          character?: number
          id?: number
          is_visible?: boolean
          item?: number
        }
        Relationships: [
          {
            foreignKeyName: "equipmentslot_character_fkey"
            columns: ["character"]
            isOneToOne: false
            referencedRelation: "character"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipmentslot_item_fkey"
            columns: ["item"]
            isOneToOne: false
            referencedRelation: "equipmentitem"
            referencedColumns: ["id"]
          },
        ]
      }
      magicequipment: {
        Row: {
          id: number
          slot: number
          type: string
        }
        Insert: {
          id?: number
          slot: number
          type: string
        }
        Update: {
          id?: number
          slot?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "magicequipment_slot_fkey"
            columns: ["slot"]
            isOneToOne: false
            referencedRelation: "equipmentitem"
            referencedColumns: ["id"]
          },
        ]
      }
      map: {
        Row: {
          grid_scale_px: number
          id: number
          name: string
          world: string
        }
        Insert: {
          grid_scale_px: number
          id?: number
          name: string
          world: string
        }
        Update: {
          grid_scale_px?: number
          id?: number
          name?: string
          world?: string
        }
        Relationships: [
          {
            foreignKeyName: "map_world_fkey"
            columns: ["world"]
            isOneToOne: false
            referencedRelation: "world"
            referencedColumns: ["uuid"]
          },
        ]
      }
      profile: {
        Row: {
          id: number
          nickname: string
          user: string
        }
        Insert: {
          id?: number
          nickname: string
          user: string
        }
        Update: {
          id?: number
          nickname?: string
          user?: string
        }
        Relationships: []
      }
      spell: {
        Row: {
          description: string
          id: number
          name: string
          spell_level: number
        }
        Insert: {
          description: string
          id?: number
          name: string
          spell_level: number
        }
        Update: {
          description?: string
          id?: number
          name?: string
          spell_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "spell_spell_level_fkey"
            columns: ["spell_level"]
            isOneToOne: false
            referencedRelation: "spelllevelslot"
            referencedColumns: ["id"]
          },
        ]
      }
      spelllevelslot: {
        Row: {
          character: number
          id: number
          level: number
          max_slots_count: number
          used_slots: number
        }
        Insert: {
          character: number
          id?: number
          level: number
          max_slots_count: number
          used_slots: number
        }
        Update: {
          character?: number
          id?: number
          level?: number
          max_slots_count?: number
          used_slots?: number
        }
        Relationships: [
          {
            foreignKeyName: "spelllevelslot_character_fkey"
            columns: ["character"]
            isOneToOne: false
            referencedRelation: "character"
            referencedColumns: ["id"]
          },
        ]
      }
      weaponequipment: {
        Row: {
          attack_bonus: number
          damage: string
          id: number
          slot: number
          type: string
        }
        Insert: {
          attack_bonus: number
          damage: string
          id?: number
          slot: number
          type: string
        }
        Update: {
          attack_bonus?: number
          damage?: string
          id?: number
          slot?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "weaponequipment_slot_fkey"
            columns: ["slot"]
            isOneToOne: false
            referencedRelation: "equipmentitem"
            referencedColumns: ["id"]
          },
        ]
      }
      world: {
        Row: {
          description: string
          name: string
          owner: string
          uuid: string
        }
        Insert: {
          description: string
          name: string
          owner: string
          uuid: string
        }
        Update: {
          description?: string
          name?: string
          owner?: string
          uuid?: string
        }
        Relationships: []
      }
      worldnote: {
        Row: {
          id: number
          note: string
          world: string
        }
        Insert: {
          id?: number
          note: string
          world: string
        }
        Update: {
          id?: number
          note?: string
          world?: string
        }
        Relationships: [
          {
            foreignKeyName: "worldnote_world_fkey"
            columns: ["world"]
            isOneToOne: false
            referencedRelation: "world"
            referencedColumns: ["uuid"]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
