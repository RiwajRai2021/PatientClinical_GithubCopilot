import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddClinicals = () => {
  const getApiErrorMessage = (apiError) => {
    const responseData = apiError.response?.data;

    if (!responseData) {
      return apiError.message;
    }

    if (typeof responseData === 'string') {
      return responseData;
    }

    if (typeof responseData === 'object') {
      return JSON.stringify(responseData);
    }

    return String(responseData);
  };

  const getCurrentDateTimeInputValue = () => {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
  };

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [componentName, setComponentName] = useState('');
  const [componentValue, setComponentValue] = useState('');
  const [measuredDateTime, setMeasuredDateTime] = useState(getCurrentDateTimeInputValue());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { patientId } = useParams();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/patientservices/api/patients/${patientId}`);
        setPatient(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);

  if (loading) {
    return <div className="add-clinicals-page">Loading patient clinical data...</div>;
  }

  if (error) {
    return <div className="add-clinicals-page">Error: {error}</div>;
  }

  const handleClinicalSave = async (event) => {
    event.preventDefault();

    if (!componentName.trim() || !componentValue.trim()) {
      toast.error('Component name and component value are required.');
      return;
    }

    if (!measuredDateTime) {
      toast.error('Measured date and time is required.');
      return;
    }

    setSaving(true);

    try {
      const trimmedComponentName = componentName.trim();
      const trimmedComponentValue = componentValue.trim();
      const parsedValue = Number(trimmedComponentValue);
      const normalizedMeasuredDateTime = measuredDateTime.length === 16
        ? `${measuredDateTime}:00`
        : measuredDateTime;

      const clinicalPayload = {
        componentName: trimmedComponentName,
        componentValue: Number.isNaN(parsedValue) ? trimmedComponentValue : parsedValue,
        measuredDateTime: normalizedMeasuredDateTime,
        patientId: Number(patientId),
      };

      await axios.post(
        `/patientservices/api/patients/${patientId}/clinicals`,
        clinicalPayload
      );

      toast.success('Clinical data saved successfully.');
      setComponentName('');
      setComponentValue('');
      setMeasuredDateTime(getCurrentDateTimeInputValue());
    } catch (saveError) {
      const backendMessage = getApiErrorMessage(saveError);
      const statusCode = saveError.response?.status;
      console.error('Clinical data save failed', {
        status: statusCode,
        url: `/patientservices/api/patients/${patientId}/clinicals`,
        payload: {
          componentName: componentName.trim(),
          componentValue: componentValue.trim(),
          measuredDateTime,
          patientId: Number(patientId),
        },
        responseData: saveError.response?.data,
      });
      toast.error(`Failed to save clinical data (${statusCode || 'no-status'}): ${backendMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClinicalData = async () => {
    const confirmed = window.confirm('Delete clinical data for this patient?');
    if (!confirmed) {
      return;
    }

    if (!measuredDateTime) {
      toast.error('Measured date and time is required for delete.');
      return;
    }

    setDeleting(true);

    try {
      const normalizedMeasuredDateTime = measuredDateTime.length === 16
        ? `${measuredDateTime}:00`
        : measuredDateTime;

      const deletePayload = {
        componentName: componentName.trim(),
        componentValue: componentValue.trim(),
        measuredDateTime: normalizedMeasuredDateTime,
      };

      try {
        await axios.delete(`/patientservices/api/patients/${patientId}/clinicals`, {
          data: deletePayload,
        });
      } catch (firstDeleteError) {
        await axios.delete(`/patientservices/patients/${patientId}/clinicals`, {
          data: deletePayload,
        });
      }

      toast.success('Clinical data deleted successfully.');
      setComponentName('');
      setComponentValue('');
      setMeasuredDateTime(getCurrentDateTimeInputValue());
    } catch (deleteError) {
      const backendMessage = getApiErrorMessage(deleteError);
      toast.error(`Failed to delete clinical data: ${backendMessage}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="add-clinicals-page">
      <h2 className="add-clinicals-title">Clinical Data Details</h2>

      {patient ? (
        <div className="patient-details-card">
          <h3 className="patient-details-title">Patient Information</h3>
          <p className="patient-detail-row"><strong>Patient ID:</strong> {patient.id}</p>
          <p className="patient-detail-row"><strong>First Name:</strong> {patient.firstName}</p>
          <p className="patient-detail-row"><strong>Last Name:</strong> {patient.lastName}</p>
          <p className="patient-detail-row"><strong>Age:</strong> {patient.age}</p>
        </div>
      ) : (
        <p>No patient data available.</p>
      )}

      <form className="clinical-form" onSubmit={handleClinicalSave}>
        <h3 className="clinical-form-title">Add Clinical Data</h3>

        <div className="form-group">
          <label htmlFor="componentName">Component Name</label>
          <input
            id="componentName"
            type="text"
            value={componentName}
            onChange={(event) => setComponentName(event.target.value)}
            placeholder="Enter component name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="componentValue">Component Value</label>
          <input
            id="componentValue"
            type="text"
            value={componentValue}
            onChange={(event) => setComponentValue(event.target.value)}
            placeholder="Enter component value"
          />
        </div>

        <div className="form-group">
          <label htmlFor="measuredDateTime">Measured Date & Time</label>
          <input
            id="measuredDateTime"
            type="datetime-local"
            value={measuredDateTime}
            onChange={(event) => setMeasuredDateTime(event.target.value)}
          />
        </div>

        <div className="form-action-row">
          <button type="submit" disabled={saving || deleting} className="save-clinical-button">
            {saving ? 'Saving...' : 'Save Clinical Data'}
          </button>
          <button
            type="button"
            disabled={saving || deleting}
            className="delete-action-button"
            onClick={handleDeleteClinicalData}
          >
            {deleting ? 'Deleting...' : 'Delete Clinical Data'}
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

export default AddClinicals;
