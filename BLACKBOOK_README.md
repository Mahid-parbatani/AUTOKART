# Blackbook System Documentation

## Overview

The Blackbook System is a comprehensive security and access control system for the AUTOKART marketplace. It provides advanced blacklisting capabilities for users, IP addresses, and JWT tokens, along with detailed logging and administrative management tools.

## Features

### Core Functionality
- **User Blacklisting**: Block specific users from accessing the system
- **IP Address Blacklisting**: Block specific IP addresses or ranges
- **Token Blacklisting**: Invalidate JWT tokens (enhanced logout functionality)
- **Expiration Support**: Set automatic expiration dates for blacklist entries
- **Comprehensive Logging**: Track all blacklist actions with detailed audit trails
- **Admin Management Interface**: Web-based interface for managing blacklists
- **Bulk Operations**: Blacklist multiple users or IPs at once
- **Statistics Dashboard**: View blacklist statistics and activity

### Security Features
- **Multi-layer Protection**: Checks user, IP, and token blacklists on every request
- **Automatic Cleanup**: Removes expired entries automatically
- **Audit Trail**: Complete logging of all blacklist operations
- **Admin Controls**: Secure admin-only access to blacklist management

## Architecture

### Backend Components

#### Models
- `BlacklistedUser`: Stores blacklisted user information
- `BlacklistedIP`: Stores blacklisted IP addresses with location data
- `BlacklistedToken`: Enhanced token blacklisting with metadata
- `BlacklistLog`: Comprehensive audit logging

#### Services
- `blackbookService.ts`: Core business logic for all blacklist operations
- Enhanced `userService.ts`: Updated logout functionality
- Enhanced `jwtAuth.ts`: Multi-layer blacklist checking

#### Controllers
- `blackbookController.ts`: REST API endpoints for blacklist management

#### Routes
- `/blackbook/*`: Complete REST API for blacklist operations

### Frontend Components

#### BlackbookManager Component
- Tabbed interface for managing different blacklist types
- Real-time data loading and updates
- Form validation and error handling
- Responsive design with modern UI

## API Endpoints

### User Management
- `POST /blackbook/users/blacklist` - Blacklist a user
- `POST /blackbook/users/unblacklist` - Remove user from blacklist
- `GET /blackbook/users/check/:userId` - Check if user is blacklisted
- `GET /blackbook/users` - Get all blacklisted users (paginated)
- `POST /blackbook/users/bulk` - Bulk blacklist users

### IP Management
- `POST /blackbook/ips/blacklist` - Blacklist an IP address
- `POST /blackbook/ips/unblacklist` - Remove IP from blacklist
- `GET /blackbook/ips/check/:ipAddress` - Check if IP is blacklisted
- `GET /blackbook/ips` - Get all blacklisted IPs (paginated)
- `POST /blackbook/ips/bulk` - Bulk blacklist IPs

### Token Management
- `POST /blackbook/tokens/blacklist` - Blacklist a token
- `GET /blackbook/tokens/check/:token` - Check if token is blacklisted

### Statistics & Logs
- `GET /blackbook/stats` - Get blacklist statistics
- `GET /blackbook/logs` - Get activity logs (paginated)
- `POST /blackbook/cleanup` - Manually trigger cleanup

## Usage Examples

### Blacklisting a User
```javascript
const response = await fetch('/blackbook/users/blacklist', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userId: 'user123',
        reason: 'Suspicious activity',
        expiresAt: '2024-12-31T23:59:59Z' // Optional
    })
});
```

### Blacklisting an IP Address
```javascript
const response = await fetch('/blackbook/ips/blacklist', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        ipAddress: '192.168.1.100',
        reason: 'Multiple failed login attempts',
        country: 'US',
        city: 'New York',
        expiresAt: '2024-12-31T23:59:59Z' // Optional
    })
});
```

### Checking Blacklist Status
```javascript
const response = await fetch('/blackbook/users/check/user123', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
const { isBlacklisted } = await response.json();
```

## Database Schema

### BlacklistedUser
```javascript
{
    userId: String (required, unique),
    email: String (required, unique),
    reason: String (required),
    blacklistedBy: String (required),
    blacklistedAt: Date (default: now),
    expiresAt: Date (optional),
    isActive: Boolean (default: true)
}
```

### BlacklistedIP
```javascript
{
    ipAddress: String (required, unique),
    reason: String (required),
    blacklistedBy: String (required),
    blacklistedAt: Date (default: now),
    expiresAt: Date (optional),
    isActive: Boolean (default: true),
    country: String (optional),
    city: String (optional)
}
```

### BlacklistedToken
```javascript
{
    token: String (required, unique),
    userId: String (optional),
    reason: String (required),
    blacklistedAt: Date (default: now),
    expiresAt: Date (optional),
    isActive: Boolean (default: true)
}
```

### BlacklistLog
```javascript
{
    action: String (enum: ['ADD', 'REMOVE', 'UPDATE']),
    entityType: String (enum: ['USER', 'IP', 'TOKEN']),
    entityId: String (required),
    reason: String (required),
    performedBy: String (required),
    timestamp: Date (default: now),
    details: Object (optional)
}
```

## Security Considerations

### Authentication
- All blacklist management endpoints require valid JWT authentication
- Admin privileges should be implemented for production use
- Consider implementing role-based access control

### Data Protection
- Sensitive information is logged for audit purposes
- IP addresses are stored for security monitoring
- Consider data retention policies for compliance

### Performance
- Database indexes are optimized for common queries
- Pagination is implemented for large datasets
- Cleanup scripts prevent database bloat

## Maintenance

### Automatic Cleanup
The system includes automatic cleanup functionality:
- Expired entries are automatically deactivated
- Manual cleanup can be triggered via API
- Scheduled cleanup can be set up using cron jobs

### Monitoring
- Monitor blacklist statistics regularly
- Review audit logs for suspicious activity
- Set up alerts for unusual blacklist patterns

## Installation & Setup

1. **Backend Setup**:
   ```bash
   cd server
   npm install
   # The blackbook models and services are already integrated
   ```

2. **Frontend Setup**:
   ```bash
   cd client
   npm install
   # The BlackbookManager component is already integrated
   ```

3. **Database Migration**:
   The blackbook collections will be created automatically when the server starts.

4. **Cleanup Script** (Optional):
   ```bash
   # Run cleanup manually
   node server/src/scripts/cleanupBlacklist.js
   
   # Or set up a cron job for automatic cleanup
   0 2 * * * node /path/to/server/src/scripts/cleanupBlacklist.js
   ```

## Configuration

### Environment Variables
No additional environment variables are required. The system uses the existing database connection and JWT configuration.

### Customization
- Modify blacklist reasons and categories as needed
- Adjust expiration policies based on security requirements
- Customize the admin interface for specific use cases

## Troubleshooting

### Common Issues
1. **Blacklist not working**: Check if the user has admin privileges
2. **Performance issues**: Ensure database indexes are properly created
3. **Memory usage**: Run cleanup scripts regularly to remove expired entries

### Debug Mode
Enable detailed logging by setting the log level in the application configuration.

## Future Enhancements

- **Geolocation Integration**: Enhanced IP blocking with geographic regions
- **Machine Learning**: Automated threat detection and blacklisting
- **API Rate Limiting**: Integration with rate limiting systems
- **Webhook Support**: Real-time notifications for blacklist events
- **Advanced Analytics**: Detailed reporting and trend analysis

## Support

For issues or questions regarding the blackbook system:
1. Check the audit logs for error details
2. Review the API documentation
3. Monitor system performance metrics
4. Contact the development team for advanced troubleshooting

---

**Note**: This blackbook system is designed for production use and includes comprehensive security features. Ensure proper testing and configuration before deploying to production environments.