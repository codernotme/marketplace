# Logic: The Mrktplace

Summary: Core state machines, offline synchronization loop, and licensing evaluation logic.

## State Machines

### 1. POS Checkout & Payment State Machine
```
[Empty Cart] ──(Add Item)──▶ [Building Cart] ──(Park Cart)──▶ [Held Carts (Redis)]
                                    │                                ▲
                                    │ (Resume) ──────────────────────┘
                                    ▼
                          [Payment Modal Open]
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
  [Full Cash]                 [Full Card/UPI]              [Split Tender]
       │                            │                            │
       └────────────────────────────┼────────────────────────────┘
                                    ▼
                         [Complete Transaction]
                                    │
                    ┌───────────────┴───────────────┐
                    ▼ (Online)                      ▼ (Offline)
           [POST /api/v1/sales]            [Save to IndexedDB]
                    │                               │
                    ▼                               ▼
           [Print Receipt]                 [Print Local Receipt]
           [Clear Active Cart]             [Mark synced=false]
```

### 2. Staff Shift Reconciliation State Machine
```
[Terminal Locked] ──(Enter PIN)──▶ [Shift Check]
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼ (No Active Shift)                       ▼ (Shift Active)
          [Open Shift Modal]                              [POS Terminal]
          (Input Opening Cash)                                 │
                    │                                          ▼
                    ▼                                    [Close Shift]
          [Shift Initialized]                            (Count Cash)
                                                               │
                                                               ▼
                                                    [Calculate Discrepancy]
                                                    (Expected vs Actual)
                                                               │
                                                               ▼
                                                        [Shift Closed]
```

### 3. Offline Sync Engine
- Listener monitors `navigator.onLine` and heartbeat pings to `/api/v1/health`.
- On connection restore: query Dexie for `pendingSales.where('synced').equals(0)`.
- Dequeue in FIFO chronological order. Post to `/api/v1/sales`.
- On 200 OK: mark local record `synced = true`.

## Handoff Contract
- Decisions: Shifts are per-staff-member per-store, not per-device. Multiple cashiers can operate on the same register during shifts by switching staff PINs.
- Open: Maximum offline queue limit (Default: 500 sales before requiring online sync).
- Next agent needs: In offline mode, invoice numbers are prefixed with `OFF-` to avoid sequence collisions.

