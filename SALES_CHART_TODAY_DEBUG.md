# Sales Chart "Today" Debug Analysis

## 🐛 **Issue**: 
When selecting "Today", the chart shows "Monday", "Tuesday" instead of hourly data like "09:00", "10:00"

## 🔍 **Root Cause Analysis:**

### 1. **Expected Behavior:**
```
User selects "Today"
     ↓
API called: /sales/chart?period=today
     ↓
OrderService.getChartSeries() with period='today'
     ↓  
Carbon format: $createdAt->format('H:i')
     ↓
Returns: ["09:00", "10:00", "11:00", "14:00"]
```

### 2. **Actual Behavior:**
```
User selects "Today"
     ↓
Shows: ["Monday", "Tuesday", "Wednesday"]
     ↓
This suggests period='week' is being used
```

## 🔍 **Potential Causes:**

### 1. **Caching Issue (Most Likely)**
- RTK Query is caching the previous "week" response
- When switching to "today", it shows cached data
- **Solution**: Force refetch with different cache keys

### 2. **No Data for Today**
- If there are no orders for today, empty result
- Might be showing fallback/cached data
- **Solution**: Check if orders exist for today

### 3. **Frontend State Issue**
- Range state not updating properly
- Component not re-rendering with new range
- **Solution**: Check React state updates

### 4. **API Parameter Mapping**
- ❌ **Ruled out**: Code shows correct mapping `period=${formData.range}`

## 🧪 **Debug Steps Added:**

### Backend Logging:
```php
Log::info('OrderService returned data', [
    'period_requested' => $period,
    'period_returned' => $fullReport['period'] ?? 'not_set',
    'chartSeries_keys' => array_keys($fullReport['chartSeries'] ?? []),
]);
```

### Frontend Logging:
```typescript
console.log('🔥 Sales Chart API: Calling /sales/chart?period=' + reportFilterRange);
console.log('📊 Chart Series Keys:', Object.keys(chartSeries || {}));
```

## 🔧 **Fixes Applied:**

### 1. **RTK Query Cache Fix:**
```typescript
useFetchSalesChartQuery(
    { range: reportFilterRange ?? 'week' },
    {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        skip: false, // Force refetch when range changes
    }
);
```

### 2. **Enhanced Debug Logging:**
- Backend logs show exactly what period is requested/returned
- Frontend logs show the API call and response keys
- Chart series keys will reveal if showing hours vs days

## 🧪 **Testing Instructions:**

### 1. **Check Browser Console:**
```
1. Open DevTools → Console
2. Select "Today" in chart dropdown  
3. Look for logs:
   🔥 Sales Chart API: Calling /sales/chart?period=today
   📊 Chart Series Keys: ["09:00", "10:00", "11:00"] ✅
   OR
   📊 Chart Series Keys: ["Monday", "Tuesday"] ❌
```

### 2. **Check Laravel Logs:**
```bash
tail -f storage/logs/laravel.log | grep "Sales Chart API"
```
Should show:
```
[INFO] Sales Chart API called {"period":"today","endpoint":"/sales/chart"}
[INFO] OrderService returned data {"period_requested":"today","chartSeries_keys":["09:00","10:00"]}
```

### 3. **Check Network Tab:**
```
1. DevTools → Network tab
2. Select "Today" 
3. Should see: GET /api/v1/seller/sales/chart?period=today
4. Response should have hourly keys in chartSeries
```

## 💡 **Quick Workaround:**

If the issue persists, try:
1. **Clear browser cache**: Ctrl+F5
2. **Force refresh**: Click "Today" twice
3. **Check data**: Ensure there are orders for today in the database

## ✅ **Expected Fix Result:**

After applying the fixes:
- Selecting "Today" should show: `["00:00", "09:00", "14:00", "18:00"]`
- Not: `["Monday", "Tuesday", "Wednesday"]`
- Console should log the correct period and hourly keys

---

**Next Step**: Test the fixes and check the debug logs to confirm the root cause.