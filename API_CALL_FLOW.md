# API Call Flow - Server-Side Pagination

## Overview

Each page change and filter change now triggers a new API call to `fetchProfiles()`. The API logs all calls to the browser console so you can verify they're being made.

## How It Works

### 1. Initial Load
When the component mounts, it automatically calls the API with:
- Page: 1
- Page Size: 10
- Sort Field: "created"
- Sort Direction: "desc"

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
  timestamp: "8:43:45 PM"
}
✅ API Response - Returning 10 items (Total: 16)
```

### 2. Pagination Changes

**When you click a page number or Previous/Next button:**
- The component calls the API with the new page number
- Other parameters (pageSize, sortField, sortDirection, filters) remain the same

**Example: Clicking page 2:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 2,              // ← Changed from 1
    pageSize: 10,
    sortField: "created",
    sortDirection: "desc"
  },
  filters: {},
  timestamp: "8:43:47 PM"
}
✅ API Response - Returning 6 items (Total: 16)
```

### 3. Page Size Changes

**When you change "Rows per page":**
- The component resets to page 1
- Calls the API with the new pageSize
- Page is automatically reset to 1

**Example: Changing to 20 rows per page:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,              // ← Reset to 1
    pageSize: 20,         // ← Changed from 10
    sortField: "created",
    sortDirection: "desc"
  },
  filters: {},
  timestamp: "8:43:50 PM"
}
✅ API Response - Returning 16 items (Total: 16)
```

### 4. Sorting Changes

**When you click a column header:**
- The component calls the API with the new sortField
- If clicking the same header, the direction toggles
- Page resets to 1 on first sort change

**Example: Clicking "Profile Name" header:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,
    pageSize: 10,
    sortField: "name",    // ← Changed from "created"
    sortDirection: "asc"  // ← Changed from "desc"
  },
  filters: {},
  timestamp: "8:43:52 PM"
}
✅ API Response - Returning 10 items (Total: 16)
```

**Clicking "Profile Name" header again (toggle direction):**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,
    pageSize: 10,
    sortField: "name",
    sortDirection: "desc" // ← Toggled
  },
  filters: {},
  timestamp: "8:43:54 PM"
}
✅ API Response - Returning 10 items (Total: 16)
```

### 5. Filter Changes

**When you select a filter:**
- The component resets to page 1
- Calls the API with the filter applied
- Only the active filters are sent (undefined filters are omitted)

**Example: Selecting Type = "DLP":**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,
    pageSize: 10,
    sortField: "created",
    sortDirection: "desc"
  },
  filters: {
    type: "DLP"  // ← New filter applied
  },
  timestamp: "8:43:56 PM"
}
✅ API Response - Returning 2 items (Total: 2)
```

### 6. Multiple Filters

**When multiple filters are applied:**
- All active filters are sent to the API
- API applies them cumulatively (AND logic)
- Page resets to 1

**Example: Type = "DLP" AND Category = "Predefined":**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,
    pageSize: 10,
    sortField: "created",
    sortDirection: "desc"
  },
  filters: {
    type: "DLP",           // ← First filter
    category: "Predefined" // ← Second filter (AND)
  },
  timestamp: "8:43:58 PM"
}
✅ API Response - Returning 2 items (Total: 2)
```

### 7. Search Changes

**When you type in the search box:**
- The component resets to page 1
- Calls the API with the search term
- Search checks: name, type, and subtype fields

**Example: Searching for "Threat":**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 1,
    pageSize: 10,
    sortField: "created",
    sortDirection: "desc"
  },
  filters: {
    search: "Threat"  // ← Search term
  },
  timestamp: "8:44:00 PM"
}
✅ API Response - Returning 2 items (Total: 2)
```

### 8. Complex Scenario

**Example: Search + Filter + Page 2 + Sort:**
```
📡 API Call - fetchProfiles {
  pagination: {
    page: 2,
    pageSize: 10,
    sortField: "name",
    sortDirection: "asc"
  },
  filters: {
    category: "Custom",
    search: "Profile"
  },
  timestamp: "8:44:02 PM"
}
✅ API Response - Returning X items (Total: Y)
```

## Verification Steps

To verify API calls are happening, open the browser's Developer Console:

1. **Open Developer Tools**: F12 or Right-click → Inspect
2. **Go to Console tab**
3. Interact with the app:
   - Click page numbers → See new API calls logged
   - Change rows per page → See API call with new pageSize
   - Click column headers to sort → See API call with new sortField
   - Select filters → See API call with filter parameters
   - Type in search → See API call with search term
   - Wait for "Loading..." to disappear → Indicates API response received

## Parameters Sent to API

### Pagination Parameters
- `page`: Current page number (1-based)
- `pageSize`: Rows per page (10, 20, 50, or 100)
- `sortField`: Column to sort by (name, type, subtype, category, created)
- `sortDirection`: "asc" or "desc"

### Filter Parameters (only if active)
- `type`: Selected profile type
- `subtype`: Selected profile subtype
- `category`: Selected category (Predefined/Custom)
- `search`: Search term (searches name, type, subtype)

## API Response Format

```typescript
{
  data: Profile[],           // Array of profile items for current page
  total: number,             // Total count of all matching profiles
  page: number,              // Current page number
  pageSize: number           // Rows per page
}
```

**Example Response for Page 1:**
```
{
  data: [
    { id: '1', name: 'DLP Profiles Configuration', ... },
    { id: '2', name: 'Fingerprint Rule - Document Match', ... },
    ...
  ],
  total: 16,
  page: 1,
  pageSize: 10
}
```

## Network Latency Simulation

The mock API includes a 300ms delay to simulate real-world network latency. This causes the "Loading..." message to briefly appear, which you'll see in the table when making API calls.

## Converting to Real Backend

To use a real backend API, replace the `fetchProfiles()` function in `src/api/mockApi.ts`:

```typescript
export async function fetchProfiles(
  pagination: PaginationParams,
  filters: FilterParams
): Promise<ApiResponse<Profile>> {
  const params = new URLSearchParams({
    page: pagination.page.toString(),
    pageSize: pagination.pageSize.toString(),
    sortField: pagination.sortField,
    sortDirection: pagination.sortDirection,
  })

  // Add active filters only
  if (filters.type) params.append('type', filters.type)
  if (filters.subtype) params.append('subtype', filters.subtype)
  if (filters.category) params.append('category', filters.category)
  if (filters.search) params.append('search', filters.search)

  const response = await fetch(`/api/profiles?${params}`)
  if (!response.ok) throw new Error('Failed to fetch profiles')
  return response.json()
}
```

Your backend would receive requests like:
```
GET /api/profiles?page=1&pageSize=10&sortField=created&sortDirection=desc&category=Custom&search=Threat
```

And should return the same `ApiResponse<Profile>` format.
