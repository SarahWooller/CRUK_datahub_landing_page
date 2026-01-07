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
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

// Keep your existing utility import
import { filterDetailsMap, filterData } from '../utils/filter-setup';

// --- Brand Colors (Matches your style.css) ---
const COLORS = {
  blue: '#00468C',
  pink: '#D10A6F',
  white: '#FFFFFF',
  lightBg: '#F0F2F5',
  border: '#AAB7C4'
};

// --- Helper Components ---

export const FilterChipArea = ({ selectedFilters, handleFilterChange }) => {
    const chips = useMemo(() => {
        return selectedFilters.map(fullId => {
            const details = filterDetailsMap.get(fullId);
            if (!details) return null;

            const isCancer = details.group === 'cancer-type';
            return {
                fullId,
                label: details.label,
                category: details.category,
                isCancer
            };
        }).filter(Boolean);
    }, [selectedFilters]);

    if (chips.length === 0) {
        return <Typography variant="body2" color="text.secondary" fontStyle="italic">No filters selected.</Typography>;
    }

    return (
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
                    variant="outlined"
                    size="small"
                    deleteIcon={<CloseIcon />}
                    sx={{
                        color: chip.isCancer ? COLORS.pink : COLORS.blue,
                        borderColor: chip.isCancer ? COLORS.pink : COLORS.blue,
                        bgcolor: 'background.paper',
                        fontWeight: 500
                    }}
                />
            ))}
        </Box>
    );
};

// Nested List Components
const NestedFilterList = ({ items, handleFilterChange, selectedFiltersSet, level = 0 }) => {
    if (!items || items.length === 0) return null;
    const itemsArray = Array.isArray(items) ? items : Object.values(items);

    return (
        <List component="div" disablePadding dense>
            {itemsArray.map(item => (
                <NestedFilterItem
                    key={item.id}
                    item={item}
                    handleFilterChange={handleFilterChange}
                    selectedFiltersSet={selectedFiltersSet}
                    level={level}
                />
            ))}
        </List>
    );
};

const NestedFilterItem = ({ item, handleFilterChange, selectedFiltersSet, level }) => {
    const fullId = item.id;
    const childrenArray = item.children ? Object.values(item.children) : [];
    const hasChildren = childrenArray.length > 0;
    const isChecked = selectedFiltersSet.has(fullId);
    const hasDescription = item.description && item.description.trim().length > 0;

    // Auto-expand if a child is selected or if searched (optional logic improvement)
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = (e) => {
        e.stopPropagation(); // Prevent toggling checkbox when clicking arrow
        setIsExpanded(prev => !prev);
    };

    return (
        <>
            <ListItem
                disableGutters
                sx={{
                    pl: level * 2, // Indentation
                    py: 0.5
                }}
            >
                {/* Expand/Collapse Arrow */}
                <Box sx={{ width: 24, display: 'flex', justifyContent: 'center', mr: 0.5 }}>
                    {hasChildren && (
                        <IconButton onClick={toggleExpansion} size="small" sx={{ p: 0.5 }}>
                            {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                        </IconButton>
                    )}
                </Box>

                {/* Checkbox */}
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
                            <Typography variant="body2" sx={{ userSelect: 'none' }}>
                                {item.label}
                            </Typography>
                            {hasDescription && (
                                <Tooltip title={item.description} arrow placement="right">
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
                        selectedFiltersSet={selectedFiltersSet}
                        level={level + 1}
                    />
                </Collapse>
            )}
        </>
    );
};

const SearchInput = ({ searchTerm, setSearchTerm, isSearching, placeholder }) => (
    <Box sx={{ mb: 2 }}>
        <TextField
            fullWidth
            placeholder={placeholder || "Search terms (min 4 characters)..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            variant="outlined"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        {isSearching ? <CircularProgress size={20} sx={{ color: COLORS.pink }} /> : <SearchIcon color="disabled" />}
                    </InputAdornment>
                ),
                sx: {
                    bgcolor: 'white',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: COLORS.pink,
                    }
                }
            }}
        />
    </Box>
);

// --- Sub-Panels ---

const CancerTypePanel = ({ handleFilterChange, selectedFiltersSet, searchTerm, setSearchTerm, filteredIds, pruneHierarchy }) => {
    const cancerGroups = filterData['0_0'].children;
    const filteredTopo = pruneHierarchy(cancerGroups['0_0_0']?.children, filteredIds);
    const filteredHisto = pruneHierarchy(cancerGroups['0_0_1']?.children, filteredIds);

    const listProps = { handleFilterChange, selectedFiltersSet };
    const paperStyle = { p: 2, bgcolor: COLORS.lightBg, height: '100%', display: 'flex', flexDirection: 'column' };
    const listContainerStyle = { flexGrow: 1, overflowY: 'auto', maxHeight: 400, pr: 1 };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>ICD-O Classification</Typography>
            <Typography variant="caption" color="text.secondary" paragraph>
                Please provide the ICD-O Topography and Histology codes. You will be asked to provide translations later.
            </Typography>

            <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isSearching={false}
                placeholder="Search ICD-O terms..."
            />

            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} lg={6}>
                    <Paper variant="outlined" sx={paperStyle}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                            Topography
                        </Typography>
                        <Box sx={listContainerStyle}>
                            <NestedFilterList items={filteredTopo} {...listProps} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Paper variant="outlined" sx={paperStyle}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                            Histology
                        </Typography>
                        <Box sx={listContainerStyle}>
                            <NestedFilterList items={filteredHisto} {...listProps} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

const DataTypePanel = ({ handleFilterChange, selectedFiltersSet, searchTerm, setSearchTerm, filteredIds, pruneHierarchy }) => {
    const dataTypeGroups = filterData['0_2'].children;
    const sections = [
        { title: "Biobank", items: dataTypeGroups['0_2_0'].children },
        { title: "In Vitro", items: dataTypeGroups['0_2_1'].children },
        { title: "Model Organisms", items: dataTypeGroups['0_2_2'].children },
        { title: "Patient Studies", items: dataTypeGroups['0_2_3'].children },
        { title: "Non-Bio", items: dataTypeGroups['0_2_4'].children }
    ];

    return (
        <Box>
            <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} isSearching={false} placeholder="Search data types..." />
            <Grid container spacing={2}>
                {sections.map((sec, idx) => (
                    <Grid item xs={12} sm={6} lg={4} key={idx}>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: COLORS.lightBg, height: '100%' }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                                {sec.title}
                            </Typography>
                            <Box sx={{ maxHeight: 250, overflowY: 'auto', pr: 1 }}>
                                <NestedFilterList
                                    items={pruneHierarchy(sec.items, filteredIds)}
                                    handleFilterChange={handleFilterChange}
                                    selectedFiltersSet={selectedFiltersSet}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

const AccessibilityPanel = ({ handleFilterChange, selectedFiltersSet, searchTerm, setSearchTerm, filteredIds }) => {
    const items = Object.values(filterData['0_1'].children);
    const visibleItems = filteredIds ? items.filter(i => filteredIds.has(i.id)) : items;

    return (
        <Box>
            <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} isSearching={false} placeholder="Search access types..." />
            <Paper variant="outlined" sx={{ p: 2, maxHeight: 400, overflowY: 'auto' }}>
                {visibleItems.map(item => (
                    <FormControlLabel
                        key={item.id}
                        control={
                            <Checkbox
                                checked={selectedFiltersSet.has(item.id)}
                                onChange={() => handleFilterChange(item.id)}
                                sx={{ color: COLORS.border, '&.Mui-checked': { color: COLORS.pink } }}
                            />
                        }
                        label={<Typography variant="body2">{item.label}</Typography>}
                        sx={{ display: 'flex', mb: 1 }}
                    />
                ))}
            </Paper>
        </Box>
    );
};

// --- Main Exported Component ---

const DataTagger = ({ value = [], onChange }) => {
    const [activePanel, setActivePanel] = useState('cancer');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIds, setFilteredIds] = useState(null);

    const selectedFiltersSet = useMemo(() => new Set(value), [value]);
    const allFiltersArray = useMemo(() => Array.from(filterDetailsMap.values()), []);

    // Search Logic
    useEffect(() => {
        if (!searchTerm || searchTerm.length < 3) {
            setFilteredIds(null);
            return;
        }
        const timer = setTimeout(() => {
            const lower = searchTerm.toLowerCase();
            const activeGroupMap = { 'cancer': 'cancer-type', 'data': 'data-type', 'access': 'access' };
            const activeGroup = activeGroupMap[activePanel];

            const results = allFiltersArray.filter(item =>
                item.group === activeGroup && item.label.toLowerCase().includes(lower)
            );
            setFilteredIds(new Set(results.map(i => i.id)));
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, activePanel, allFiltersArray]);

    const pruneHierarchy = useCallback((nodes, currentIds) => {
        if (!nodes) return null;
        if (!currentIds) return nodes;
        const filtered = {};
        const arr = Array.isArray(nodes) ? nodes : Object.values(nodes);
        arr.forEach(item => {
            const kids = pruneHierarchy(item.children, currentIds);
            if (currentIds.has(item.id) || (kids && Object.keys(kids).length > 0)) {
                filtered[item.id] = { ...item, children: kids };
            }
        });
        return Object.keys(filtered).length > 0 ? filtered : null;
    }, []);

    const handleFilterChange = (id) => {
        const newSet = new Set(selectedFiltersSet);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        onChange(Array.from(newSet));
    };

    const handleTabChange = (event, newValue) => {
        setActivePanel(newValue);
        setSearchTerm('');
    };

    const commonProps = { handleFilterChange, selectedFiltersSet, searchTerm, setSearchTerm, filteredIds, pruneHierarchy };

    return (
        <Paper elevation={0} variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Header / Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: COLORS.lightBg }}>
                <Tabs
                    value={activePanel}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    sx={{
                        '& .MuiTabs-indicator': { backgroundColor: COLORS.pink, height: 3 },
                        '& .MuiTab-root': { fontWeight: 'bold', textTransform: 'none' },
                        '& .Mui-selected': { color: COLORS.pink }
                    }}
                >
                    <Tab label="Cancer Type" value="cancer" />
                    <Tab label="Data Type" value="data" />
                    <Tab label="Access" value="access" />
                </Tabs>
            </Box>

            {/* Panel Content */}
            <Box sx={{ p: 3, flexGrow: 1, overflow: 'hidden', bgcolor: COLORS.white }}>
                {activePanel === 'cancer' && <CancerTypePanel {...commonProps} />}
                {activePanel === 'data' && <DataTypePanel {...commonProps} />}
                {activePanel === 'access' && <AccessibilityPanel {...commonProps} />}
            </Box>
        </Paper>
    );
};

export default DataTagger;