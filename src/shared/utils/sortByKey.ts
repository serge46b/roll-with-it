/** Returns a new array sorted by the given key. */
export function sortByKey<T>(items: readonly T[], key: keyof T, direction: "asc" | "desc" = "asc"): T[] {
  const factor = direction === "asc" ? 1 : -1
  return [...items].sort((a, b) => {
    const left = a[key]
    const right = b[key]
    if (typeof left === "number" && typeof right === "number") {
      return factor * (left - right)
    }
    return factor * String(left).localeCompare(String(right))
  })
}
