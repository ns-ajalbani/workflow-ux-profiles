# Testing Guide - Server-Side Pagination with API Calls

## Quick Start

1. **Dev server is running at**: `http://localhost:5174/`
2. **Open browser DevTools**: Press `F12` and go to the **Console** tab
3. **Perform actions** and watch the console for API call logs

## What You'll See in the Console

Every action will show:
```
📡 API Call - fetchProfiles { pagination: {...}, filters: {...}, timestamp: "..." }
✅ API Response - Returning X items (Total: Y)
```

---

## Test Scenarios

### Test 1: Initial Page Load

**What to do:**
1. Navigate to `http://localhost:5174/`
2. Look at the browser console

**What you'll see:**
- Initial API call with page 1, pageSize 10
- Loading state briefly shows "Loading..." in the table
- 10 rows displayed (items 1-10 of 16 total)
- Console shows: `📡 API Call` → `✅ API Response - Returning 10 items (Total: 16)`

---

### Test 2: Click to Next Page (Page 2)

**What to do:**
1. Scroll to the bottom of the table
2. Click the "Next →" button or click "2" in pagination

**What you'll see:**
- New API call logged: `page: 2`
- Loading "Loading..." appears briefly
- 6 items displayed (rows 11-16 of 16 total)
- Console: `📡 API Call {..., page: 2, ...}`

**Expected in console:**
```
📡 API Call - fetchProfiles {
  pagination: { page: 2, pageSize: 10, ... },
  filters: {},
  timestamp: "X:XX:XX PM"
}
✅ API Response - Returning 6 items (Total: 16)
```

---

### Test 3: Change Rows Per Page

**What to do:**
1. Find the "Rows per page:" dropdown
2. Select "20"

**What you'll see:**
- New API call with `pageSize: 20`
- Page resets to 1
- All 16 items displayed on one page
- Console: `📡 API Call {..., pageSize: 20, page: 1, ...}`

**Expected in console:**
```
📡 API Call - fetchProfiles {
  pagination: { page: 1, pageSize: 20, ... },
  filters: {},
  timestamp: "X:XX:XX PM"
}
✅ API Response - Returning 16 items (Total: 16)
```

---

### Test 4: Sort by Column

**What to do:**
1. Click on the "Profile Name" column header
2. Watch the console

**What you'll see:**
- New API call with `sortField: "name"`, `sortDirection: "asc"`
- Table rows re-order alphabetically
- Items now start with "Admin User Profile"
- Console shows sort parameters

**Expected in console:**
```
📡 API Call - fetchProfiles {
  pagination: { page: 1, pageSize: 10, sortField: "name", sortDirection: "asc" },
  filters: {},
  timestamp: "X:XX:XX PM"
}
✅ API Response - Returning 10 items (Total: 16)
```

**Click the same header again (toggle direction):**
- `sortDirection` changes to `"desc"`
- Table re-orders in reverse

---

### Test 5: Apply a Filter

**What to do:**
1. Find the "Type" filter dropdown
2. Select "DLP"
3. Watch the console

**What you'll see:**
- New API call with `filters: { type: "DLP" }`
- Page resets to 1
- Only 2 matching items shown ("DLP Profiles Configuration", "Fingerprint Rule - Document Match")
- Total count changes to 2
- Console shows filter parameter

**Expected in console:**
```
📡 API Call - fetchProfiles {
  pagination: { page: 1, pageSize: 10, sortField: "created", sortDirection: "desc" },
  filters: { type: "DLP" },
  timestamp: "X:XX:XX PM"
}
✅ API Response - Returning 2 items (Total: 2)
```

---

### Test 6: Apply Multiple Filters

**What to do:**
1. Type = "DLP" (already selected)
2. Find "Category" filter and select "Predefined"
3. Watch the console

**What you'll see:**
- New API call with both filters: `type: "DLP"` AND `category: "Predefined"`
- Results now show 2 items (both are DLP and Predefined)
- Console shows both filters

**Expected in console:**
```
📡 API Call - fetchProfiles {
  pagination: { page: 1, pageSize: 10, sortField: "created", sortDirection: "desc" },
  filters: { type: "DLP", category: "Predefined" },
  timestamp: "X:XX:XX PM"
}
✅ API Response - Returning 2 items (Total: 2)
```

---

### Test 7: Search

**What to do:**
1. Clear any filters (click X or select blank)
2. Find the search box
3. Type "Threat"
4. Watch the console

**What you'll see:**
- New API call with `filters: { search: "Threat" }`
- 2 matching items shown ("Malware Detection Profile", "Remediation Rule")
- Console shows search parameter

**Expected in console:**
```
📡 API Call - fetchProfiles {
  pagination: { page: 1, pageSize: 10, sortField: "created", sortDirection: "desc" },
  filters: { search: "Threat" },
  timestamp: "X:XX:XX PM"
}
✅ API Response - Returning 2 items (Total: 2)
```

---

### Test 8: Complex Scenario - Everything Together

**What to do:**
1. Search: Type "Profile"
2. Category: Select "Custom"
3. Change sort: Click "Created" header (ascending)
4. Go to page 2
5. Watch console for each action

**What you'll see in console after each step:**

**Step 1 - Search:**
```
📡 API Call - fetchProfiles {
  filters: { search: "Profile" },
  ...
}
✅ API Response - Returning X items (Total: Y)
```

**Step 2 - Add Category Filter:**
```
📡 API Call - fetchProfiles {
  filters: { search: "Profile", category: "Custom" },
  ...
}
✅ API Response - Returning X items (Total: Y)
```

**Step 3 - Sort:**
```
📡 API Call - fetchProfiles {
  pagination: { sortField: "created", sortDirection: "asc" },
  filters: { search: "Profile", category: "Custom" },
  ...
}
✅ API Response - Returning X items (Total: Y)
```

**Step 4 - Page 2:**
```
📡 API Call - fetchProfiles {
  pagination: { page: 2, sortField: "created", sortDirection: "asc" },
  filters: { search: "Profile", category: "Custom" },
  ...
}
✅ API Response - Returning X items (Total: Y)
```

---

## Key Points to Verify

- ✅ **Each action triggers a new API call** (console shows new log entry)
- ✅ **Loading indicator appears** ("Loading..." in table briefly)
- ✅ **API parameters change** (page, pageSize, sortField, sortDirection, filters)
- ✅ **Table updates with correct data** (shows only results matching filters/page)
- ✅ **Total count updates** (reflects filtered results, not all data)
- ✅ **Pagination resets on filter change** (goes to page 1)
- ✅ **Multiple filters work together** (AND logic)
- ✅ **Search works** (matches name, type, subtype)
- ✅ **Sorting works** (ascending/descending toggle)
- ✅ **All parameters are sent correctly** (check console logs)

---

## Troubleshooting

**Not seeing console logs?**
- Make sure you're in the Console tab (not Network, Elements, etc.)
- Try refreshing the page with F5
- Check that the app is running on `http://localhost:5174/`

**No "Loading..." message?**
- The API delay is 300ms, so it's quick
- Try scrolling to the table while clicking to see it better
- Network issues in DevTools (Slow 3G) will make it more visible

**API not being called?**
- Open DevTools console first
- Then perform an action
- New API logs should appear immediately

**Table not updating?**
- Check browser console for errors (red text)
- Make sure you're seeing "✅ API Response" message
- Try clicking a page button to trigger a new API call

---

## Summary

Every interaction with pagination, sorting, or filters triggers a new API call:

| Action | Triggers API? | Console Output |
|--------|---------------|-----------------|
| Click page number | ✅ Yes | `page: X` changes |
| Click Previous/Next | ✅ Yes | `page` increases/decreases |
| Change rows/page | ✅ Yes | `pageSize` changes, `page` resets to 1 |
| Click column header | ✅ Yes | `sortField` changes |
| Click header again | ✅ Yes | `sortDirection` toggles |
| Select filter | ✅ Yes | `filters` object updated |
| Type in search | ✅ Yes | `filters.search` added |
| Clear filter | ✅ Yes | Filter removed from `filters` object |

**The mock API is working correctly when you see these console messages for every action!**
