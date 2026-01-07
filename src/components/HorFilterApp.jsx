'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox,
    Chip,
    Paper,
    Tabs,
    Tab,
    List,
    ListItem,
    Collapse,
    Tooltip,
    Stack,
    Grid,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Badge,
    Divider
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Preserved Logic Imports
import { filterDetailsMap, filterData } from '../utils/filter-setup';
import { filterType, includeParents, plusParents, getMessage, calculateLogicMessage } from '../utils/logic-utils';
import { executeFilterLogic } from '../utils/filterLogic.js';

// --- Brand Colors ---
const COLORS = {
    blue: '#00468C',
    pink: '#D10A6F',
    white: '#FFFFFF',
    lightBg: '#F0F2F5',
    border: '#AAB7C4'
};

// --- Utility Components ---

const SearchInput = ({ searchTerm, setSearchTerm, isSearching, placeholder }) => (
    <Box sx={{ mb: 3 }}>
        <TextField
            fullWidth
            placeholder={placeholder || "Search terms (min 4 characters)..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            variant="outlined"
            helperText={searchTerm && searchTerm.length < 4 ? "Please enter at least 4 characters to search." : ""}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        {isSearching ? <CircularProgress size={20} sx={{ color: COLORS.pink }} /> : <SearchIcon color="disabled" />}
                    </InputAdornment>
                ),
                sx: { bgcolor: 'white' }
            }}
        />
    </Box>
);

// --- Nested Filter List Components ---

const NestedFilterList = ({ items, handleFilterChange, selectedFilters, level = 0 }) => {
    if (!items || items.length === 0) return null;
    const itemsArray = Array.isArray(items) ? items : Object.values(items);

    return (
        <List component="div" disablePadding dense>
            {itemsArray.map(item => (
                <NestedFilterItem
                    key={item.id}
                    item={item}
                    handleFilterChange={handleFilterChange}
                    selectedFilters={selectedFilters}
                    level={level}
                />
            ))}
        </List>
    );
};

const NestedFilterItem = ({ item, handleFilterChange, selectedFilters, level }) => {
    const fullId = item.id;
    const childrenArray = item.children ? Object.values(item.children) : [];
    const hasChildren = childrenArray.length > 0;
    const isChecked = selectedFilters.has(fullId);
    const hasDescription = item.description && item.description.trim().length > 0;

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = (e) => {
        e.stopPropagation();
        setIsExpanded(prev => !prev);
    };

    return (
        <>
            <ListItem
                disableGutters
                sx={{
                    pl: level * 2,
                    py: 0.5,
                    '&:hover': { bgcolor: 'action.hover' }
                }}
            >
                <Box sx={{ width: 24, display: 'flex', justifyContent: 'center', mr: 0.5 }}>
                    {hasChildren && (
                        <IconButton onClick={toggleExpansion} size="small" sx={{ p: 0.5 }}>
                            {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                        </IconButton>
                    )}
                </Box>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isChecked}
                            onChange={() => handleFilterChange(fullId)}
                            size="small"
                            sx={{
                                color: COLORS.border,
                                '&.Mui-checked': { color: COLORS.pink },
                            }}
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ userSelect: 'none', color: 'text.primary' }}>
                                {item.label}
                                <Typography component="span" variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>
                                    ({item.count})
                                </Typography>
                            </Typography>
                            {hasDescription && (
                                <Tooltip title={item.description} arrow placement="top">
                                    <InfoOutlinedIcon
                                        fontSize="inherit"
                                        sx={{ ml: 1, color: 'text.disabled', fontSize: '1rem', cursor: 'help' }}
                                    />
                                </Tooltip>
                            )}
                        </Box>
                    }
                    sx={{ flexGrow: 1, ml: 0, mr: 0 }}
                />
            </ListItem>

            {hasChildren && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <NestedFilterList
                        items={childrenArray}
                        handleFilterChange={handleFilterChange}
                        selectedFilters={selectedFilters}
                        level={level + 1}
                    />
                </Collapse>
            )}
        </>
    );
};

// --- Logic Summary Component ---

const FilterLogicSummary = ({
    selectedFilters,
    logicMessage,
    setLogicMessage,
    isMessageManuallyEdited,
    setIsMessageManuallyEdited,
}) => {
    // Utility references passed down conceptually or imported
    const handleReset = useCallback(() => {
        const filters = Array.from(selectedFilters);
        const autoMessage = calculateLogicMessage(filters, filterType, plusParents, includeParents, getMessage);
        setLogicMessage(autoMessage);
        setIsMessageManuallyEdited(false);
    }, [selectedFilters, setLogicMessage, setIsMessageManuallyEdited]);

    if (!selectedFilters || selectedFilters.size === 0) return null;

    return (
        <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: COLORS.lightBg, borderColor: isMessageManuallyEdited ? 'warning.main' : 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">Filter Logic</Typography>
                {isMessageManuallyEdited && (
                    <Button size="small" onClick={handleReset} variant="outlined" color="primary">
                        Reset to Auto Logic
                    </Button>
                )}
            </Box>

            <TextField
                fullWidth
                multiline
                minRows={2}
                maxRows={6}
                value={logicMessage || "No filters selected"}
                onChange={(e) => {
                    setLogicMessage(e.target.value);
                    setIsMessageManuallyEdited(true);
                }}
                variant="outlined"
                size="small"
                sx={{ bgcolor: 'white' }}
                inputProps={{ style: { fontFamily: 'monospace', fontSize: '0.85rem' } }}
            />

            {isMessageManuallyEdited && (
                <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                    Note: Filter logic has been manually edited. Reset logic to resume auto-updates.
                </Typography>
            )}
        </Paper>
    );
};

// --- Filter Chip Area ---

const FilterChipArea = ({
    selectedFilters,
    handleFilterChange,
    logicMessage,
    setLogicMessage,
    isMessageManuallyEdited,
    setIsMessageManuallyEdited,
}) => {
    const chips = useMemo(() => {
        return Array.from(selectedFilters).map(fullId => {
            const details = filterDetailsMap.get(fullId);
            if (!details) return null;
            return {
                fullId,
                label: details.label,
                category: details.category,
                isCancer: details.group === 'cancer-type'
            };
        }).filter(Boolean);
    }, [selectedFilters]);

    if (chips.length === 0) return null;

    return (
        <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {chips.map(chip => (
                    <Chip
                        key={chip.fullId}
                        label={
                            <span>
                                <span style={{ opacity: 0.7 }}>{chip.category}: </span>
                                <strong>{chip.label}</strong>
                            </span>
                        }
                        onDelete={() => handleFilterChange(chip.fullId)}
                        deleteIcon={<CloseIcon />}
                        variant="outlined"
                        size="small"
                        sx={{
                            color: chip.isCancer ? COLORS.pink : COLORS.blue,
                            borderColor: chip.isCancer ? COLORS.pink : COLORS.blue,
                            bgcolor: 'white',
                            fontWeight: 500
                        }}
                    />
                ))}
            </Box>
            <FilterLogicSummary
                selectedFilters={selectedFilters}
                logicMessage={logicMessage}
                setLogicMessage={setLogicMessage}
                isMessageManuallyEdited={isMessageManuallyEdited}
                setIsMessageManuallyEdited={setIsMessageManuallyEdited}
            />
        </Paper>
    );
};

// --- Panels ---

const CancerTypePanel = ({ handleFilterChange, selectedFilters, searchTerm, setSearchTerm, filteredIds, isSearching, pruneHierarchy }) => {
    const [selectedClassification, setSelectedClassification] = useState(null);
    const cancerGroups = filterData['0_0'].children;

    // Pruning Data
    const filteredTopography = pruneHierarchy(cancerGroups['0_0_0']?.children, filteredIds);
    const filteredHistology = pruneHierarchy(cancerGroups['0_0_1']?.children, filteredIds);
    const filteredCruk = pruneHierarchy(cancerGroups['0_0_2']?.children, filteredIds);
    const filteredSnomed = pruneHierarchy(cancerGroups['0_0_3']?.children || {}, filteredIds);
    const filteredTcga = pruneHierarchy(cancerGroups['0_0_4']?.children || {}, filteredIds);

    const listProps = { handleFilterChange, selectedFilters };
    const scrollContainerStyle = { maxHeight: 400, overflowY: 'auto', pr: 1 };

    // Card Component
    const ClassificationCard = ({ title, description, classificationKey, emoji }) => {
        // Calculate count
        let count = 0;
        const prefixMap = { 'icdo': '0_0_0', 'icdo_hist': '0_0_1', 'cruk': '0_0_2', 'snomed': '0_0_3', 'tcga': '0_0_4' };

        selectedFilters.forEach(id => {
            if (classificationKey === 'icdo') {
                if (id.startsWith('0_0_0') || id.startsWith('0_0_1')) count++;
            } else if (id.startsWith(prefixMap[classificationKey])) {
                count++;
            }
        });

        const isSelected = selectedClassification === classificationKey;

        return (
            <Card
                variant="outlined"
                sx={{
                    height: '100%',
                    borderColor: isSelected ? COLORS.pink : 'divider',
                    borderWidth: isSelected ? 2 : 1,
                    transition: 'transform 0.2s',
                    '&:hover': { borderColor: COLORS.pink, transform: 'translateY(-2px)' }
                }}
            >
                <CardActionArea onClick={() => setSelectedClassification(classificationKey)} sx={{ height: '100%', p: 2 }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ mb: 2 }}>{emoji}</Typography>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>{title}</Typography>
                        <Typography variant="body2" color="text.secondary">{description}</Typography>
                        {count > 0 && (
                            <Chip
                                label={`${count} Selected`}
                                size="small"
                                sx={{ mt: 2, bgcolor: COLORS.pink, color: 'white' }}
                            />
                        )}
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    };

    const renderContent = () => {
        const searchBox = (
            <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isSearching={isSearching}
                placeholder={`Search ${selectedClassification?.toUpperCase() || ''} terms`}
            />
        );

        switch (selectedClassification) {
            case 'cruk':
                return (
                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>CRUK Cancer Terms</Typography>
                        {searchBox}
                        <Box sx={scrollContainerStyle}>
                            <NestedFilterList items={filteredCruk} {...listProps} />
                        </Box>
                    </Box>
                );
            case 'tcga':
                return (
                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>TCGA Terms</Typography>
                        {searchBox}
                        <Box sx={scrollContainerStyle}>
                            <NestedFilterList items={filteredTcga} {...listProps} />
                        </Box>
                    </Box>
                );
            case 'snomed':
                return (
                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>SNOMED-CT Terms</Typography>
                        {searchBox}
                        <Box sx={scrollContainerStyle}>
                            <NestedFilterList items={filteredSnomed} {...listProps} />
                        </Box>
                    </Box>
                );
            case 'icdo':
                return (
                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>ICD-O Classification</Typography>
                        {searchBox}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: COLORS.lightBg }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Topography</Typography>
                                    <Box sx={scrollContainerStyle}>
                                        <NestedFilterList items={filteredTopography} {...listProps} />
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: COLORS.lightBg }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Histology</Typography>
                                    <Box sx={scrollContainerStyle}>
                                        <NestedFilterList items={filteredHistology} {...listProps} />
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3, bgcolor: 'white', minHeight: 500 }}>
            {selectedClassification ? (
                <Box>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => { setSelectedClassification(null); setSearchTerm(''); }}
                        sx={{ mb: 2, textTransform: 'none' }}
                    >
                        Back to Selection
                    </Button>
                    <Divider sx={{ mb: 3 }} />
                    {renderContent()}
                </Box>
            ) : (
                <Box>
                    <Typography variant="h5" align="center" sx={{ mb: 1, fontWeight: 'bold', color: COLORS.blue }}>
                        Select Classification Method
                    </Typography>
                    <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
                        Choose a terminology standard to begin filtering
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <ClassificationCard title="CRUK Terms" description="Simplified terms." classificationKey="cruk" emoji="🏥" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <ClassificationCard title="TCGA Terms" description="The Cancer Genome Atlas." classificationKey="tcga" emoji="🧬" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <ClassificationCard title="SNOMED-CT" description="Systematized Nomenclature." classificationKey="snomed" emoji="🏷️" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <ClassificationCard title="ICD-O" description="Official pathology terms." classificationKey="icdo" emoji="🔬" />
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Paper>
    );
};

const DataTypePanel = ({ handleFilterChange, selectedFilters, searchTerm, setSearchTerm, filteredIds, isSearching, pruneHierarchy }) => {
    const dataTypeGroups = filterData['0_2'].children;
    const sections = [
        { title: "Biobank", items: dataTypeGroups['0_2_0'].children },
        { title: "In Vitro", items: dataTypeGroups['0_2_1'].children },
        { title: "Model Organisms", items: dataTypeGroups['0_2_2'].children },
        { title: "Patient Studies", items: dataTypeGroups['0_2_3'].children },
        { title: "Non-Bio", items: dataTypeGroups['0_2_4'].children }
    ];

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, color: COLORS.blue }}>Data Type Selection</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Select one or more modalities to include.</Typography>

            <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} isSearching={isSearching} placeholder="Search data types" />

            <Grid container spacing={2}>
                {sections.map((sec, idx) => (
                    <Grid item xs={12} sm={6} md={4} lg={2.4} key={idx}>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: COLORS.lightBg, height: '100%' }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                                {sec.title}
                            </Typography>
                            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                <NestedFilterList
                                    items={pruneHierarchy(sec.items, filteredIds)}
                                    handleFilterChange={handleFilterChange}
                                    selectedFilters={selectedFilters}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

const AccessibilityPanel = ({ handleFilterChange, selectedFilters, searchTerm, setSearchTerm, filteredIds, isSearching }) => {
    const items = Object.values(filterData['0_1'].children);

    const visibleItems = useMemo(() => {
        if (!filteredIds) return items;
        return items.filter(item => filteredIds.has(item.id));
    }, [items, filteredIds]);

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, color: COLORS.blue }}>Accessibility</Typography>
            <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} isSearching={isSearching} placeholder="Search access terms" />

            <Paper variant="outlined" sx={{ p: 2, maxHeight: 400, overflowY: 'auto' }}>
                {visibleItems.map(item => (
                    <FormControlLabel
                        key={item.id}
                        control={
                            <Checkbox
                                checked={selectedFilters.has(item.id)}
                                onChange={() => handleFilterChange(item.id)}
                                sx={{ color: COLORS.border, '&.Mui-checked': { color: COLORS.pink } }}
                            />
                        }
                        label={
                            <Typography variant="body2">
                                {item.label} <Typography component="span" variant="caption" color="text.secondary">({item.count})</Typography>
                            </Typography>
                        }
                        sx={{ display: 'flex', width: '100%', mb: 1 }}
                    />
                ))}
            </Paper>
        </Paper>
    );
};
// --- Main App Component ---

export const FilterApp = () => {
    // CHANGE 1: Set initial state to false so no panel is open by default
    const [activePanel, setActivePanel] = useState(false);

    const [selectedFilters, setSelectedFilters] = useState(new Set());
    const [logicMessage, setLogicMessage] = useState("");
    const [isMessageManuallyEdited, setIsMessageManuallyEdited] = useState(false);

    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIds, setFilteredIds] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const allFiltersArray = useMemo(() => Array.from(filterDetailsMap.values()), []);

    // Effect: Update Logic Message
    useEffect(() => {
        if (!isMessageManuallyEdited) {
            const filters = Array.from(selectedFilters);
            const newMessage = calculateLogicMessage(filters, filterType, plusParents, includeParents, getMessage);
            setLogicMessage(newMessage);
        }
    }, [selectedFilters, isMessageManuallyEdited]);

    // Effect: Search Debounce
    useEffect(() => {
        if (!searchTerm || searchTerm.length < 4) {
            setFilteredIds(null);
            setIsSearching(false);
            return;
        }

        const timer = setTimeout(() => {
            setIsSearching(true);
            const activeGroupMap = { 'cancer': 'cancer-type', 'data': 'data-type', 'access': 'access' };

            // If search is used but no panel is open, default to 'cancer' to show results,
            // OR simply return if we strictly want them to click a tab first.
            // Here we only search if a panel is actually active.
            if (!activePanel || !activeGroupMap[activePanel]) {
                setFilteredIds(null);
                setIsSearching(false);
                return;
            }

            const activeGroup = activeGroupMap[activePanel];

            const lower = searchTerm.toLowerCase();
            const results = allFiltersArray.filter(item =>
                item.group === activeGroup && item.label.toLowerCase().includes(lower)
            );
            setFilteredIds(new Set(results.map(i => i.id)));
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, activePanel, allFiltersArray]);

    const pruneHierarchy = useCallback((nodes, currentFilteredIds) => {
        if (!nodes) return null;
        if (!currentFilteredIds) return nodes;
        const filtered = {};
        const arr = Array.isArray(nodes) ? nodes : Object.values(nodes);
        arr.forEach(item => {
            const kids = pruneHierarchy(item.children, currentFilteredIds);
            if (currentFilteredIds.has(item.id) || (kids && Object.keys(kids).length > 0)) {
                filtered[item.id] = { ...item, children: kids };
            }
        });
        return Object.keys(filtered).length > 0 ? filtered : null;
    }, []);

    const counts = useMemo(() => {
        let c=0, d=0, a=0;
        selectedFilters.forEach(id => {
            const grp = filterDetailsMap.get(id)?.group;
            if (grp === 'cancer-type') c++;
            else if (grp === 'data-type') d++;
            else if (grp === 'access') a++;
        });
        return { total: selectedFilters.size, cancer: c, data: d, access: a };
    }, [selectedFilters]);

    const handleFilterChange = useCallback((id) => {
        setSelectedFilters(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            if (isMessageManuallyEdited) setIsMessageManuallyEdited(false);
            return next;
        });
    }, [isMessageManuallyEdited]);

    const clearAllFilters = useCallback(() => {
        setSelectedFilters(new Set());
        setSearchTerm('');
        setLogicMessage('');
        setIsMessageManuallyEdited(false);
        // Optional: Reset active panel to false on clear?
        // setActivePanel(false);
    }, []);

    const handleFindStudies = useCallback(() => {
        if (counts.total > 0 && logicMessage) {
            const results = executeFilterLogic(logicMessage);
            console.log("Search Results:", results);
        }
    }, [counts.total, logicMessage]);

    const handleTabChange = (event, newValue) => {
        setActivePanel(newValue);
        setSearchTerm(''); // Clear search when switching tabs
    };

    const commonProps = {
        handleFilterChange, selectedFilters, searchTerm, setSearchTerm, filteredIds, isSearching, pruneHierarchy
    };

    return (
        <Box sx={{ p: { xs: 1, md: 4 }, bgcolor: COLORS.lightBg, minHeight: 'auto' }}>
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {/* Top Bar: Title & Actions */}
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mr: 4 }}>
                        Study Filters
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        startIcon={<DeleteOutlineIcon />}
                        onClick={clearAllFilters}
                        color="inherit"
                        disabled={counts.total === 0}
                    >
                        Clear Filters
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleFindStudies}
                        disabled={counts.total === 0}
                        sx={{
                            bgcolor: COLORS.pink,
                            '&:hover': { bgcolor: '#b0085d' },
                            fontWeight: 'bold',
                            px: 4
                        }}
                    >
                        Find Studies ({counts.total})
                    </Button>
                </Box>

                {/* Tabs */}
                {/* CHANGE 2: Ensure value handles 'false' correctly */}
                <Tabs
                    value={activePanel || false}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: 'white',
                        '& .Mui-selected': { color: `${COLORS.pink} !important` },
                        '& .MuiTabs-indicator': { bgcolor: COLORS.pink, height: 4 }
                    }}
                >
                    <Tab
                        label={<Badge badgeContent={counts.cancer} color="primary">Cancer Type</Badge>}
                        value="cancer"
                        sx={{ py: 3, fontWeight: 'bold', minWidth: 150 }}
                    />
                    <Tab
                        label={<Badge badgeContent={counts.data} color="primary">Data Type</Badge>}
                        value="data"
                        sx={{ py: 3, fontWeight: 'bold', minWidth: 150 }}
                    />
                    <Tab
                        label={<Badge badgeContent={counts.access} color="primary">Accessibility</Badge>}
                        value="access"
                        sx={{ py: 3, fontWeight: 'bold', minWidth: 150 }}
                    />
                </Tabs>

                {/* Main Content Area */}
                <Box sx={{ p: 0 }}>
                    {/* Chip Area / Logic Summary (Always visible if filters exist) */}
                    <Box sx={{ p: 3, pb: 0 }}>
                        <FilterChipArea
                            selectedFilters={selectedFilters}
                            handleFilterChange={handleFilterChange}
                            logicMessage={logicMessage}
                            setLogicMessage={setLogicMessage}
                            isMessageManuallyEdited={isMessageManuallyEdited}
                            setIsMessageManuallyEdited={setIsMessageManuallyEdited}
                        />
                    </Box>

                    {/* Panels */}
                    <Box sx={{ p: 0 }}>
                        {/* CHANGE 3: Add a friendly placeholder when no tab is active */}
                        {!activePanel && (
                            <Box sx={{ p: 4, textAlign: 'center', opacity: 0.6 }}>
                                <Typography variant="body1" color="text.secondary">
                                     Select a category above (Cancer Type, Data Type, or Accessibility) to begin.
                                </Typography>
                            </Box>
                        )}
                        {activePanel === 'cancer' && <CancerTypePanel {...commonProps} />}
                        {activePanel === 'data' && <DataTypePanel {...commonProps} />}
                        {activePanel === 'access' && <AccessibilityPanel {...commonProps} />}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

