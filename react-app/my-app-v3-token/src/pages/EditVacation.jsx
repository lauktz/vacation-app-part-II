
import React, { useEffect, useState } from 'react';
import { getVacations, updateVacation, deleteVacation } from '../api/apiVacations';
import {
  Box, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, TextField, CircularProgress, Alert, Container, Chip
} from '@mui/material';

const EditVacation = () => {
  const [vacations, setVacations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Function to clean title (remove year in parentheses)
  const cleanTitle = (title) => {
    return title.replace(/\s*\(\d{4}\)\s*$/, '');
  };

  const handleRemove = async (id) => {
    // Find the vacation to get its name for confirmation
    const vacation = vacations.find(v => (v.id || v.vacation_id) === id);
    const vacationName = vacation?.destination || vacation?.description || 'this vacation';
    
    // Show confirmation dialog
    if (!window.confirm(`Are you sure you want to delete "${vacationName}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteVacation(id);
      setSuccess('Vacation removed successfully!');
      setEditingId(null);
      // Refresh the vacations list
      const data = await getVacations();
      setVacations(data);
    } catch (err) {
      // Show a more visible error message for permission or other errors
      if (err.message && err.message.toLowerCase().includes('access denied')) {
        setError('You do not have permission to remove this vacation. Admin access required.');
      } else if (err.message && err.message.toLowerCase().includes('authentication')) {
        setError('Authentication failed. Please log in again as an admin.');
      } else {
        setError(err.message || 'Failed to remove vacation.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVacations = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getVacations();
        setVacations(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch vacations.');
      } finally {
        setLoading(false);
      }
    };
    fetchVacations();
  }, [success]);

  const handleEditClick = (vac) => {
    setEditingId(vac.id || vac.vacation_id);
    setEditForm({ ...vac });
    setSuccess(null);
    setError(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    // Prepare payload for backend compatibility
    const payload = {
      destination: editForm.destination?.trim() || '',
      description: editForm.description?.trim() || '',
      image_filename: editForm.image_url?.trim() || editForm.image_filename?.trim() || '',
      start_date: editForm.start_date,
      end_date: editForm.end_date,
      price: parseFloat(editForm.price),
      country_id: parseInt(editForm.country_id)
    };
    try {
      await updateVacation(id, payload);
      setSuccess('Vacation updated successfully!');
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Failed to update vacation.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setSuccess(null);
    setError(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" align="center" fontWeight={700} gutterBottom>
          Edit Vacations
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" mb={4}>
          Click "Edit" to modify any vacation inline.
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress size={48} />
          </Box>
        )}
        <Grid container spacing={4} justifyContent="center">
          {vacations.map((vac) => {
            const id = vac.id || vac.vacation_id;
            const isEditing = editingId === id;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 4,
                  borderRadius: 3,
                  border: '1px solid rgba(0,0,0,0.08)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  '&:hover': { boxShadow: 8, transform: 'translateY(-3px)' }
                }}>
                  {!isEditing && (vac.image_filename || vac.image_url) && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={(vac.image_filename && !String(vac.image_filename).startsWith('http'))
                        ? `http://localhost:5003/images/${vac.image_filename}`
                        : (vac.image_url || vac.image_filename)}
                      alt={vac.destination || 'Vacation'}
                      onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x180?text=No+Image'; }}
                    />
                  )}
                  <CardContent sx={{ pt: 2, pb: 1 }}>
                    {isEditing ? (
                      <>
                        <TextField label="Destination" name="destination" value={editForm.destination || ''} onChange={handleEditChange} fullWidth margin="dense" required />
                        <TextField label="Description" name="description" value={editForm.description || ''} onChange={handleEditChange} fullWidth margin="dense" required multiline rows={2} />
                        <TextField label="Image URL" name="image_url" value={editForm.image_url || editForm.image_filename || ''} onChange={handleEditChange} fullWidth margin="dense" required />
                        <TextField label="Country ID" name="country_id" value={editForm.country_id || ''} onChange={handleEditChange} fullWidth margin="dense" required type="number" />
                        <TextField label="Start Date" name="start_date" type="date" value={editForm.start_date || ''} onChange={handleEditChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} required />
                        <TextField label="End Date" name="end_date" type="date" value={editForm.end_date || ''} onChange={handleEditChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} required />
                        <TextField label="Price" name="price" type="number" value={editForm.price || ''} onChange={handleEditChange} fullWidth margin="dense" required />
                      </>
                    ) : (
                      <>
                        <Typography variant="h3" fontWeight={800} color="primary" sx={{ letterSpacing: 0.2 }} gutterBottom>
                          {cleanTitle(vac.description)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          <Chip label={`${vac.start_date} → ${vac.end_date}`} color="info" variant="outlined" size="small" />
                          <Chip label={`$${vac.price}`} color="secondary" size="small" />
                        </Box>
                      </>
                    )}
                  </CardContent>
                  <CardActions sx={{ mt: 'auto', justifyContent: 'space-between', px: 2, pb: 2 }}>
                    {!isEditing && (
                      <Typography variant="caption" color="text.secondary">
                        ID: {id}
                      </Typography>
                    )}
                    {isEditing ? (
                      <>
                        <Button onClick={() => handleEditSave(id)} variant="contained" color="primary" size="medium" disabled={loading}>
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="outlined" color="secondary" size="medium" sx={{ ml: 1 }}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleRemove(id)} variant="outlined" color="error" size="medium" sx={{ ml: 1 }} disabled={loading}>
                          Remove
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => handleEditClick(vac)} variant="contained" color="primary" size="medium">
                          Edit
                        </Button>
                        <Button onClick={() => handleRemove(id)} variant="outlined" color="error" size="medium" sx={{ ml: 1 }} disabled={loading}>
                          Remove
                        </Button>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default EditVacation;
