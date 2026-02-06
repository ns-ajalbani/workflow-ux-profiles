# Console Output Examples - Real API Calls

When you interact with the app, you'll see console logs like these. Each shows a new API being called with different parameters.

## Example 1: Initial Page Load

**Action:** Page loads
**Console Output:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,
    pageSize: 10,
    sortField: "created",
    sortDirection: "desc"
  },
  filters: {},
  timestamp: "8:44:15 PM"
}
✅ API Response - Returning 10 items (Total: 16)
```

---

## Example 2: Click Page 2

**Action:** Click page number "2" at bottom of table
**Console Output:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 2,                          ← CHANGED from 1 to 2
    pageSize: 10,
    sortField: "created",
    sortDirection: "desc"
  },
  filters: {},
  timestamp: "8:44:17 PM"
}
✅ API Response - Returning 6 items (Total: 16)
```

Notice:
- Only `page` changed from 1 to 2
- All other parameters stayed the same
- Result shows 6 items (page 2 has items 11-16)

---

## Example 3: Change Page Size to 20

**Action:** Find dropdown "Rows per page:", select "20"
**Console Output:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,                          ← Reset to 1
    pageSize: 20,                     ← CHANGED from 10 to 20
    sortField: "created",
    sortDirection: "desc"
  },
  filters: {},
  timestamp: "8:44:19 PM"
}
✅ API Response - Returning 16 items (Total: 16)
```

Notice:
- `pageSize` changed from 10 to 20
- `page` reset to 1 (always happens when page size changes)
- Result shows all 16 items fit on 1 page

---

## Example 4: Click Column Header to Sort by Name

**Action:** Click "Profile Name" column header
**Console Output:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,
    pageSize: 20,
    sortField: "name",                ← CHANGED from "created" to "name"
    sortDirection: "asc"              ← CHANGED from "desc" to "asc"
  },
  filters: {},
  timestamp: "8:44:21 PM"
}
✅ API Response - Returning 16 items (Total: 16)
```

Notice:
- `sortField` changed to "name"
- `sortDirection` changed to "asc" (ascending alphabetically)
- Table rows now sorted: Admin User Profile, API Request Header, AWS Destination Profile...

---

## Example 5: Click Same Header Again to Toggle Sort

**Action:** Click "Profile Name" header again
**Console Output:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,
    pageSize: 20,
    sortField: "name",
    sortDirection: "desc"             ← TOGGLED from "asc" to "desc"
  },
  filters: {},
  timestamp: "8:44:23 PM"
}
✅ API Response - Returning 16 items (Total: 16)
```

Notice:
- Only `sortDirection` changed (toggled)
- Table now sorted reverse alphabetically: Z...A

---

## Example 6: Select Type Filter (DLP)

**Action:** Click Type dropdown, select "DLP"
**Console Output:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,
    pageSize: 20,
    sortField: "name",
    sortDirection: "desc"
  },
  filters: {
    type: "DLP"                       ← NEW FILTER ADDED
  },
  timestamp: "8:44:25 PM"
}
✅ API Response - Returning 2 items (Total: 2)
```

Notice:
- `filters` object now has `type: "DLP"`
- Total reduced from 16 to 2
- Only matching items shown

---

## Example 7: Add Another Filter (Category = Custom)

**Action:** Keep Type=DLP, click Category dropdown, select "Custom"
**Console Output:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,
    pageSize: 20,
    sortField: "name",
    sortDirection: "desc"
  },
  filters: {
    type: "DLP",                      ← STILL ACTIVE
    category: "Custom"                ← NEW FILTER ADDED
  },
  timestamp: "8:44:27 PM"
}
✅ API Response - Returning 0 items (Total: 0)
```

Notice:
- Both filters now active (AND logic)
- Total now 0 (no items are both DLP AND Custom)
- Empty table shown

---

## Example 8: Remove Type Filter (Keep Category=Custom)

**Action:** Click Type dropdown, select blank/none
**Console Output:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,
    pageSize: 20,
    sortField: "name",
    sortDirection: "desc"
  },
  filters: {
    category: "Custom"                ← ONLY THIS FILTER REMAINS
  },
  timestamp: "8:44:29 PM"
}
✅ API Response - Returning 8 items (Total: 8)
```

Notice:
- `type` filter removed from filters object
- Only `category: "Custom"` remains
- Result shows 8 Custom items

---

## Example 9: Type in Search Box (Search for "Profile")

**Action:** Type "Profile" in search box
**Console Output:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,
    pageSize: 20,
    sortField: "name",
    sortDirection: "desc"
  },
  filters: {
    category: "Custom",               ← STILL ACTIVE
    search: "Profile"                 ← NEW SEARCH FILTER
  },
  timestamp: "8:44:31 PM"
}
✅ API Response - Returning 2 items (Total: 2)
```

Notice:
- `search` added to filters
- Combined with existing `category` filter (AND logic)
- Shows 2 Custom items with "Profile" in name, type, or subtype

---

## Example 10: Clear Category Filter, Keep Search

**Action:** Click Category dropdown, select blank/none
**Console Output:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,
    pageSize: 20,
    sortField: "name",
    sortDirection: "desc"
  },
  filters: {
    search: "Profile"                 ← ONLY SEARCH REMAINS
  },
  timestamp: "8:44:33 PM"
}
✅ API Response - Returning 5 items (Total: 5)
```

Notice:
- `category` filter removed
- `search: "Profile"` still active
- Result shows 5 total items (not just Custom) with "Profile" in name/type/subtype

---

## Example 11: Complex Scenario - All Parameters Changing

**Initial State:** Category=Custom, Search="Profile"
**Action:** Click page 2, Sort by Type (ascending), then change page size to 50

**Step 1 - Click Page 2:**
```
📡 API Call - fetchProfiles {
  pagination: { page: 2, pageSize: 20, sortField: "name", sortDirection: "desc" },
  filters: { search: "Profile" },
  timestamp: "8:44:35 PM"
}
✅ API Response - Returning 0 items (Total: 5)
```

**Step 2 - Sort by Type (ascending):**
```
📡 API Call - fetchProfiles {
  pagination: { page: 1, pageSize: 20, sortField: "type", sortDirection: "asc" },
  filters: { search: "Profile" },
  timestamp: "8:44:37 PM"
}
✅ API Response - Returning 5 items (Total: 5)
```

**Step 3 - Change page size to 50:**
```
📡 API Call - fetchProfiles {
  pagination: { page: 1, pageSize: 50, sortField: "type", sortDirection: "asc" },
  filters: { search: "Profile" },
  timestamp: "8:44:39 PM"
}
✅ API Response - Returning 5 items (Total: 5)
```

Notice:
- Each action triggers a new API call
- Parameters update correctly
- Page resets to 1 when necessary
- Filters persist across pagination/sort changes

---

## Key Observations

### ✅ API is Called When:
- Page changes (page number clicked)
- Page size changes (rows per page dropdown)
- Sort field changes (clicking different column header)
- Sort direction changes (clicking same header again)
- Filter is added (selecting from dropdown)
- Filter is removed (selecting blank/none)
- Search term is entered (typing in search box)

### ✅ Parameters Update:
- `page`: Changes when you navigate to different pages
- `pageSize`: Changes when you select different rows/page value
- `sortField`: Changes when you sort by different columns
- `sortDirection`: Toggles when you click same column twice
- `filters`: Updated as you add/remove/modify filters

### ✅ API Response Always Shows:
- Number of items returned for current page
- Total count of all matching items (after filters applied)

### ✅ Loading Happens:
- 300ms simulated delay before response
- "Loading..." message briefly appears in table
- Response logs immediately after delay completes

---

## How to See This Yourself

1. Open `http://localhost:5174/`
2. Press `F12` to open DevTools
3. Go to `Console` tab
4. Perform any action above
5. Watch console for `📡 API Call` and `✅ API Response` logs
6. Compare the logs with examples above to verify parameters are correct

Every interaction triggers a new API call with the correct parameters! 🎉
