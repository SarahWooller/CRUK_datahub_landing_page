'use client'; // Required for Next.js App Router components that use state

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Badge,
  Stack,
  Collapse
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// --- Brand Colors (Extracted from your style.css) ---
const COLORS = {
  blue: '#00468C',
  pink: '#D10A6F',
  white: '#FFFFFF',
  lightBg: '#F0F2F5',
  border: '#AAB7C4'
};

// --- Data Generation (Kept identical to your original logic) ---
const ICON_OPTS = [
    { url: "../assets/animal.webp", label: "Model Organism Study" },
    { url: "../assets/background.webp", label: "Background Information" },
    { url: "../assets/biobank.webp", label: "Samples Available" },
    { url: "../assets/invitro.webp", label: "In Vitro Study" },
    { url: "../assets/lab_results.webp", label: "Lab Results" },
    { url: "../assets/longitudinal.webp", label: "Longitudinal Study" },
    { url: "../assets/medical_imaging.webp", label: "Medical Imaging" },
    { url: "../assets/omics.webp", label: "Omics" },
    { url: "../assets/population.webp", label: "Patient Study" },
    { url: "../assets/treatments.webp", label: "Treatments" }
];

const generateMockStudies = () => {
    const titles = [
        "Genomic Profiling of Triple-Negative Breast Cancer", "AI-Driven Drug Discovery for Pancreatic Cancer",
        "Immunotherapy Response in Lung Cancer Patients", "Early Detection Biomarkers for Ovarian Cancer",
        "Personalized Radiation Therapy for Brain Tumors", "Epigenetic Modifications in Colon Cancer Progression",
        "Targeting Metabolism in Glioblastoma Multiforme", "Circulating Tumor DNA for Disease Monitoring",
        "Novel Therapies for Pediatric Leukemias", "Understanding Metastasis in Prostate Cancer"
    ];
    const institutes = [
        "Cancer Research Institute", "Global Oncology Center", "Biomedical Research Hub",
        "University Cancer Center", "National Health Institute"
    ];
    const accesses = ["Access restricted at present","Closed to access",
    "Open in response to specific calls","Open only through collaboration","Open to applicants"
    ];
    const positions = ["D", "E", "B", "C", "A"];

    const studiesData = [];

    for (let i = 1; i <= 50; i++) {
        const j = Math.floor(Math.random() * positions.length);
        const randomAccess = accesses[j];
        const randomAccessPos = positions[j];
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const randomInstitute = institutes[Math.floor(Math.random() * institutes.length)];
        const randomDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const earliestDate = new Date(Date.now() - Math.floor(Math.random() * 10 * 365 * 24 * 60 * 60 * 1000));
        const popSize = Math.floor(Math.random() * 39991) + 10;
        const shuffledIcons = [...ICON_OPTS].sort(() => 0.5 - Math.random());
        const selectedIcons = shuffledIcons.slice(0, Math.floor(Math.random() * 5));

        studiesData.push({
            id: i,
            position: `${randomAccessPos}`,
            accessPhrase: `${randomAccess}`,
            studyTitle: `${randomTitle} (Study ${i})`,
            leadResearcherInstitute: `Dr. ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}. ${randomInstitute}`,
            populationSize: popSize,
            dateAdded: randomDate.toISOString().split('T')[0],
            dateStarted: randomDate.toISOString().split('T')[0],
            earliestData: earliestDate.toISOString().split('T')[0],
            studyIcons: selectedIcons,
            synopsis: `This dataset explores ${randomTitle} with a cohort of ${popSize} subjects. The primary focus includes analyzing longitudinal markers and response variations to established protocols. Data collection began in ${earliestDate.getFullYear()}.`
        });
    }
    return studiesData;
};

const INITIAL_STUDIES_DATA = generateMockStudies();

// --- Main Component ---
export const StudiesSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeepSearch, setIsDeepSearch] = useState(false);
    const [sortConfig, setSortConfig] = useState({ column: 'dateAdded', direction: 'desc' });
    const [studies, setStudies] = useState(INITIAL_STUDIES_DATA);
    const [showSynopsis, setShowSynopsis] = useState(true);

    const [cart, setCart] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [showCartModal, setShowCartModal] = useState(false);

    const toggleFavourite = (id) => {
        if (favourites.includes(id)) {
            setFavourites(favourites.filter(favId => favId !== id));
        } else {
            setFavourites([...favourites, id]);
        }
    };

    const toggleCart = (study) => {
        const isInCart = cart.find(item => item.id === study.id);
        if (isInCart) {
            setCart(cart.filter(item => item.id !== study.id));
        } else {
            setCart([...cart, study]);
        }
    };

    const filteredAndSortedStudies = useMemo(() => {
        let currentStudies = [...studies];

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentStudies = currentStudies.filter(study =>
                study.studyTitle.toLowerCase().includes(lowerCaseSearchTerm) ||
                (isDeepSearch && study.leadResearcherInstitute.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }

        currentStudies.sort((a, b) => {
            if (sortConfig.column === 'favourite') {
                const isFavA = favourites.includes(a.id);
                const isFavB = favourites.includes(b.id);
                if (isFavA === isFavB) return 0;
                return sortConfig.direction === 'desc' ? (isFavA ? -1 : 1) : (isFavA ? 1 : -1);
            }

            const valA = a[sortConfig.column];
            const valB = b[sortConfig.column];

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return currentStudies;
    }, [studies, searchTerm, isDeepSearch, sortConfig, favourites]);

    const handleSort = (column) => {
        setSortConfig(prevConfig => ({
            column,
            direction: prevConfig.column === column && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleDownloadMetadata = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cart, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "studies_metadata.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // Helper to render sort arrow
    const SortIcon = ({ column }) => {
        if (sortConfig.column !== column) return null;
        return sortConfig.direction === 'asc'
            ? <ArrowUpwardIcon fontSize="small" sx={{ opacity: 0.7, ml: 0.5 }} />
            : <ArrowDownwardIcon fontSize="small" sx={{ opacity: 0.7, ml: 0.5 }} />;
    };

    // Define table headers for cleaner render loop
    const headers = [
        { id: 'leadResearcherInstitute', label: 'Lead Researcher' },
        { id: 'populationSize', label: 'Pop. Size' },
        { id: 'position', label: 'Accessibility' },
        { id: 'earliestData', label: 'Earliest Data' },
        { id: 'dateStarted', label: 'Start Date' },
        { id: 'dateAdded', label: 'Updated' },
    ];

    return (
        <Paper elevation={0} sx={{ p: 4, bgcolor: COLORS.white }}>
            {/* Header Section */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, pb: 1 }}>
                <Typography variant="h4" component="h2" sx={{ color: COLORS.blue, fontWeight: 'bold' }}>
                    Studies
                </Typography>
            </Box>

            {/* Controls Container */}
            <Paper
                elevation={0}
                variant="outlined"
                sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: COLORS.lightBg,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    flexWrap: 'wrap'
                }}
            >
                {/* Search */}
                <TextField
                    label="Search studies..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 300, bgcolor: 'white' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Cart Badge */}
                <IconButton onClick={() => setShowCartModal(true)} color="primary">
                    <Badge badgeContent={cart.length} color="error">
                        <ShoppingCartIcon sx={{ fontSize: 28 }} />
                    </Badge>
                </IconButton>

                {/* Deep Search Checkbox */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isDeepSearch}
                            onChange={(e) => setIsDeepSearch(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Deep Search"
                />

                {/* Sort Dropdown */}
                <TextField
                    select
                    label="Sort by"
                    size="small"
                    value={sortConfig.column}
                    onChange={(e) => handleSort(e.target.value)}
                    sx={{ width: 180, bgcolor: 'white' }}
                >
                    <MenuItem value="favourite">Favourites</MenuItem>
                    <MenuItem value="dateAdded">Updated Date</MenuItem>
                    <MenuItem value="studyTitle">Study Title</MenuItem>
                    <MenuItem value="leadResearcherInstitute">Lead Researcher</MenuItem>
                    <MenuItem value="populationSize">Population Size</MenuItem>
                    <MenuItem value="position">Accessibility</MenuItem>
                    <MenuItem value="earliestData">Earliest Data</MenuItem>
                    <MenuItem value="dateStarted">Start Date</MenuItem>
                </TextField>

                {/* Collapse/Expand Toggle */}
                <Button
                    onClick={() => setShowSynopsis(!showSynopsis)}
                    sx={{ ml: 'auto', textTransform: 'none', fontWeight: 'bold' }}
                >
                    {showSynopsis ? "Collapse Synopses" : "Expand Synopses"}
                </Button>
            </Paper>

            {/* Table */}
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 800 }}>
                <Table stickyHeader sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            {headers.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    onClick={() => handleSort(headCell.id)}
                                    sx={{
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        bgcolor: COLORS.lightBg,
                                        '&:hover': { bgcolor: '#e2e6ea' }
                                    }}
                                >
                                    <Box display="flex" alignItems="center">
                                        {headCell.label}
                                        <SortIcon column={headCell.id} />
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAndSortedStudies.map((study) => {
                            const isFav = favourites.includes(study.id);
                            const isInCart = cart.some(c => c.id === study.id);

                            return (
                                <React.Fragment key={study.id}>
                                    {/* Row 1: Title and Actions */}
                                    <TableRow sx={{ bgcolor: 'white', '& > td': { borderBottom: 'none' } }}>
                                        <TableCell colSpan={6} sx={{ pt: 3, pb: 1 }}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                {/* Actions */}
                                                <Stack direction="row">
                                                    <IconButton onClick={() => toggleFavourite(study.id)} color={isFav ? "error" : "default"}>
                                                        {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                    </IconButton>
                                                    <IconButton onClick={() => toggleCart(study)} color={isInCart ? "primary" : "default"}>
                                                        <ShoppingCartIcon />
                                                    </IconButton>
                                                </Stack>

                                                {/* Title Link */}
                                                <Typography
                                                    variant="h6"
                                                    component="a"
                                                    href="../metadata.html"
                                                    sx={{
                                                        color: COLORS.blue,
                                                        textDecoration: 'none',
                                                        fontWeight: 'bold',
                                                        '&:hover': { textDecoration: 'underline' }
                                                    }}
                                                >
                                                    {study.studyTitle}
                                                </Typography>

                                                {/* Icons with MUI Tooltip */}
                                                <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                                                    {study.studyIcons.map((icon, idx) => (
                                                        <Tooltip key={idx} title={icon.label} arrow placement="top">
                                                            <Box
                                                                component="img"
                                                                src={icon.url}
                                                                alt={icon.label}
                                                                sx={{ height: 24, width: 'auto', cursor: 'help' }}
                                                            />
                                                        </Tooltip>
                                                    ))}
                                                </Stack>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>

                                    {/* Row 2: Data */}
                                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                                        <TableCell>{study.leadResearcherInstitute}</TableCell>
                                        <TableCell>{study.populationSize.toLocaleString()}</TableCell>
                                        <TableCell>{study.accessPhrase}</TableCell>
                                        <TableCell>{study.earliestData}</TableCell>
                                        <TableCell>{study.dateStarted}</TableCell>
                                        <TableCell>{study.dateAdded}</TableCell>
                                    </TableRow>

                                    {/* Row 3: Synopsis (Collapsible) */}
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={showSynopsis} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1, p: 2, bgcolor: COLORS.lightBg, fontStyle: 'italic', borderRadius: 1 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Synopsis: </strong>{study.synopsis}
                                                    </Typography>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Cart Modal (Dialog) */}
            <Dialog
                open={showCartModal}
                onClose={() => setShowCartModal(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Your Cart ({cart.length})</DialogTitle>
                <DialogContent dividers>
                    {cart.length === 0 ? (
                        <Typography>Your cart is empty.</Typography>
                    ) : (
                        <List dense>
                            {cart.map((item) => (
                                <ListItem key={item.id} divider>
                                    <ListItemText primary={item.studyTitle} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCartModal(false)}>Close</Button>
                    {cart.length > 0 && (
                        <Button
                            onClick={handleDownloadMetadata}
                            variant="contained"
                            color="primary"
                        >
                            Download Metadata
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Paper>
    );
};