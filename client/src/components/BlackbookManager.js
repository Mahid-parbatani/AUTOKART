import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../App';

const SERVER_URL = 'http://localhost:4000/';

function BlackbookManager() {
    const { token } = useContext(TokenContext);
    const [activeTab, setActiveTab] = useState('users');
    const [blacklistedUsers, setBlacklistedUsers] = useState([]);
    const [blacklistedIPs, setBlacklistedIPs] = useState([]);
    const [blacklistLogs, setBlacklistLogs] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form states
    const [blacklistUserForm, setBlacklistUserForm] = useState({
        userId: '',
        reason: '',
        expiresAt: ''
    });
    const [blacklistIPForm, setBlacklistIPForm] = useState({
        ipAddress: '',
        reason: '',
        expiresAt: '',
        country: '',
        city: ''
    });

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            if (activeTab === 'users') {
                const response = await fetch(`${SERVER_URL}blackbook/users`, { headers });
                const data = await response.json();
                setBlacklistedUsers(data.users || []);
            } else if (activeTab === 'ips') {
                const response = await fetch(`${SERVER_URL}blackbook/ips`, { headers });
                const data = await response.json();
                setBlacklistedIPs(data.ips || []);
            } else if (activeTab === 'logs') {
                const response = await fetch(`${SERVER_URL}blackbook/logs`, { headers });
                const data = await response.json();
                setBlacklistLogs(data.logs || []);
            } else if (activeTab === 'stats') {
                const response = await fetch(`${SERVER_URL}blackbook/stats`, { headers });
                const data = await response.json();
                setStats(data);
            }
        } catch (err) {
            setError('Failed to load data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBlacklistUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch(`${SERVER_URL}blackbook/users/blacklist`, {
                method: 'POST',
                headers,
                body: JSON.stringify(blacklistUserForm)
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('User blacklisted successfully');
                setBlacklistUserForm({ userId: '', reason: '', expiresAt: '' });
                loadData();
            } else {
                setError(data.message || 'Failed to blacklist user');
            }
        } catch (err) {
            setError('Failed to blacklist user: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBlacklistIP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch(`${SERVER_URL}blackbook/ips/blacklist`, {
                method: 'POST',
                headers,
                body: JSON.stringify(blacklistIPForm)
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('IP address blacklisted successfully');
                setBlacklistIPForm({ ipAddress: '', reason: '', expiresAt: '', country: '', city: '' });
                loadData();
            } else {
                setError(data.message || 'Failed to blacklist IP');
            }
        } catch (err) {
            setError('Failed to blacklist IP: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUnblacklistUser = async (userId) => {
        if (!window.confirm('Are you sure you want to unblacklist this user?')) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch(`${SERVER_URL}blackbook/users/unblacklist`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ userId, reason: 'Admin unblacklisted' })
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('User unblacklisted successfully');
                loadData();
            } else {
                setError(data.message || 'Failed to unblacklist user');
            }
        } catch (err) {
            setError('Failed to unblacklist user: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUnblacklistIP = async (ipAddress) => {
        if (!window.confirm('Are you sure you want to unblacklist this IP address?')) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch(`${SERVER_URL}blackbook/ips/unblacklist`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ ipAddress, reason: 'Admin unblacklisted' })
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('IP address unblacklisted successfully');
                loadData();
            } else {
                setError(data.message || 'Failed to unblacklist IP');
            }
        } catch (err) {
            setError('Failed to unblacklist IP: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString();
    };

    const renderUsersTab = () => (
        <div>
            <h3>Blacklist User</h3>
            <form onSubmit={handleBlacklistUser} style={styles.form}>
                <input
                    type="text"
                    placeholder="User ID"
                    value={blacklistUserForm.userId}
                    onChange={(e) => setBlacklistUserForm({...blacklistUserForm, userId: e.target.value})}
                    required
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Reason"
                    value={blacklistUserForm.reason}
                    onChange={(e) => setBlacklistUserForm({...blacklistUserForm, reason: e.target.value})}
                    required
                    style={styles.input}
                />
                <input
                    type="datetime-local"
                    placeholder="Expires At (optional)"
                    value={blacklistUserForm.expiresAt}
                    onChange={(e) => setBlacklistUserForm({...blacklistUserForm, expiresAt: e.target.value})}
                    style={styles.input}
                />
                <button type="submit" style={styles.submitButton} disabled={loading}>
                    {loading ? 'Blacklisting...' : 'Blacklist User'}
                </button>
            </form>

            <h3>Blacklisted Users</h3>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Email</th>
                            <th>Reason</th>
                            <th>Blacklisted At</th>
                            <th>Expires At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blacklistedUsers.map((user, index) => (
                            <tr key={index}>
                                <td>{user.userId}</td>
                                <td>{user.email}</td>
                                <td>{user.reason}</td>
                                <td>{formatDate(user.blacklistedAt)}</td>
                                <td>{formatDate(user.expiresAt)}</td>
                                <td>
                                    <button 
                                        onClick={() => handleUnblacklistUser(user.userId)}
                                        style={styles.actionButton}
                                    >
                                        Unblacklist
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderIPsTab = () => (
        <div>
            <h3>Blacklist IP Address</h3>
            <form onSubmit={handleBlacklistIP} style={styles.form}>
                <input
                    type="text"
                    placeholder="IP Address"
                    value={blacklistIPForm.ipAddress}
                    onChange={(e) => setBlacklistIPForm({...blacklistIPForm, ipAddress: e.target.value})}
                    required
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Reason"
                    value={blacklistIPForm.reason}
                    onChange={(e) => setBlacklistIPForm({...blacklistIPForm, reason: e.target.value})}
                    required
                    style={styles.input}
                />
                <input
                    type="datetime-local"
                    placeholder="Expires At (optional)"
                    value={blacklistIPForm.expiresAt}
                    onChange={(e) => setBlacklistIPForm({...blacklistIPForm, expiresAt: e.target.value})}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Country (optional)"
                    value={blacklistIPForm.country}
                    onChange={(e) => setBlacklistIPForm({...blacklistIPForm, country: e.target.value})}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="City (optional)"
                    value={blacklistIPForm.city}
                    onChange={(e) => setBlacklistIPForm({...blacklistIPForm, city: e.target.value})}
                    style={styles.input}
                />
                <button type="submit" style={styles.submitButton} disabled={loading}>
                    {loading ? 'Blacklisting...' : 'Blacklist IP'}
                </button>
            </form>

            <h3>Blacklisted IP Addresses</h3>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>IP Address</th>
                            <th>Reason</th>
                            <th>Country</th>
                            <th>City</th>
                            <th>Blacklisted At</th>
                            <th>Expires At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blacklistedIPs.map((ip, index) => (
                            <tr key={index}>
                                <td>{ip.ipAddress}</td>
                                <td>{ip.reason}</td>
                                <td>{ip.country || 'N/A'}</td>
                                <td>{ip.city || 'N/A'}</td>
                                <td>{formatDate(ip.blacklistedAt)}</td>
                                <td>{formatDate(ip.expiresAt)}</td>
                                <td>
                                    <button 
                                        onClick={() => handleUnblacklistIP(ip.ipAddress)}
                                        style={styles.actionButton}
                                    >
                                        Unblacklist
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderLogsTab = () => (
        <div>
            <h3>Blacklist Activity Logs</h3>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Entity Type</th>
                            <th>Entity ID</th>
                            <th>Reason</th>
                            <th>Performed By</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blacklistLogs.map((log, index) => (
                            <tr key={index}>
                                <td>{log.action}</td>
                                <td>{log.entityType}</td>
                                <td>{log.entityId}</td>
                                <td>{log.reason}</td>
                                <td>{log.performedBy}</td>
                                <td>{formatDate(log.timestamp)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderStatsTab = () => (
        <div>
            <h3>Blacklist Statistics</h3>
            <div style={styles.statsContainer}>
                <div style={styles.statCard}>
                    <h4>Active Blacklisted Users</h4>
                    <p style={styles.statNumber}>{stats.activeUsers || 0}</p>
                </div>
                <div style={styles.statCard}>
                    <h4>Active Blacklisted IPs</h4>
                    <p style={styles.statNumber}>{stats.activeIPs || 0}</p>
                </div>
                <div style={styles.statCard}>
                    <h4>Active Blacklisted Tokens</h4>
                    <p style={styles.statNumber}>{stats.activeTokens || 0}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <h2>Blackbook Management</h2>
            
            {error && <div style={styles.errorMessage}>{error}</div>}
            {success && <div style={styles.successMessage}>{success}</div>}

            <div style={styles.tabContainer}>
                <button 
                    style={{...styles.tab, ...(activeTab === 'users' ? styles.activeTab : {})}}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button 
                    style={{...styles.tab, ...(activeTab === 'ips' ? styles.activeTab : {})}}
                    onClick={() => setActiveTab('ips')}
                >
                    IP Addresses
                </button>
                <button 
                    style={{...styles.tab, ...(activeTab === 'logs' ? styles.activeTab : {})}}
                    onClick={() => setActiveTab('logs')}
                >
                    Activity Logs
                </button>
                <button 
                    style={{...styles.tab, ...(activeTab === 'stats' ? styles.activeTab : {})}}
                    onClick={() => setActiveTab('stats')}
                >
                    Statistics
                </button>
            </div>

            <div style={styles.content}>
                {loading && <div style={styles.loading}>Loading...</div>}
                {activeTab === 'users' && renderUsersTab()}
                {activeTab === 'ips' && renderIPsTab()}
                {activeTab === 'logs' && renderLogsTab()}
                {activeTab === 'stats' && renderStatsTab()}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    tabContainer: {
        display: 'flex',
        marginBottom: '20px',
        borderBottom: '1px solid #ddd'
    },
    tab: {
        padding: '10px 20px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        borderBottom: '2px solid transparent',
        transition: 'all 0.3s ease'
    },
    activeTab: {
        borderBottomColor: '#102a43',
        backgroundColor: '#f8f9fa'
    },
    content: {
        minHeight: '400px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px'
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    tableContainer: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px'
    },
    table th: {
        backgroundColor: '#102a43',
        color: 'white',
        padding: '12px',
        textAlign: 'left'
    },
    table td: {
        padding: '12px',
        borderBottom: '1px solid #ddd'
    },
    table tr:nth-child(even): {
        backgroundColor: '#f8f9fa'
    },
    actionButton: {
        padding: '5px 10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    statsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    },
    statCard: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        border: '1px solid #ddd'
    },
    statNumber: {
        fontSize: '2em',
        fontWeight: 'bold',
        color: '#102a43',
        margin: '10px 0'
    },
    errorMessage: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb'
    },
    successMessage: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #c3e6cb'
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
        fontSize: '16px',
        color: '#666'
    }
};

export default BlackbookManager;