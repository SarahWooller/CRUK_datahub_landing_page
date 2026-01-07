'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Link,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmailIcon from '@mui/icons-material/Email';
import CircleIcon from '@mui/icons-material/Circle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// 1. IMPORT DATA
import mammogramData from '../utils/mammogram.json';

// 2. IMPORT ICONS
import animalIcon from '../assets/animal.webp';
import backgroundIcon from '../assets/background.webp';
import biobankIcon from '../assets/biobank.webp';
import invitroIcon from '../assets/invitro.webp';
import longitudinalIcon from '../assets/longitudinal.webp';
import treatmentsIcon from '../assets/treatments.webp';
import omicsIcon from '../assets/omics.webp';
import imagingIcon from '../assets/medical_imaging.webp';
import labResultsIcon from '../assets/lab_results.webp';

// 3. IMPORT ERD IMAGE
import erdImage from '../assets/erd.png';

// --- Brand Colors ---
const COLORS = {
  blue: '#00468C',
  pink: '#D10A6F',
  white: '#FFFFFF',
  lightBg: '#F0F2F5',
  border: '#AAB7C4'
};

// --- Configuration ---
const ICON_MAPPING = {
  "Model Organisms": { src: animalIcon, label: "Model Organisms" },
  "Background": { src: backgroundIcon, label: "Background" },
  "Biobank Samples": { src: biobankIcon, label: "Biobank Samples" },
  "In Vitro Studies": { src: invitroIcon, label: "In Vitro Studies" },
  "Longitudinal Follow up": { src: longitudinalIcon, label: "Longitudinal" },
  "Treatments": { src: treatmentsIcon, label: "Treatments" },
  "Multi-omic Data": { src: omicsIcon, label: "Multi-omic Data" },
  "Imaging types": { src: imagingIcon, label: "Imaging Data" },
  "Imaging Data": { src: imagingIcon, label: "Imaging Data" },
  "Biopsy Results and Lab Reports": { src: labResultsIcon, label: "Lab Results" }
};

// --- Utility Functions ---
const getFirstTwoSentences = (text) => {
  if (!text) return "";
  const match = text.match(/^.*?[.!?](?:\s|$)(?:.*?[.!?](?:\s|$))?/);
  return match ? match[0] : text;
};

const normalizeList = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return input.split(';,;').map(k => k.trim());
};

const getActiveIcons = (filters) => {
  const activeKeys = new Set();
  const targetKeys = Object.keys(ICON_MAPPING);
  if (!filters || !filters["Data Types"]) return [];
  const dataTypes = filters["Data Types"];

  Object.values(dataTypes).forEach(list => {
    if (Array.isArray(list)) {
      list.forEach(item => {
        if (typeof item === 'string') {
          if (targetKeys.includes(item)) activeKeys.add(item);
        } else if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => {
            if (targetKeys.includes(key)) activeKeys.add(key);
          });
        }
      });
    }
  });
  return Array.from(activeKeys).map(key => ICON_MAPPING[key]);
};

// --- Sub-Components ---

const StatCard = ({ label, value, bgcolor }) => (
  <Card variant="outlined" sx={{ height: '100%', bgcolor: bgcolor || 'white', borderColor: 'divider' }}>
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'text.secondary', mb: 1, letterSpacing: 1 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary', wordBreak: 'break-word', lineHeight: 1.2 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const AccessItem = ({ label, value, isLink }) => {
    if (!value) return null;
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', color: 'text.secondary', textTransform: 'uppercase', mb: 0.5 }}>
                {label}
            </Typography>
            {isLink ? (
                <Link href={value} target="_blank" rel="noreferrer" underline="hover" sx={{ fontSize: '0.875rem', wordBreak: 'break-all' }}>
                    {value}
                </Link>
            ) : (
                <Typography variant="body2" sx={{ color: 'text.primary', wordBreak: 'break-word' }}>
                    {value}
                </Typography>
            )}
        </Box>
    );
};

// --- Main Component ---

const MetadataPage = () => {
  const data = mammogramData;
  const [expandedTables, setExpandedTables] = useState({});
  const [emailAnchorEl, setEmailAnchorEl] = useState(null);

  // --- Resizing State ---
  // CHANGED: Initial width set to 240
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastWidth, setLastWidth] = useState(240);
  const isResizingRef = useRef(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // --- Data Logic ---
  const descriptionText = data.documentation?.description || data.summary?.description || "";
  const documentationPreview = useMemo(() => getFirstTwoSentences(descriptionText), [descriptionText]);
  const keywords = useMemo(() => normalizeList(data.summary.keywords), [data]);
  const activeIcons = useMemo(() => getActiveIcons(data.filters), [data]);

  const groupedMetadata = useMemo(() => {
    const tables = data.structuralMetadata?.tables || data.structuralMetadata || [];
    return tables.reduce((acc, item) => {
      const entity = item.name;
      const desc = item.description || "";
      if (!acc[entity]) {
        // CHANGED: Generating random entry count (100-10000) for demo purposes
        const randomEntries = Math.floor(Math.random() * (10000 - 100 + 1)) + 100;

        acc[entity] = {
            description: desc,
            columns: [],
            entriesCount: randomEntries
        };
      }
      if (item.columns) {
        acc[entity].columns.push(...item.columns);
      }
      return acc;
    }, {});
  }, [data]);

  const derivedFilters = useMemo(() => {
    if (data.filters) return data.filters;
    const datasetTypes = data.provenance?.origin?.datasetType || [];
    const filterObj = {};
    datasetTypes.forEach(dt => {
        if(dt.name && dt.subTypes) {
            filterObj[dt.name] = dt.subTypes;
        }
    });
    return filterObj;
  }, [data]);

  const population = data.summary.populationSize;
  const ageRange = data.coverage.typicalAgeRangeMin && data.coverage.typicalAgeRangeMax
    ? `${data.coverage.typicalAgeRangeMin} - ${data.coverage.typicalAgeRangeMax}`
    : data.coverage.typicalAgeRange;
  const leadTime = data.accessibility.access.deliveryLeadTime;
  const followUp = data.coverage.followUp;
  const fileTypes = data.accessibility.formatAndStandards?.format
    ? data.accessibility.formatAndStandards.format.map(f => f.split('/')[1] || f).join(', ')
    : "Various";

  // --- Handlers ---

  const startResizing = useCallback(() => {
    isResizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
  }, []);

  const stopResizing = useCallback(() => {
    isResizingRef.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResizing);
  }, []);

  const resize = useCallback((mouseEvent) => {
    if (isResizingRef.current) {
        const newWidth = mouseEvent.clientX;

        // SNAP TO COLLAPSE Logic
        if (newWidth < 100) {
            if (!isCollapsed) {
                setLastWidth(sidebarWidth > 100 ? sidebarWidth : 240);
                setIsCollapsed(true);
            }
        } else {
            setIsCollapsed(false);
            setSidebarWidth(Math.min(newWidth, 600));
        }
    }
  }, [isCollapsed, sidebarWidth]);

  const toggleSidebar = () => {
    if (isCollapsed) {
        setIsCollapsed(false);
        setSidebarWidth(lastWidth);
    } else {
        setLastWidth(sidebarWidth);
        setIsCollapsed(true);
    }
  };

  const downloadJson = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "mammogram_metadata.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleTable = (entityName) => {
    setExpandedTables(prev => ({ ...prev, [entityName]: !prev[entityName] }));
  };

  const toggleAllTables = (shouldExpand) => {
    const newState = {};
    Object.keys(groupedMetadata).forEach(key => { newState[key] = shouldExpand; });
    setExpandedTables(newState);
  };

  const handleEmailClick = (event) => {
    setEmailAnchorEl(event.currentTarget);
  };

  const handleEmailClose = (action) => {
    if (action) console.log(`User selected: ${action}`);
    setEmailAnchorEl(null);
  };

  const renderFilterTree = (obj) => {
    if (Array.isArray(obj)) {
      return (
        <List dense disablePadding sx={{ pl: 2 }}>
            {obj.map((item, idx) => (
                <ListItem key={idx} disableGutters sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 20 }}>
                        <CircleIcon sx={{ fontSize: 6, color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                        primary={typeof item === 'object' ? renderFilterTree(item) : item}
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', style: { wordBreak: 'break-word' } }}
                    />
                </ListItem>
            ))}
        </List>
      );
    }
    if (typeof obj === 'object' && obj !== null) {
      return (
        <List dense disablePadding sx={{ pl: 1 }}>
          {Object.entries(obj).map(([key, value]) => (
            <ListItem key={key} disableGutters sx={{ display: 'block', py: 0.5 }}>
              <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ wordBreak: 'break-word' }}>{key}</Typography>
              {renderFilterTree(value)}
            </ListItem>
          ))}
        </List>
      );
    }
    return <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>{obj}</Typography>;
  };

  // Aliases
  const { summary, accessibility, observations } = data;
  const access = accessibility.access || {};
  const usage = accessibility.usage || {};
  const resourceCreators = Array.isArray(usage.resourceCreator)
    ? usage.resourceCreator.join(', ')
    : (usage.resourceCreator?.name || usage.resourceCreator || "N/A");
  const dataUseLimit = Array.isArray(usage.dataUseLimitation) ? usage.dataUseLimitation.join(', ') : usage.dataUseLimitation;
  const dataUseReq = Array.isArray(usage.dataUseRequirements) ? usage.dataUseRequirements.join(', ') : usage.dataUseRequirement;

  // Sidebar Content
  const SidebarContent = () => (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>Overview</Typography>
        <List component="nav" sx={{ mb: 4 }}>
            {['Summary', 'Documentation','Structural Metadata',  'Entity Relationship Diagrams', 'Observations'].map((item) => (
                <ListItem button component="a" href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} key={item} sx={{ borderRadius: 1 }}>
                    <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>
            ))}
        </List>

        <Paper variant="outlined" sx={{ mt: 'auto', p: 2, bgcolor: '#f0f7ff', borderColor: '#cfe6ff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, borderBottom: 1, borderColor: '#cfe6ff', pb: 1 }}>
                <Typography variant="subtitle2" color="primary" fontWeight="bold">Data Access</Typography>
                <IconButton size="small" onClick={handleEmailClick} color="primary">
                    <EmailIcon fontSize="small" />
                </IconButton>
                <Menu
                    anchorEl={emailAnchorEl}
                    open={Boolean(emailAnchorEl)}
                    onClose={() => handleEmailClose()}
                >
                    <MenuItem onClick={() => handleEmailClose('General Enquiry')}>Make a general enquiry</MenuItem>
                    <MenuItem onClick={() => handleEmailClose('Feasibility Enquiry')}>Make a feasibility enquiry</MenuItem>
                    <MenuItem onClick={() => handleEmailClose('Data Access Request')}>Start a data access request</MenuItem>
                </Menu>
            </Box>

            <AccessItem label="Data Controller" value={access.dataController} />
            <AccessItem label="Data Processor" value={access.dataProcessor} />
            <AccessItem label="Access Rights" value={access.accessRights} isLink={true} />
            <AccessItem label="Delivery Lead Time" value={leadTime} />
            <AccessItem label="Data Use Requirement" value={dataUseReq} />
            <AccessItem label="Data Use Limitation" value={dataUseLimit} />
            <AccessItem label="Request Cost" value={access.accessRequestCost || "Information not available"} />
        </Paper>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: COLORS.lightBg, minHeight: '100vh', overflow: 'hidden' }}>

        {/* Left Sidebar (Collapsible) */}
        {isDesktop && (
            <>
                <Box sx={{
                    width: isCollapsed ? 30 : sidebarWidth,
                    flexShrink: 0,
                    transition: isResizingRef.current ? 'none' : 'width 0.3s',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Paper
                        elevation={3}
                        sx={{
                            width: '100%',
                            // Sticky ONLY when collapsed to keep the button visible
                            position: isCollapsed ? 'sticky' : 'relative',
                            top: 0,
                            // Min Height ensures it fills screen, 'auto' lets it grow
                            minHeight: '100vh',
                            height: isCollapsed ? '100vh' : 'auto',
                            overflowY: isCollapsed ? 'hidden' : 'visible',
                            borderRadius: 0,
                            bgcolor: isCollapsed ? '#fafafa' : 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: isCollapsed ? 10 : 1
                        }}
                    >
                        {isCollapsed ? (
                            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconButton onClick={toggleSidebar} color="primary" title="Expand Sidebar">
                                    <ChevronRightIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <SidebarContent />
                        )}
                    </Paper>
                </Box>

                {/* Visual Drag Handle */}
                <Box
                    onMouseDown={startResizing}
                    sx={{
                        width: 6,
                        flexShrink: 0,
                        cursor: 'col-resize',
                        bgcolor: '#e0e0e0',
                        borderLeft: '1px solid #ccc',
                        borderRight: '1px solid #ccc',
                        transition: 'background-color 0.2s',
                        zIndex: 10,
                        '&:hover': { bgcolor: COLORS.blue },
                        '&:active': { bgcolor: COLORS.blue }
                    }}
                />
            </>
        )}

        {/* Main Content (Middle) - PRIORITIZED */}
        <Box component="main" sx={{
            flexGrow: 1,
            flexShrink: 1, // ALLOW SHRINKING to prevent pushing right bar off screen
            minWidth: 400, // But keep reasonable minimum width
            p: { xs: 2, md: 4 },
            overflowX: 'hidden'
        }}>

            {/* Header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h3" component="h1" color="primary" fontWeight="800" gutterBottom>
                        {summary.title}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} alignItems={{ sm: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Publisher:</strong> {summary.dataCustodian?.name || summary.publisher?.name || "Unknown"}
                        </Typography>
                        {summary.funding && (
                            <Box display="flex" alignItems="center">
                                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                    <strong>Funded By:</strong> {summary.funding.name}
                                </Typography>
                                {summary.funding['grant number'] && (
                                    <Chip label={summary.funding['grant number']} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                                )}
                            </Box>
                        )}
                    </Stack>
                </Box>

                {/* Download Button */}
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={downloadJson}
                    sx={{
                        bgcolor: COLORS.blue,
                        whiteSpace: 'nowrap',
                        minWidth: 'fit-content',
                        px: 3,
                        py: 1
                    }}
                >
                    Download JSON
                </Button>
            </Stack>

            {/* Icon Gallery */}
            <Stack direction="row" spacing={2} sx={{ mb: 5, flexWrap: 'wrap', gap: 2 }}>
                {activeIcons.length > 0 ? (
                    activeIcons.map((icon, idx) => (
                        <Tooltip key={idx} title={icon.label} placement="top">
                            <Paper
                                elevation={1}
                                sx={{
                                    width: 80, height: 80,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: 3, border: 1, borderColor: 'divider',
                                    '&:hover': { borderColor: COLORS.blue, boxShadow: 2 }
                                }}
                            >
                                <Box component="img" src={icon.src} alt={icon.label} sx={{ width: 48, height: 48, objectFit: 'contain', opacity: 0.9 }} />
                            </Paper>
                        </Tooltip>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">No specific data type icons found.</Typography>
                )}
            </Stack>

            {/* Stat Cards */}
            <Grid container spacing={2} sx={{ mb: 5 }}>
                <Grid item xs={6} sm={4} md={2.4}><StatCard label="Population" value={population?.toLocaleString()} bgcolor="#e3f2fd" /></Grid>
                <Grid item xs={6} sm={4} md={2.4}><StatCard label="Age Range" value={ageRange} bgcolor="#e8f5e9" /></Grid>
                <Grid item xs={6} sm={4} md={2.4}><StatCard label="Access" value={leadTime || "Restricted"} bgcolor="#f3e5f5" /></Grid>
                <Grid item xs={6} sm={4} md={2.4}><StatCard label="Follow Up" value={followUp} bgcolor="#fffde7" /></Grid>
                <Grid item xs={6} sm={4} md={2.4}><StatCard label="Formats" value={fileTypes} bgcolor="#ffebee" /></Grid>
            </Grid>

            {/* Summary */}
            <Box id="summary" sx={{ scrollMarginTop: 100, mb: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2 }}>Summary</Typography>
                <Paper variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="body1" paragraph>{summary.abstract}</Typography>
                    {data.enrichmentAndLinkage?.syntheticDataWebLink && (
                        <Box mt={2}>
                            <Typography variant="body2" component="span" fontWeight="bold">Associated Website: </Typography>
                            {Array.isArray(data.enrichmentAndLinkage.syntheticDataWebLink) ? (
                                data.enrichmentAndLinkage.syntheticDataWebLink.map((link, i) => (
                                    <Link key={i} href={link} target="_blank" sx={{ display: 'block' }}>{link}</Link>
                                ))
                            ) : (
                                <Link href={data.enrichmentAndLinkage.syntheticDataWebLink} target="_blank">{data.enrichmentAndLinkage.syntheticDataWebLink}</Link>
                            )}
                        </Box>
                    )}
                </Paper>
            </Box>

            {/* Documentation */}
            <Box id="documentation" sx={{ scrollMarginTop: 100, mb: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2 }}>Documentation</Typography>
                <Accordion variant="outlined">
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#f0f7ff' }}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" color="primary">Detailed Description</Typography>
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                {documentationPreview} <Typography component="span" color="primary" variant="caption">(Click to expand)</Typography>
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{descriptionText}</Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>

            {/* Structural Metadata */}
            <Box id="structural-metadata" sx={{ scrollMarginTop: 100, mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold">Structural Metadata</Typography>
                    <Box>
                        <Button size="small" onClick={() => toggleAllTables(true)}>Expand All</Button>
                        <Typography component="span" sx={{ mx: 1, color: 'text.disabled' }}>|</Typography>
                        <Button size="small" onClick={() => toggleAllTables(false)}>Collapse All</Button>
                    </Box>
                </Stack>

                <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
                    {Object.keys(groupedMetadata).length === 0 ? (
                        <Typography sx={{ p: 3, color: 'text.secondary' }}>No structural metadata available.</Typography>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: COLORS.lightBg }}>
                                    <TableRow>
                                        <TableCell width="35%"><strong>Entity / Description</strong></TableCell>
                                        <TableCell width="25%"><strong>Column Name</strong></TableCell>
                                        <TableCell width="15%"><strong>Type</strong></TableCell>
                                        <TableCell><strong>Description</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(groupedMetadata).map(([entityName, data]) => {
                                        const isExpanded = expandedTables[entityName];
                                        return (
                                            <React.Fragment key={entityName}>
                                                <TableRow
                                                    hover
                                                    onClick={() => toggleTable(entityName)}
                                                    sx={{ cursor: 'pointer', bgcolor: isExpanded ? '#e3f2fd' : 'inherit' }}
                                                >
                                                    <TableCell colSpan={4}>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            {isExpanded ? <KeyboardArrowDownIcon color="primary" /> : <KeyboardArrowRightIcon color="action" />}
                                                            <Typography variant="subtitle1" color="primary" fontWeight="bold">{entityName}</Typography>

                                                            {/* CHANGED: Description logic */}
                                                            <Tooltip title={!isExpanded ? data.description : ""} placement="top">
                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        maxWidth: 400,
                                                                        fontStyle: 'italic',
                                                                        // Logic: Wraps if expanded, Truncates if not
                                                                        whiteSpace: isExpanded ? 'normal' : 'nowrap',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        display: 'block'
                                                                    }}
                                                                >
                                                                    {data.description}
                                                                </Typography>
                                                            </Tooltip>

                                                            {/* CHANGED: Entries tag only if unexpanded */}
                                                            {!isExpanded && (
                                                                <Chip
                                                                    label={`${data.entriesCount.toLocaleString()} entries`}
                                                                    size="small"
                                                                    sx={{ ml: 'auto' }}
                                                                />
                                                            )}
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                       {isExpanded && data.columns.map((col, idx) => (
                                            <TableRow key={`${entityName}-${col.name}-${idx}`} sx={{ bgcolor: '#fafafa', '&:last-child td': { borderBottom: 0 } }}>
                                                {/* Spacer Cell REMOVED */}

                                                {/* Column Name now takes the first slot */}
                                                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'text.primary', pl: 4 }}>
                                                    {col.name}
                                                </TableCell>

                                                <TableCell sx={{ color: 'text.secondary' }}>{col.dataType}</TableCell>

                                                {/* Description spans the remaining space */}
                                                <TableCell colSpan={2} sx={{ color: 'text.secondary' }}>{col.description}</TableCell>
                                            </TableRow>
                                        ))}
                                            </React.Fragment>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Box>

            {/* ERD */}
            <Box id="entity-relationship-diagrams" sx={{ scrollMarginTop: 100, mb: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2 }}>Entity Relationship Diagrams</Typography>
                <Paper variant="outlined" sx={{ p: 2, overflowX: 'auto' }}>
                    <Box component="img" src={erdImage} alt="Entity Relationship Diagram" sx={{ maxWidth: '100%', height: 'auto' }} />
                </Paper>
            </Box>

            {/* Observations */}
            <Box id="observations" sx={{ scrollMarginTop: 100, mb: 8 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 2 }}>Observations</Typography>
                <Grid container spacing={2}>
                    {observations.map((obs, idx) => (
                        <Grid item xs={12} sm={4} key={idx}>
                            <Paper variant="outlined" sx={{ p: 3, borderLeft: 6, borderLeftColor: COLORS.blue }}>
                                <Typography variant="h5" fontWeight="bold" color="text.primary">
                                    {obs.measuredValue.toLocaleString()}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                                    {obs.observedNode}
                                </Typography>
                                <Typography variant="caption" color="text.disabled" display="block" mt={1}>
                                    {obs.measuredProperty}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>

        {/* Right Sidebar (Keywords & Filters - SQUEEZABLE & SAFE) */}
        {isDesktop && (
            <Box sx={{
                // Flexible width: tries to be 320, but shrinks heavily (flex-shrink: 5)
                flex: '0 5 320px',
                minWidth: 220, // Prevents disappearing completely
                maxWidth: 320,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Paper
                    elevation={3}
                    sx={{
                        minHeight: '100vh',
                        height: 'auto',
                        position: 'relative',
                        p: 3,
                        borderRadius: 0,
                        wordBreak: 'break-word',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.9rem' }}>
                        Filters & Tags
                    </Typography>

                    <Box mb={4}>
                        <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 0.5 }}>
                            Keywords
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                            {keywords.map((kw, i) => (
                                <Chip key={i} label={kw} size="small" variant="outlined" sx={{ maxWidth: '100%' }} />
                            ))}
                        </Stack>
                    </Box>

                    <Box mb={3}>
                        <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 0.5 }}>
                            Resource Creator
                        </Typography>
                        <Typography variant="body2" color="text.secondary">{resourceCreators}</Typography>
                    </Box>

                    {Object.entries(derivedFilters).map(([category, contents]) => (
                        <Box key={category} mb={3}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 0.5 }}>
                                {category}
                            </Typography>
                            {renderFilterTree(contents)}
                        </Box>
                    ))}
                </Paper>
            </Box>
        )}
    </Box>
  );
};

export default MetadataPage;