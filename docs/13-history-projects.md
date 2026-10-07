# 13 · History, Saved Projects & Quotes  ⬜ planned

Routes: `/history`, `/projects`, `/quote`

## Storage adapter
```ts
interface Repository<T extends { id: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  put(item: T): Promise<void>;
  remove(id: string): Promise<void>;
}
```
- Web: IndexedDB implementation (`src/lib/storage/indexeddb.ts`).
- Mobile: SQLite/AsyncStorage implementation with the same interface.

## History entry
`{ id, createdAt, tool: "sheet" | "area" | ..., input, resultSummary }`: auto-saved after each successful calculation (debounced), newest first, with a clear-all option.

## Project
`{ id, name, customer?, items: HistoryEntry[], createdAt, updatedAt }`: groups several calculations for one job.

## Quote / Estimate
Built from a project: line items, subtotal, optional discount/VAT, total in the chosen currency. Export as a printable page (and later PDF / share sheet on mobile).
