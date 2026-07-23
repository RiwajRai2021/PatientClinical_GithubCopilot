import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddPatient = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !age) {
      toast.error('All fields are required');
      return;
    }

    if (isNaN(age) || age <= 0) {
      toast.error('Age must be a valid positive number');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/patients', {
        firstName,
        lastName,
        age: parseInt(age, 10),
      });

      toast.success('Patient added successfully!');
      setFirstName('');
      setLastName('');
      setAge('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-patient-container">
      <h2>Add Patient</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter patient's first name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter patient's last name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter patient's age"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding Patient...' : 'Add Patient'}
        </button>
      </form>
    </div>
  );
};

export default AddPatient;
