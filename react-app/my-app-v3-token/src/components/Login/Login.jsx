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
  Link
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

const Login = () => {
    const navigate = useNavigate();
    const { login: contextLogin, loading: contextLoading, error: contextError, clearError } = useUser();
    
    // Local state
    const [formData, setFormData] = useState({
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

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            await contextLogin(formData);
            // If login successful, redirect to home
            navigate('/');
        } catch (error) {
            // Error is already handled by the context
            console.log('Login error:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h4" component="h1" gutterBottom>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to your account to continue
                        </Typography>
                    </Box>

                    {contextError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {contextError}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleLogin} noValidate name="login-form">
                        <TextField
                            margin="normal"
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
                            sx={{ mb: 2 }}
                        />
                        
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            variant="outlined"
                            disabled={contextLoading}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={contextLoading}
                            sx={{ 
                                py: 1.5,
                                position: 'relative'
                            }}
                        >
                            {contextLoading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={20} color="inherit" />
                                    <Typography>Signing In...</Typography>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LoginIcon />
                                    <Typography>Sign In</Typography>
                                </Box>
                            )}
                        </Button>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            Don't have an account?{' '}
                            <Link 
                                href="/register" 
                                variant="body2"
                                sx={{ 
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                Sign up here
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;