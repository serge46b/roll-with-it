import type { SupabaseClient } from "@supabase/supabase-js"

type IdTable =
  | "spell"
  | "spelllevelslot"
  | "equipmentitem"
  | "weaponequipment"
  | "equipmentslot"
  | "character"
  | "worldnote"

const MAX_INSERT_ATTEMPTS = 20

export function isDuplicateKeyError(error: { code?: string; message?: string } | null): boolean {
  return error?.code === "23505" || Boolean(error?.message?.includes("duplicate key"))
}

export async function getNextRowId(supabase: SupabaseClient, table: IdTable): Promise<number> {
  const { data, error } = await supabase.from(table).select("id").order("id", { ascending: false }).limit(1).maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return (data?.id ?? 0) + 1
}

/** Inserts with an explicit id (never relies on DB sequence). Retries with incremented id on duplicate key. */
export async function insertWithGeneratedId<T extends Record<string, unknown>>(
  supabase: SupabaseClient,
  table: IdTable,
  row: T,
): Promise<number> {
  let candidateId = await getNextRowId(supabase, table)
  let lastError = "Insert failed"

  for (let attempt = 0; attempt < MAX_INSERT_ATTEMPTS; attempt++) {
    const { data, error } = await supabase
      .from(table)
      .insert({ ...row, id: candidateId })
      .select("id")
      .single()

    if (!error && data) {
      return data.id
    }

    lastError = error?.message ?? lastError

    if (!isDuplicateKeyError(error)) {
      throw new Error(lastError)
    }

    candidateId += 1
  }

  throw new Error(lastError)
}
