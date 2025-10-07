import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../App';
import axios from 'axios';

const Blackbook = () => {
  const { token } = useContext(TokenContext);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: '',
    status: '',
    search: ''
  });

  // Form states
  const [newEntry, setNewEntry] = useState({
    type: '',
    value: '',
    reason: '',
    description: '',
    expiresAt: '',
    metadata: {}
  });

  const [bulkEntries, setBulkEntries] = useState('');

  const API_BASE = 'http://localhost:4001/blackbook';

  useEffect(() => {
    if (token) {
      loadEntries();
      loadStatistics();
      loadMetadata();
    }
  }, [token, filters]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await axios.get(`${API_BASE}/entries?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEntries(response.data.data.entries);
      setError('');
    } catch (err) {
      setError('Failed to load blackbook entries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await axios.get(`${API_BASE}/statistics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatistics(response.data.data);
    } catch (err) {
      console.error('Failed to load statistics:', err);
    }
  };

  const loadMetadata = async () => {
    try {
      const response = await axios.get(`${API_BASE}/metadata`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetadata(response.data.data);
    } catch (err) {
      console.error('Failed to load metadata:', err);
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const entryData = {
        ...newEntry,
        expiresAt: newEntry.expiresAt ? new Date(newEntry.expiresAt).toISOString() : undefined
      };

      await axios.post(`${API_BASE}/entries`, entryData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Entry added successfully');
      setShowAddForm(false);
      setNewEntry({
        type: '',
        value: '',
        reason: '',
        description: '',
        expiresAt: '',
        metadata: {}
      });
      loadEntries();
      loadStatistics();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const entriesArray = bulkEntries.split('\n').map(line => {
        const [type, value, reason, description] = line.split(',').map(s => s.trim());
        return { type, value, reason, description };
      }).filter(entry => entry.type && entry.value && entry.reason);

      await axios.post(`${API_BASE}/entries/bulk`, { entries: entriesArray }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Bulk entries added successfully');
      setShowBulkForm(false);
      setBulkEntries('');
      loadEntries();
      loadStatistics();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add bulk entries');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/entries/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Status updated successfully');
      loadEntries();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleRemoveEntry = async (id) => {
    if (window.confirm('Are you sure you want to remove this entry?')) {
      try {
        await axios.delete(`${API_BASE}/entries/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Entry removed successfully');
        loadEntries();
        loadStatistics();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to remove entry');
      }
    }
  };

  const handleCleanup = async () => {
    try {
      await axios.post(`${API_BASE}/cleanup`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Expired entries cleaned up successfully');
      loadEntries();
      loadStatistics();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cleanup expired entries');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#dc3545';
      case 'inactive': return '#6c757d';
      case 'pending': return '#ffc107';
      case 'expired': return '#17a2b8';
      default: return '#000';
    }
  };

  if (!token) {
    return <div>Please log in to access the blackbook system.</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Blackbook Management System</h1>

      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ 
          background: '#d4edda', 
          color: '#155724', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {success}
        </div>
      )}

      {/* Statistics */}
      {statistics && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <h3>Total Entries</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
              {statistics.total}
            </p>
          </div>
          <div>
            <h3>By Type</h3>
            {Object.entries(statistics.byType).map(([type, count]) => (
              <div key={type} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{type}:</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
          <div>
            <h3>By Status</h3>
            {Object.entries(statistics.byStatus).map(([status, count]) => (
              <div key={status} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{status}:</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Entry
        </button>
        <button 
          onClick={() => setShowBulkForm(!showBulkForm)}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Bulk Add
        </button>
        <button 
          onClick={handleCleanup}
          style={{
            background: '#ffc107',
            color: 'black',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cleanup Expired
        </button>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <h3>Add New Entry</h3>
          <form onSubmit={handleAddEntry}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label>Type:</label>
                <select 
                  value={newEntry.type} 
                  onChange={(e) => setNewEntry({...newEntry, type: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                >
                  <option value="">Select Type</option>
                  {metadata?.types?.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Value:</label>
                <input 
                  type="text" 
                  value={newEntry.value} 
                  onChange={(e) => setNewEntry({...newEntry, value: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>Reason:</label>
                <select 
                  value={newEntry.reason} 
                  onChange={(e) => setNewEntry({...newEntry, reason: e.target.value})}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                >
                  <option value="">Select Reason</option>
                  {metadata?.reasons?.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Expires At:</label>
                <input 
                  type="datetime-local" 
                  value={newEntry.expiresAt} 
                  onChange={(e) => setNewEntry({...newEntry, expiresAt: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Description:</label>
              <textarea 
                value={newEntry.description} 
                onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '60px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Entry'}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk Add Form */}
      {showBulkForm && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <h3>Bulk Add Entries</h3>
          <p>Format: type,value,reason,description (one per line)</p>
          <form onSubmit={handleBulkAdd}>
            <textarea 
              value={bulkEntries} 
              onChange={(e) => setBulkEntries(e.target.value)}
              placeholder="user,user123,fraud,Suspicious activity&#10;email,spam@example.com,spam,Spam email"
              style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '120px' }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Entries'}
              </button>
              <button type="button" onClick={() => setShowBulkForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h3>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <div>
            <label>Type:</label>
            <select 
              value={filters.type} 
              onChange={(e) => setFilters({...filters, type: e.target.value, page: 1})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">All Types</option>
              {metadata?.types?.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Status:</label>
            <select 
              value={filters.status} 
              onChange={(e) => setFilters({...filters, status: e.target.value, page: 1})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">All Statuses</option>
              {metadata?.statuses?.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Search:</label>
            <input 
              type="text" 
              value={filters.search} 
              onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
              placeholder="Search value or description"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        </div>
      </div>

      {/* Entries Table */}
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Type</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Value</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Reason</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Created</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Expires</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>
                  Loading...
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>
                  No entries found
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>{entry.type}</td>
                  <td style={{ padding: '12px' }}>{entry.value}</td>
                  <td style={{ padding: '12px' }}>{entry.reason}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      color: getStatusColor(entry.status),
                      fontWeight: 'bold'
                    }}>
                      {entry.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{formatDate(entry.createdAt)}</td>
                  <td style={{ padding: '12px' }}>
                    {entry.expiresAt ? formatDate(entry.expiresAt) : 'Never'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      <select 
                        value={entry.status} 
                        onChange={(e) => handleUpdateStatus(entry._id, e.target.value)}
                        style={{ padding: '4px', fontSize: '12px' }}
                      >
                        {metadata?.statuses?.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => handleRemoveEntry(entry._id)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Blackbook;