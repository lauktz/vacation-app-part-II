import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, TextField, Button, Alert, MenuItem, Divider } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { createVacation } from '../api/apiVacations';
import { uploadImage } from '../api/api';
import { getCountries, addCountry } from '../api/apiCountries';

const AddVacation = () => {
  const [form, setForm] = useState({
    destination: '',
    description: '',
    image_url: '',
    start_date: '',
    end_date: '',
    price: '',
    country_id: ''
  });
  const [countries, setCountries] = useState([]);
  const [file, setFile] = useState(null);
  const [newCountryName, setNewCountryName] = useState('');
  const [showAddCountry, setShowAddCountry] = useState(false);
  const [addingCountry, setAddingCountry] = useState(false);
  useEffect(() => {
    fetchCountries();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(false);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setFile(selected);
    setError(null);
    setSuccess(false);
  };

  const handleAddCountry = async () => {
    if (!newCountryName.trim()) {
      setError('Please enter a country name');
      return;
    }

    setAddingCountry(true);
    setError(null);

    try {
      const newCountry = await addCountry(newCountryName.trim());
      setCountries([...countries, newCountry]);
      setForm({ ...form, country_id: newCountry.country_id });
      setNewCountryName('');
      setShowAddCountry(false);
      setSuccess('Country added successfully!');
    } catch (err) {
      setError(err.message || 'Failed to add country');
    } finally {
      setAddingCountry(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const data = await getCountries();
      setCountries(data);
    } catch (err) {
      setError('Failed to load countries');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Build payload and handle image (file upload or direct URL)
    const payload = {
      destination: form.destination.trim(),
      description: form.description.trim(),
      image_filename: '',
      start_date: form.start_date,
      end_date: form.end_date,
      price: parseFloat(form.price),
      country_id: parseInt(form.country_id)
    };

    // Check for empty fields
    if (!payload.description || !payload.start_date || !payload.end_date || isNaN(payload.price) || isNaN(payload.country_id)) {
      setError('All fields (except destination and image URL/file) are required.');
      setLoading(false);
      return;
    }

    try {
      // 1) If a file is selected, upload it and use returned filename
      if (file) {
        const { filename } = await uploadImage(file);
        payload.image_filename = filename;
      } else if (form.image_url && form.image_url.trim()) {
        // 2) If URL provided, store URL as image_filename (frontend soporta URLs http)
        payload.image_filename = form.image_url.trim();
      } else {
        setError('Please select an image file or provide an image URL.');
        setLoading(false);
        return;
      }

      console.log('Submitting vacation:', payload);
      await createVacation(payload);
      setSuccess(true);
      setForm({ destination: '', description: '', image_url: '', start_date: '', end_date: '', price: '', country_id: '' });
      setFile(null);
    } catch (err) {
      setError(err.message || 'Failed to add vacation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)', py: 6 }}>
      <Container maxWidth="md">
        <Paper elevation={5} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Add New Vacation
          </Typography>
          {success && <Alert severity="success" sx={{ mb: 2 }}>Vacation added successfully!</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField label="Destination (optional)" name="destination" value={form.destination} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" required multiline rows={3} />
            <TextField label="Image URL (optional)" name="image_url" value={form.image_url} onChange={handleChange} fullWidth margin="normal" />
            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
              Choose Image File
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {file.name}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                select
                label="Country"
                name="country_id"
                value={form.country_id}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              >
                <MenuItem value="" disabled>Select a country</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.country_id} value={country.country_id}>
                    {country.country_name}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowAddCountry(!showAddCountry)}
                sx={{ mb: 1, minWidth: 'auto' }}
              >
                Add New
              </Button>
            </Box>

            {showAddCountry && (
              <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Add New Country
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    label="Country Name"
                    value={newCountryName}
                    onChange={(e) => setNewCountryName(e.target.value)}
                    fullWidth
                    size="small"
                    placeholder="Enter country name..."
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddCountry}
                    disabled={addingCountry || !newCountryName.trim()}
                    size="small"
                  >
                    {addingCountry ? 'Adding...' : 'Add'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowAddCountry(false);
                      setNewCountryName('');
                    }}
                    size="small"
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
            <TextField label="Start Date" name="start_date" type="date" value={form.start_date} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
            <TextField label="End Date" name="end_date" type="date" value={form.end_date} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
            <TextField label="Price" name="price" type="number" value={form.price} onChange={handleChange} fullWidth margin="normal" required />
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 3 }} fullWidth disabled={loading}>
              {loading ? 'Adding...' : 'Add Vacation'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddVacation;
