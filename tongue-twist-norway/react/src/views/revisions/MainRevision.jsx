import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { TabPanel, setTabProps } from '../../components/basics/Tabs/Tabs';
import WordRevision from "./WordRevision";
import VerbRevision from "./VerbRevision";

function MainRevision() {
    const [indexActiveTab, setIndexActiveTab] = useState(0);
    const handleChange = (event, newValue) => setIndexActiveTab(newValue)

    return <Box display="flex" flexDirection="column" width="inherit">
        <Tabs value={indexActiveTab} centered sx={{ marginBottom: '2%' }} onChange={handleChange}>
            <Tab label="Tous" {...setTabProps(0)} />
            <Tab label="Verbes" {...setTabProps(1)} />
            <Tab label="Mots" {...setTabProps(2)} />
            <Tab label="Phrases" {...setTabProps(3)} />
        </Tabs>
        <TabPanel value={indexActiveTab} index={0}><WordRevision type={1} /></TabPanel>
        <TabPanel value={indexActiveTab} index={1}><VerbRevision /></TabPanel>
        <TabPanel value={indexActiveTab} index={2}><WordRevision type={3} /></TabPanel>
        <TabPanel value={indexActiveTab} index={3}><WordRevision type={4} /></TabPanel>
    </Box>
}

export default MainRevision;
