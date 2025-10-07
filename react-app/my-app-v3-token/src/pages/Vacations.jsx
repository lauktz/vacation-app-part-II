import React, { useEffect, useState } from 'react';
import { getVacations } from '../api/apiVacations';
import { likeVacation, unlikeVacation, getUserLikes } from '../api/apiLikes';
import { getLikesCount } from '../api/apiLikesCount';
import { useUser } from '../contexts/Context';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    CircularProgress,
    Alert,
    Container,
    TextField,
    InputAdornment,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip
} from '@mui/material';
import { BeachAccess, CalendarMonth, Place, Favorite, FavoriteBorder, Search, Terrain, Museum, SportsSoccer, Restaurant, FlightTakeoff } from '@mui/icons-material';

const Vacations = () => {
    const [vacations, setVacations] = useState([]);
    const [filteredVacations, setFilteredVacations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showOnlyLiked, setShowOnlyLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likes, setLikes] = useState([]);
    const { user, isAuthenticated, isAdmin } = useUser();
    const [likesCount, setLikesCount] = useState({});

    // Function to clean title (remove year in parentheses)
    const cleanTitle = (title) => {
        return title.replace(/\s*\(\d{4}\)\s*$/, '');
    };

    // Function to get category based on vacation description
    const getVacationCategory = (description) => {
        const desc = description.toLowerCase();
        
        if (desc.includes('cultural') || desc.includes('art') || desc.includes('history') || desc.includes('museum') || desc.includes('temples')) {
            return { name: 'Culture', icon: Museum, color: 'purple' };
        }
        if (desc.includes('hiking') || desc.includes('adventure') || desc.includes('explore') || desc.includes('trekking')) {
            return { name: 'Adventure', icon: Terrain, color: 'green' };
        }
        if (desc.includes('beach') || desc.includes('island') || desc.includes('coastal') || desc.includes('relaxation')) {
            return { name: 'Nature', icon: BeachAccess, color: 'blue' };
        }
        if (desc.includes('wine') || desc.includes('food') || desc.includes('tasting') || desc.includes('culinary')) {
            return { name: 'Food & Wine', icon: Restaurant, color: 'orange' };
        }
        if (desc.includes('night market') || desc.includes('city') || desc.includes('urban')) {
            return { name: 'Urban', icon: FlightTakeoff, color: 'red' };
        }
        // Default category
        return { name: 'Travel', icon: FlightTakeoff, color: 'primary' };
    };
    useEffect(() => {
        const fetchLikesCount = async () => {
            try {
                const counts = await getLikesCount();
                setLikesCount(counts);
            } catch {
                setLikesCount({});
            }
        };
        fetchLikesCount();
    }, [likes]);

    useEffect(() => {
        const fetchVacations = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getVacations();
                setVacations(data);
                setFilteredVacations(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch vacations.');
            } finally {
                setLoading(false);
            }
        };
        fetchVacations();
    }, []);

    // Filter vacations based on search term, price range, category, and likes
    useEffect(() => {
        let filtered = vacations;

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(vacation => 
                vacation.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vacation.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by price range
        filtered = filtered.filter(vacation => 
            vacation.price >= priceRange[0] && vacation.price <= priceRange[1]
        );

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(vacation => {
                const category = getVacationCategory(vacation.description);
                return category.name === selectedCategory;
            });
        }

        // Filter by likes (only show vacations with likes)
        if (showOnlyLiked) {
            filtered = filtered.filter(vacation => 
                (likesCount[vacation.vacation_id] || 0) > 0
            );
        }

        setFilteredVacations(filtered);
    }, [searchTerm, priceRange, selectedCategory, showOnlyLiked, vacations, likesCount]);

    useEffect(() => {
        const fetchLikes = async () => {
            if (user && user.user_id) {
                try {
                    const res = await getUserLikes(user.user_id);
                    setLikes(res.liked_vacations || []);
                } catch {
                    setLikes([]);
                }
            }
        };
        fetchLikes();
    }, [user]);

    const handleLike = async (vacation_id) => {
        if (!user || !user.user_id) return;
        try {
            await likeVacation(user.user_id, vacation_id);
            setLikes((prev) => [...prev, vacation_id]);
            // Refetch like counts for live update
            const counts = await getLikesCount();
            setLikesCount(counts);
        } catch {}
    };

    const handleUnlike = async (vacation_id) => {
        if (!user || !user.user_id) return;
        try {
            await unlikeVacation(user.user_id, vacation_id);
            setLikes((prev) => prev.filter((id) => id !== vacation_id));
            // Refetch like counts for live update
            const counts = await getLikesCount();
            setLikesCount(counts);
        } catch {}
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)', py: 6, px: 3 }}>
            <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
                <Typography variant="h3" component="h1" align="center" fontWeight={700} gutterBottom>
                    Vacations
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" mb={4}>
                    Explore our amazing vacation destinations!
                </Typography>

                {/* Search and Filter Bar */}
                <Box sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
                    {/* Search Bar */}
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Search vacations by destination or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    fontSize: '1.1rem',
                                    height: '56px',
                                }
                            }}
                        />
                    </Box>
                    
                    {/* Category Filter */}
                    <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Filter by Category</InputLabel>
                            <Select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                sx={{
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                }}
                            >
                                <MenuItem value="All">All Categories</MenuItem>
                                <MenuItem value="Culture">🏛️ Culture</MenuItem>
                                <MenuItem value="Adventure">🏔️ Adventure</MenuItem>
                                <MenuItem value="Nature">🏖️ Nature</MenuItem>
                                <MenuItem value="Food & Wine">🍷 Food & Wine</MenuItem>
                                <MenuItem value="Urban">✈️ Urban</MenuItem>
                                <MenuItem value="Travel">✈️ Travel</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    
                    {/* Additional Filters Row */}
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            {/* Price Filter */}
                            <Box sx={{ px: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom align="center">
                                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                                </Typography>
                                <Slider
                                    value={priceRange}
                                    onChange={(e, newValue) => setPriceRange(newValue)}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={5000}
                                    step={50}
                                    sx={{
                                        color: 'primary.main',
                                        '& .MuiSlider-thumb': {
                                            backgroundColor: 'primary.main',
                                        },
                                        '& .MuiSlider-track': {
                                            backgroundColor: 'primary.main',
                                        },
                                    }}
                                />
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            {/* Likes Filter */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Show only liked vacations:
                                </Typography>
                                <Button
                                    variant={showOnlyLiked ? "contained" : "outlined"}
                                    color="error"
                                    size="small"
                                    startIcon={<Favorite />}
                                    onClick={() => setShowOnlyLiked(!showOnlyLiked)}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                    }}
                                >
                                    {showOnlyLiked ? 'ON' : 'OFF'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                        <CircularProgress size={48} />
                    </Box>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
                )}

                {!loading && !error && filteredVacations.length === 0 && (
                    <Typography align="center" color="text.secondary" mt={6}>
                        {searchTerm ? `No vacations found matching "${searchTerm}"` : 'No vacations found.'}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                    {filteredVacations.map((vac) => (
                        <Box key={vac.id || vac.vacation_id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
                            <Card sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: 4,
                                borderRadius: 3,
                                border: '1px solid rgba(0,0,0,0.08)',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                '&:hover': { boxShadow: 8, transform: 'translateY(-3px)' }
                            }}>
                                {vac.image_filename && (
                                    <Box sx={{ position: 'relative', width: '100%', pt: '56.25%' /* 16:9 aspect ratio */ }}>
                                        <CardMedia
                                            component="img"
                                            image={vac.image_filename.startsWith('http') ? vac.image_filename : `http://localhost:5003/images/${vac.image_filename}`}
                                            alt={vac.destination || 'Vacation'}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '8px 8px 0 0',
                                            }}
                                            onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x169?text=No+Image'; }}
                                        />
                                    </Box>
                                )}
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    {(() => {
                                        const category = getVacationCategory(vac.description);
                                        const IconComponent = category.icon;
                                        return (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Typography variant="h3" fontWeight={800} color="primary" sx={{ letterSpacing: 0.2 }}>
                                                    {cleanTitle(vac.description)}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <IconComponent sx={{ fontSize: 20, color: `${category.color}.main` }} />
                                                    <Typography variant="body2" sx={{ color: `${category.color}.main`, fontWeight: 600 }}>
                                                        {category.name}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        );
                                    })()}
                                    <Typography variant="body2" color="text.secondary" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <span role="img" aria-label="likes">❤️</span> {likesCount[vac.vacation_id] || 0} likes
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 700, mb: 1, flexGrow: 1 }}>
                                        {vac.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <CalendarMonth sx={{ fontSize: 18, color: 'info.main' }} />
                                        <Typography variant="body2">
                                            {vac.start_date} - {vac.end_date}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BeachAccess sx={{ fontSize: 18, color: 'secondary.main' }} />
                                        <Typography variant="body2" fontWeight={600}>
                                            ${vac.price}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ mt: 'auto', justifyContent: 'flex-end' }}>
                                    {isAuthenticated && user && user.user_id && !isAdmin && (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {likes.includes(vac.vacation_id) ? (
                                                <Favorite
                                                    sx={{ color: 'error.main', cursor: 'pointer', fontSize: 28 }}
                                                    onClick={() => handleUnlike(vac.vacation_id)}
                                                />
                                            ) : (
                                                <FavoriteBorder
                                                    sx={{ color: 'error.main', cursor: 'pointer', fontSize: 28 }}
                                                    onClick={() => handleLike(vac.vacation_id)}
                                                />
                                            )}
                                        </Box>
                                    )}
                                    <Button variant="contained" color="primary" size="small" sx={{ ml: 1 }}>
                                        Book Now
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default Vacations;