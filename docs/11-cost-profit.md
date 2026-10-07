# 11 · Cost, Selling Price & Profit  ⬜ UI planned · ✅ engine ready

Routes: `/cost`, `/selling-price`, `/profit` · Engine: `src/core/pricing.ts`

| Function | Formula |
|---|---|
| `calculateCost({ materialCost, inkCost, laborCost, otherCost })` | sum of all parts |
| `sellingPriceFromMarkup(cost, markup%)` | `cost × (1 + markup/100)` |
| `sellingPriceFromMargin(cost, margin%)` | `cost / (1 − margin/100)` (margin < 100) |
| `calculateProfit(cost, sellingPrice)` | profit, margin % (of price), markup % (of cost) |

Examples (tested): cost 100 + 30% markup = 130 · cost 75 at 25% margin = 100 · cost 100, price 150 → profit 50, margin 33.3%, markup 50%.

## UI plan
- Material cost pre-filled from the Sheet/Area result.
- Profit shown as a `StatBar` (margin %) and coloured green/red.
- Feeds into Quote (doc 13).
