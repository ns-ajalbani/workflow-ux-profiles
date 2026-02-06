# Real API Testing Guide - Network Tab Verification

## ✅ Setup Complete

Both servers are now running:

1. **Frontend Dev Server**: http://localhost:5174/ (Vite)
2. **Mock API Server**: http://localhost:3000/api (Express)

## How It Works Now

Every page change and filter change triggers a **real HTTP request** to the backend API.

### Network Flow

```
User Action (click page, filter, sort)
         ↓
React Component State Changes
         ↓
useEffect Hook Triggered
         ↓
fetchProfiles() Called
         ↓
fetch() Makes HTTP GET Request to http://localhost:3000/api/profiles?...
         ↓
Express Server Receives Request
         ↓
Server Processes Filters, Sorting, Pagination
         ↓
Server Returns JSON Response
         ↓
React Updates Table with Results
```

## Testing in Browser

### 1. Open the App

Go to: **http://localhost:5174/**

### 2. Open DevTools Network Tab

- Press: **F12**
- Click: **Network** tab
- Keep this tab open while testing

### 3. Perform Actions and Watch Network Tab

Each action will show a new HTTP request:

#### Test 1: Click to Page 2
- **Action**: Click page "2" button at bottom
- **What you'll see in Network tab**:
  - New GET request appears
  - URL: `http://localhost:3000/api/profiles?page=2&pageSize=10&sortField=created&sortDirection=desc`
  - Status: 200 OK
  - Response shows 6 items

#### Test 2: Change Rows Per Page
- **Action**: Select "20" from "Rows per page" dropdown
- **What you'll see in Network tab**:
  - New GET request appears
  - URL: `...&page=1&pageSize=20&...` (page resets to 1)
  - Status: 200 OK
  - Response shows all 16 items

#### Test 3: Sort by Name Column
- **Action**: Click "Profile Name" column header
- **What you'll see in Network tab**:
  - New GET request appears
  - URL: `...&sortField=name&sortDirection=asc`
  - Status: 200 OK
  - Response sorted by name

#### Test 4: Toggle Sort Direction
- **Action**: Click "Profile Name" header again
- **What you'll see in Network tab**:
  - New GET request appears
  - URL: `...&sortDirection=desc` (toggled)
  - Status: 200 OK
  - Response sorted descending

#### Test 5: Select Filter
- **Action**: Click Type dropdown, select "DLP"
- **What you'll see in Network tab**:
  - New GET request appears
  - URL: `...&type=DLP` (new parameter added)
  - Status: 200 OK
  - Response shows 2 matching items

#### Test 6: Add Another Filter
- **Action**: Keep Type=DLP, click Category dropdown, select "Predefined"
- **What you'll see in Network tab**:
  - New GET request appears
  - URL: `...&type=DLP&category=Predefined`
  - Status: 200 OK
  - Response shows matching items with both filters applied

#### Test 7: Search
- **Action**: Clear filters, type "Threat" in search box
- **What you'll see in Network tab**:
  - New GET request appears
  - URL: `...&search=Threat`
  - Status: 200 OK
  - Response shows 2 matching items

#### Test 8: Clear Filter
- **Action**: Click X on search box or select blank
- **What you'll see in Network tab**:
  - New GET request appears
  - URL: `...` (search parameter removed)
  - Status: 200 OK
  - Response shows all items again

## API Request Format

Every request follows this pattern:

```
GET http://localhost:3000/api/profiles?page=1&pageSize=10&sortField=created&sortDirection=desc[&type=...][&category=...][&search=...]
```

### Query Parameters

| Parameter | Example | Required |
|-----------|---------|----------|
| page | 1 | Yes |
| pageSize | 10 | Yes |
| sortField | created | Yes |
| sortDirection | desc | Yes |
| type | DLP | No (only if selected) |
| subtype | DLP Profiles | No (only if selected) |
| category | Predefined | No (only if selected) |
| search | Profile | No (only if selected) |

## API Response Format

Every response returns JSON:

```json
{
  "data": [
    {
      "id": "1",
      "name": "DLP Profiles Configuration",
      "type": "DLP",
      "subtype": "DLP Profiles",
      "category": "Predefined",
      "created": "2024-01-15"
    }
  ],
  "total": 16,
  "page": 1,
  "pageSize": 10
}
```

## Console Output

While you test, watch the browser console and the API server console:

### Browser Console (F12 → Console tab)

You'll see:
```
📡 API Call - GET http://localhost:3000/api/profiles?page=1&pageSize=10&...
✅ API Response - Returning 10 items (Total: 16)
```

### Server Console

You'll see:
```
📡 Received API Request
   URL: GET /api/profiles?page=1&pageSize=10&sortField=created&sortDirection=desc
   Filters: type=none, category=none, search=none
   Results after filtering: 16 items
   Pagination: page=1, pageSize=10, returning 10 items
✅ API Response sent
```

## Network Tab Details

In the Network tab, click on any API request to see details:

### Headers Tab
- **Request URL**: `http://localhost:3000/api/profiles?...`
- **Request Method**: `GET`
- **Status Code**: `200`

### Preview Tab
Shows the JSON response formatted

### Response Tab
Shows the raw JSON response

## Verification Checklist

✅ **Each action makes a new HTTP request**
- [ ] Click page number → New request in Network tab
- [ ] Click Previous/Next → New request
- [ ] Change rows/page → New request
- [ ] Click column header → New request
- [ ] Click header again → New request (different sortDirection)
- [ ] Select filter → New request
- [ ] Add another filter → New request
- [ ] Type in search → New request
- [ ] Clear filter → New request

✅ **Request parameters are correct**
- [ ] `page` parameter changes with page navigation
- [ ] `pageSize` parameter changes with dropdown selection
- [ ] `sortField` parameter matches selected column
- [ ] `sortDirection` toggles between "asc" and "desc"
- [ ] `type` parameter added when filter selected
- [ ] `category` parameter added when filter selected
- [ ] `search` parameter added when search term entered
- [ ] Inactive filters NOT in URL

✅ **Response is correct**
- [ ] Returns correct number of items
- [ ] Total count reflects filtered results
- [ ] Page/pageSize in response match request
- [ ] Data matches selected page

✅ **Table updates correctly**
- [ ] Table shows new data after each request
- [ ] Total count updates on filter changes
- [ ] Loading state appears while request is in progress
- [ ] Pagination controls update correctly

## Troubleshooting

### No Network Requests Showing?

1. Check Network tab filter:
   - Click the filter icon
   - Make sure no filters are blocking XHR requests
   - XHR = XMLHttpRequest/Fetch requests

2. Clear the Network tab:
   - Click the trash icon to clear previous requests
   - Then perform an action

3. Check if API server is running:
   - Look at the terminal where you started the server
   - Should show "Mock API Server Running"
   - If not, the server crashed (check error messages)

### Getting 404 or Connection Refused?

1. Check API server is running on port 3000:
   ```bash
   lsof -i :3000
   ```

2. Check frontend is running on port 5174:
   ```bash
   lsof -i :5174
   ```

3. Restart the servers if needed

### Getting CORS Error?

The CORS is already configured in the server, but if you see CORS errors:
- The API server may have crashed
- Restart the server: `node server.js`

## Real Backend Integration

When you want to use a real backend:

1. Update the API endpoint in `src/api/mockApi.ts`:
   ```typescript
   const API_BASE_URL = 'https://your-api.com/api'
   ```

2. Make sure your backend returns the same response format:
   ```json
   {
     "data": [...],
     "total": number,
     "page": number,
     "pageSize": number
   }
   ```

3. That's it! Everything else works the same.

## Summary

✅ **Real HTTP requests** are now being made to the API
✅ **You can see requests in the Network tab** (F12 → Network)
✅ **Server processes filters, sorting, pagination**
✅ **Frontend displays results from server**
✅ **Each action triggers a new API call**

Start testing now! Open http://localhost:5174/ and check the Network tab as you interact with the app. 🎉
