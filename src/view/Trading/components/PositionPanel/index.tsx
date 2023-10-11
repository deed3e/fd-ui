import { memo } from 'react';
import './positionPanel.scss';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const PositionPanel: React.FC = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <div className="container-positon-panel">
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                        >
                            <Tab
                                className="item-header-tab"
                                label="Positions"
                                {...a11yProps(0)}
                            />
                            <Tab className="item-header-tab" label="Orders" {...a11yProps(1)} />
                            <Tab
                                className="item-header-tab"
                                label="History"
                                {...a11yProps(2)}
                            />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <div className="padding-for-header-table">
                            <div className="header-table-position">
                                <div className="header-title-position">Position</div>
                                <div className="header-title-position">Size</div>
                                <div className="header-title-position">Net Value</div>
                                <div className="header-title-position">Entry Price</div>
                                <div className="header-title-position">Liquidation Price</div>
                                <div className="header-title-position">Action</div>
                            </div>
                        </div>
                        <div className="padding-for-body-table active">
                            <div className="content-body-table">
                                <div className="header-table-position header-table-position-2">
                                    <div className="header-title-position">
                                        <p className="token-positon">BTC/USD</p>
                                        <p className="long-shot-position">Long</p>
                                    </div>
                                    <div className="header-title-position">
                                        <p className="size-position">19.92$</p>
                                    </div>
                                    <div className="header-title-position">
                                        <p className="net-value-top">$9.92</p>
                                        <p className="net-value-bottom">-$1.2</p>
                                    </div>
                                    <div className="header-title-position">
                                        <p className="entry-price-position">$23,654.92</p>
                                    </div>
                                    <div className="header-title-position">
                                        <p className="liquidation-price-position">$23,654.92</p>
                                    </div>
                                    <div className="header-title-position">Close</div>
                                </div>
                            </div>
                        </div>
                        <div className="padding-for-body-table">
                            <div className="content-body-table">
                                <div className="header-table-position header-table-position-2">
                                    <div className="header-title-position">
                                        <p className="token-positon">BTC/USD</p>
                                        <p className="long-shot-position">Long</p>
                                    </div>
                                    <div className="header-title-position">
                                        <p className="size-position">19.92$</p>
                                    </div>
                                    <div className="header-title-position">
                                        <p className="net-value-top">$9.92</p>
                                        <p className="net-value-bottom">-$1.2</p>
                                    </div>
                                    <div className="header-title-position">
                                        <p className="entry-price-position">$23,654.92</p>
                                    </div>
                                    <div className="header-title-position">
                                        <p className="liquidation-price-position">$23,654.92</p>
                                    </div>
                                    <div className="header-title-position">Close</div>
                                </div>
                            </div>
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        Item Two
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        Item Three
                    </CustomTabPanel>
                </Box>
            </div>
        </>
    );
};

export default memo(PositionPanel);
