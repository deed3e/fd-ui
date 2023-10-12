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
import { Fee, NewUser } from '..';
import {
    tooltipFormatter,
    tooltipLabelFormatter,
    xAxisFormatter,
    yAxisFormatter,
} from '../../../utils/helpers';
import {COLORS} from './FeeChart';

const NewUserChart: React.FC<{ data: NewUser[]; loading: boolean }> = ({ data, loading }) => {
    return (
        <StyledContainer>
            <ContainerHeader>New Users</ContainerHeader>
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
                    <YAxis width={30} />
                    <YAxis
                        dataKey="cumulative"
                        tickCount={8}
                        width={30}
                        orientation="right"
                        yAxisId="right"
                    />
                    <XAxis dataKey="timestamp" tickFormatter={xAxisFormatter} minTickGap={30} />
                    <Tooltip
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
                    <Legend/>
                    <Bar dataKey="total" stackId="a" name="Total" fill={COLORS[10]} />
                  
                    <Line
                        type="monotone"
                        dot={false}
                        strokeWidth={3}
                        stroke={COLORS[6]}
                        dataKey="cumulative"
                        name="Cumulative"
                        yAxisId="right"
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </StyledContainer>
    );
};

export default NewUserChart;

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    padding-top: 10px;
`;
const ContainerHeader = styled.div`
    padding: 10px 20px;
    font-weight: 700;
`;
