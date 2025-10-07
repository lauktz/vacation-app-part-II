import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/Context";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';

const Register = () => {
    const navigate = useNavigate();
    const { register: contextRegister, loading: contextLoading, error: contextError, clearError } = useUser();
    
    // Local state
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    });

    // Form handling
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear any previous errors when user types
        if (contextError) {
            clearError();
        }
    };
    
    const handleRegister = async (e) => {
        e.preventDefault();
        
        try {
            await contextRegister(formData);
            setSuccess("Registration successful! Redirecting to login...");
            
            // Reset form
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                password: ""
            });
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (error) {
            // Error is already handled by the context
            console.log('Registration error:', error);
        }
    };

    //phase 3 - return jsx  
    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <PersonAddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h4" component="h1" gutterBottom>
                            Create Account
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Join us and start planning your next adventure!
                        </Typography>
                    </Box>

                    {contextError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {contextError}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleRegister} noValidate name="register-form">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="First Name"
                                    name="first_name"
                                    autoComplete="given-name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    variant="outlined"
                                    disabled={contextLoading}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Last Name"
                                    name="last_name"
                                    autoComplete="family-name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    variant="outlined"
                                    disabled={contextLoading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    variant="outlined"
                                    disabled={contextLoading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    variant="outlined"
                                    disabled={contextLoading}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={contextLoading}
                            sx={{ 
                                mt: 3, 
                                mb: 2,
                                py: 1.5,
                                position: 'relative'
                            }}
                        >
                            {contextLoading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={20} color="inherit" />
                                    <Typography>Creating Account...</Typography>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PersonAddIcon />
                                    <Typography>Register</Typography>
                                </Box>
                            )}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}

export default Register;