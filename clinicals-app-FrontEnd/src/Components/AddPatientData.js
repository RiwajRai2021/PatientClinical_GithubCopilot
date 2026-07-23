import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddPatientData = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/patientservices/api/patients/${patientId}`);
        const patientData = response.data;
        setPatient(patientData);
        setFirstName(patientData?.firstName || '');
        setLastName(patientData?.lastName || '');
        setAge(patientData?.age?.toString() || '');
        setError(null);
      } catch (fetchError) {
        setPatient(null);
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const handleSavePatientData = async (event) => {
    event.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !age.trim()) {
      toast.error('First name, last name, and age are required.');
      return;
    }

    if (Number.isNaN(Number(age)) || Number(age) <= 0) {
      toast.error('Age must be a valid positive number.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: Number(age),
      };

      await axios.put(`/patientservices/api/patients/${patientId}`, payload);
      setPatient((prev) => ({ ...prev, ...payload }));
      toast.success('Patient data saved successfully.');
    } catch (saveError) {
      const backendMessage =
        saveError.response?.data?.message ||
        saveError.response?.data?.error ||
        saveError.message;
      toast.error(`Failed to save patient data: ${backendMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePatientData = async () => {
    const confirmed = window.confirm('Delete this patient data?');
    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      try {
        await axios.delete(`/patientservices/api/patients/${patientId}`);
      } catch (firstDeleteError) {
        await axios.delete(`/patientservices/patients/${patientId}`);
      }

      toast.success('Patient data deleted successfully.');
      navigate('/');
    } catch (deleteError) {
      const backendMessage =
        deleteError.response?.data?.message ||
        deleteError.response?.data?.error ||
        deleteError.message;
      toast.error(`Failed to delete patient data: ${backendMessage}`);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="add-clinicals-page">Loading patient data...</div>;
  }

  if (error) {
    return <div className="add-clinicals-page">Error: {error}</div>;
  }

  return (
    <div className="add-clinicals-page">
      <h2 className="add-clinicals-title">Add Patient Data</h2>

      {patient ? (
        <div className="patient-details-card">
          <h3 className="patient-details-title">Current Patient Information</h3>
          <p className="patient-detail-row"><strong>Patient ID:</strong> {patient.id}</p>
          <p className="patient-detail-row"><strong>First Name:</strong> {patient.firstName}</p>
          <p className="patient-detail-row"><strong>Last Name:</strong> {patient.lastName}</p>
          <p className="patient-detail-row"><strong>Age:</strong> {patient.age}</p>
        </div>
      ) : (
        <p>No patient data available.</p>
      )}

      <form className="clinical-form" onSubmit={handleSavePatientData}>
        <h3 className="clinical-form-title">Update Patient Data</h3>

        <div className="form-group">
          <label htmlFor="patientFirstName">First Name</label>
          <input
            id="patientFirstName"
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Enter first name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="patientLastName">Last Name</label>
          <input
            id="patientLastName"
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Enter last name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="patientAge">Age</label>
          <input
            id="patientAge"
            type="number"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            placeholder="Enter age"
          />
        </div>

        <div className="form-action-row">
          <button type="submit" disabled={saving || deleting} className="save-clinical-button">
            {saving ? 'Saving...' : 'Save Patient Data'}
          </button>
          <button
            type="button"
            disabled={saving || deleting}
            className="delete-action-button"
            onClick={handleDeletePatientData}
          >
            {deleting ? 'Deleting...' : 'Delete Patient Data'}
          </button>
        </div>
      </form>

      <div className="back-link-container">
        <Link className="back-to-home-link" to="/">
          Back to Patient List
        </Link>
      </div>
    </div>
  );
};

export default AddPatientData;
