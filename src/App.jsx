import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({
    business_name: '',
    url: '',
    score: 0
  });

  useEffect(() => {
    // Fetch all leads when the app loads
    axios.get('http://localhost:5000/leads')
      .then(response => setLeads(response.data))
      .catch(error => console.error('Error fetching leads:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLead(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/leads', newLead)
      .then(response => {
        console.log('Lead added:', response);
        setLeads([...leads, newLead]);
        setNewLead({ business_name: '', url: '', score: 0 });
      })
      .catch(error => console.error('Error adding lead:', error));
  };

  return (
    <div className="App">
      <h1>Lead Dashboard</h1>
      <div>
        <h2>Create Lead</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="business_name"
            value={newLead.business_name}
            onChange={handleChange}
            placeholder="Business Name"
            required
          />
          <input
            type="text"
            name="url"
            value={newLead.url}
            onChange={handleChange}
            placeholder="Business URL"
            required
          />
          <input
            type="number"
            name="score"
            value={newLead.score}
            onChange={handleChange}
            placeholder="Lead Score"
            required
          />
          <button type="submit">Add Lead</button>
        </form>
      </div>
      
      <h2>All Leads</h2>
      <table>
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Score</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.business_name}</td>
              <td>{lead.score}</td>
              <td>{lead.status}</td>
              <td>
                <button>View</button>
                <button>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
