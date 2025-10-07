
import React from 'react';
import { Box, Typography, Container, Paper, Grid, Avatar, Divider } from '@mui/material';
import { Group, Public, Star } from '@mui/icons-material';

const team = [
    {
        name: 'Liam Ben David',
        role: 'Co-Lead Developer',
        avatar: 'http://localhost:5003/images/liam.jpg',
    },
    {
        name: 'Laura Katz',
        role: 'Co-Lead Developer',
        avatar: 'http://localhost:5003/images/laura.webp',
    }
];

const gallery = [
    'http://localhost:5003/images/portugal.avif',
    'http://localhost:5003/images/venice.webp'
];

const About = () => {
    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3e5f5 0%, #e1f5fe 100%)', py: 8 }}>
            <Container maxWidth="md">
                <Paper elevation={5} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, background: 'rgba(255,255,255,0.97)' }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Public sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h3" fontWeight={700} gutterBottom>
                            About Vacation App
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Your gateway to unforgettable journeys and seamless travel planning.
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 4 }} />
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            <Star sx={{ fontSize: 28, color: 'secondary.main', mr: 1 }} />
                            Our Mission
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            We believe travel should be inspiring, easy, and accessible to everyone. Our mission is to connect you with the world’s best destinations, providing a platform that makes vacation planning simple, fun, and secure. Whether you’re dreaming of a tropical escape or a cultural adventure, we’re here to help you every step of the way.
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 4 }} />
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            <Group sx={{ fontSize: 28, color: 'info.main', mr: 1 }} />
                            Meet the Team
                        </Typography>
                    </Box>
                    <Grid container spacing={4} justifyContent="center">
                        {team.map((member) => (
                            <Grid item xs={12} sm={4} key={member.name}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Avatar src={member.avatar} alt={member.name} sx={{ width: 120, height: 120, mb: 2, boxShadow: 3 }} />
                                    <Typography variant="subtitle1" fontWeight={600}>{member.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{member.role}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ my: 4 }} />
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Weekly Travel Inspiration
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        {gallery.map((src, idx) => (
                            <Grid item xs={12} md={6} key={idx}>
                                <Box component="img" src={src} alt={`gallery-${idx}`} sx={{
                                    width: '100%',
                                    height: 280,
                                    objectFit: 'cover',
                                    borderRadius: 3,
                                    boxShadow: 3
                                }} />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default About;