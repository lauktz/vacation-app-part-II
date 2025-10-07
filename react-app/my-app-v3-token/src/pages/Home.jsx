import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { FlightTakeoff, Explore, BeachAccess } from '@mui/icons-material';

const Home = () => {
    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8
        }}>
            <Container maxWidth="md">
                <Paper elevation={6} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, textAlign: 'center', background: 'rgba(255,255,255,0.95)' }}>
                    <FlightTakeoff sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.dark' }}>
                        Discover Your Next Adventure
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
                        Plan, book, and enjoy the best vacations with our all-in-one platform.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                        <Explore sx={{ fontSize: 40, color: 'secondary.main' }} />
                        <BeachAccess sx={{ fontSize: 40, color: 'info.main' }} />
                    </Box>
                    <Button
                        href="/vacations"
                        variant="contained"
                        size="large"
                        sx={{ px: 5, py: 1.5, fontWeight: 600, fontSize: '1.2rem', borderRadius: 3 }}
                    >
                        Explore Vacations
                    </Button>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
                        New here? <Button href="/register" variant="text" sx={{ fontWeight: 600 }}>Create an account</Button>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Home;