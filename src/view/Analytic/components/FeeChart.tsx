import React, { PureComponent } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    ComposedChart,
} from 'recharts';
import styled from 'styled-components';
import { Fee } from '..';
import {
    tooltipFormatter,
    tooltipLabelFormatter,
    xAxisFormatter,
    yAxisFormatter,
} from '../../../utils/helpers';

export const COLORS = [
    '#f69b24',
    '#2cb060',
    '#ff45ca',
    '#33f7ff',
    '#8e4efe',
    '#ab6100',
    '#c90000',
    '#7b7b7b',
    '#6464ff',
    'purple',
    '#0ecb81',
    '#E43E53',
    '#3ac954',
    '#ffb313',
];

const FeeChart: React.FC<{ data: Fee[]; loading: boolean }> = ({ data, loading }) => {
    return (
        <StyledContainer>
            <ContainerHeader>Fees</ContainerHeader>
            <ResponsiveContainer height="88%" width="95%">
                <ComposedChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 12,
                        right: 15,
                        left: 15,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis tickFormatter={yAxisFormatter} width={30} />
                    <YAxis
                        dataKey="cumulative"
                        tickCount={8}
                        tickFormatter={yAxisFormatter}
                        width={30}
                        orientation="right"
                        yAxisId="right"
                    />
                    <XAxis dataKey="timestamp" tickFormatter={xAxisFormatter} minTickGap={30} />
                    <Tooltip
                        formatter={tooltipFormatter}
                        labelFormatter={tooltipLabelFormatter}
                        contentStyle={{
                            backgroundColor: '#29292c',
                            textAlign: 'left',
                            border: 'none',
                        }}
                        itemStyle={{
                            paddingTop: 4,
                            fontSize: 12,
                        }}
                        labelStyle={{
                            fontSize: 12,
                            color: '#adabab',
                            paddingBottom: 2,
                        }}
                    />
                    <Legend />
                    <Bar dataKey="swap" stackId="a" name="Swap" fill={COLORS[0]} />
                    <Bar dataKey="trade" stackId="a" name="Trade" fill={COLORS[7]} />
                    <Bar dataKey="liquidity" stackId="a" name="Liquidity" fill={COLORS[5]} />
                    <Bar
                        dataKey="liquidation"
                        stackId="a"
                        name="Liquidation"
                        fill={COLORS[3]}
                    />
                    <Line
                        type="monotone"
                        dot={false}
                        strokeWidth={3}
                        stroke={COLORS[10]}
                        dataKey="cumulative"
                        name="Cumulative"
                        yAxisId="right"
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </StyledContainer>
    );
};

export default FeeChart;

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    padding-top: 10px;
`;
const ContainerHeader = styled.div`
    padding: 10px 20px;
    font-weight: 700;
`;
