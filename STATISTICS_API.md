# Statistics API Documentation

## Overview
The statistics API provides real-time data from the database to display on the landing page and admin dashboard.

## Endpoints

### 1. Landing Page Statistics
**GET** `/api/stats/landing`

**Access:** Public (No authentication required)

**Description:** Fetches statistics for the landing page hero section

**Response:**
```json
{
  "success": true,
  "totalStudents": 10245,
  "totalEvents": 523,
  "totalInstitutions": 87,
  "totalHours": 51200,
  "participations": 6400
}
```

**Data Sources:**
- `totalStudents`: Count of users with role 'student' from User collection
- `totalEvents`: Total count of events from Event collection
- `totalInstitutions`: Unique colleges from student profiles (User.college field)
- `totalHours`: Calculated from event durations or participations × 8 hours average
- `participations`: Count of approved participations

### 2. Dashboard Statistics
**GET** `/api/stats/dashboard`

**Access:** Private (Admin only - requires authentication)

**Description:** Fetches detailed statistics for admin dashboard

**Response:**
```json
{
  "success": true,
  "students": {
    "total": 10245,
    "recent": 342
  },
  "faculty": {
    "total": 45
  },
  "events": {
    "total": 523,
    "active": 12,
    "completed": 511
  },
  "participations": {
    "total": 6400,
    "approved": 5890,
    "pending": 510
  }
}
```

## Frontend Integration

### Landing Page Component
Location: `frontend/src/pages/Landing.jsx`

**How it works:**
1. Component mounts and calls `/api/stats/landing`
2. Receives real data from database
3. Animates counters from 0 to actual values over 2 seconds
4. Displays with icons, progress bars, and hover effects

**Code Example:**
```javascript
useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats/landing');
      if (response.ok) {
        const data = await response.json();
        setStats({
          volunteers: data.totalStudents,
          events: data.totalEvents,
          institutions: data.totalInstitutions,
          hours: data.totalHours
        });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };
  fetchStats();
}, []);
```

## Database Collections Used

### User Collection
```javascript
{
  role: 'student' | 'faculty' | 'admin',
  college: String,
  createdAt: Date,
  // ... other fields
}
```

### Event Collection
```javascript
{
  title: String,
  status: 'active' | 'completed' | 'cancelled',
  duration: Number, // in hours
  // ... other fields
}
```

### Participation Collection
```javascript
{
  student: ObjectId,
  event: ObjectId,
  status: 'pending' | 'approved' | 'rejected',
  // ... other fields
}
```

## Calculations

### Total Hours of Service
Two methods are used, and the maximum is returned:

1. **From Events:**
   ```javascript
   totalHours = sum of all event.duration
   ```

2. **From Participations:**
   ```javascript
   estimatedHours = approvedParticipations × 8 hours
   ```

### Unique Institutions
```javascript
institutions = User.distinct('college', { role: 'student' })
totalInstitutions = institutions.filter(college => college && college.trim() !== '').length
```

## Error Handling

### Frontend Fallback
If the API call fails, the frontend uses default values:
```javascript
{
  volunteers: 10000,
  events: 500,
  institutions: 100,
  hours: 50000
}
```

### Backend Error Response
```json
{
  "success": false,
  "message": "Error fetching statistics",
  "error": "Error message details"
}
```

## Performance Considerations

1. **Caching:** Consider implementing Redis caching for statistics that don't change frequently
2. **Indexing:** Ensure database indexes on:
   - `User.role`
   - `User.college`
   - `Event.status`
   - `Participation.status`

3. **Query Optimization:** Use `countDocuments()` instead of `find().count()` for better performance

## Future Enhancements

1. **Real-time Updates:** Use Socket.IO to push statistics updates
2. **Historical Data:** Track statistics over time for trend analysis
3. **Filtering:** Add date range filters for statistics
4. **Caching:** Implement Redis for frequently accessed statistics
5. **Analytics:** Add more detailed breakdowns by:
   - Institution
   - Event type
   - Time period
   - Geographic location

## Testing

### Manual Testing
```bash
# Test landing page stats
curl http://localhost:5000/api/stats/landing

# Test dashboard stats (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/stats/dashboard
```

### Expected Behavior
- Statistics should update when new students register
- Event count should increase when events are created
- Hours should accumulate as events are completed
- Institutions count should reflect unique colleges

## Troubleshooting

### Issue: Statistics show 0
**Solution:** Check if database has data:
```javascript
// In MongoDB shell or Compass
db.users.countDocuments({ role: 'student' })
db.events.countDocuments()
```

### Issue: API returns 500 error
**Solution:** Check backend logs for MongoDB connection issues or model errors

### Issue: Frontend shows fallback values
**Solution:** 
1. Check if backend is running
2. Verify API endpoint is accessible
3. Check browser console for CORS or network errors

---

**Last Updated:** November 2024
**Version:** 1.0
