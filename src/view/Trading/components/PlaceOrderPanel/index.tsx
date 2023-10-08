import './placeOrderPanel.scss';
import { memo, useState,useCallback } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styled from 'styled-components';

import { DropdownSelectOrder } from '../PlaceOrderPanel/components/DropdownSelectOrder';
import { ReactComponent as IconArrowDown } from '../../../../assets/svg/ic-arrow-down.svg';

import Input from './components/Input';

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
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
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const PlaceOrderPanel: React.FC = () => {
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [selectOrder, setSelectOrder] = useState("Market Order");

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };

    const orders = ["Market Order","hello"]

    const onDropDownItemClick = useCallback((symbol: string) => {
      setSelectOrder(symbol);
  }, []);


    return (
<<<<<<< HEAD
        <>
            <Box sx={{ bgcolor: 'background.paper', width: 500 }}>
                <AppBar position="static">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="inherit"
                        aria-label="tabs example"
                    >
                        <Tab className='tab-trading' label="LONG" {...a11yProps(0)} />
                        <Tab className='tab-trading' label="SHORT" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                    style={{ background: '#29292c' }}
                >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <div className="order-price-title">
                            <p>Order Type</p>
                            <p>Price</p>
                        </div>
                        <div className="dropdown-price">
                            <StyledSelectToken>
                                <DropdownSelectOrder
                                    selectedOrder={selectOrder}
                                    orders={orders}
                                    position={'right'}
                                    onSelect={onDropDownItemClick}
                                >
                                    <StyledTokenSelect pointer={orders?.length >= 0}>
                                       <span>{selectOrder}</span>
                                        <IconArrowDown />
                                    </StyledTokenSelect>
                                </DropdownSelectOrder>
                            </StyledSelectToken>
                           
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        Item Two
                    </TabPanel>
                </SwipeableViews>
            </Box>
        </>
=======
      <>
        TODO task
      </>
>>>>>>> feature/hoangtth/fixBugLiquidity
    );
};

export default memo(PlaceOrderPanel);

const StyledSelectToken = styled.div`
    justify-self: self-end;
    align-self: center;
    display: flex;
    align-items: center;
`;

export const StyledToken = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: fit-content;
    padding: 2px;
    border-radius: 1000px;
    border: solid 1px #363636;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    padding: 6px 0px;
    span {
        padding-right: 6px;
        padding-left: 6px;
    }
    svg {
        width: 8px;
        margin-right: 6px;
        path {
            fill: #adabab;
        }
    }
`;

const StyledTokenSelect = styled(StyledToken) <{ pointer?: boolean }>`
    cursor: ${({ pointer }) => (pointer ? 'pointer' : 'auto')};
    :hover {
        border: 1px solid #515050;
    }
`;
