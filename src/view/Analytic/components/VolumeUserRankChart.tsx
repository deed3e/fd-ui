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
import { Fee, NewUser, VolumeByUser } from '..';
import {
    tooltipFormatter,
    tooltipLabelFormatter,
    xAxisFormatterWallet,
    yAxisFormatter,
} from '../../../utils/helpers';
import { COLORS } from './FeeChart';

const VolumeUserRankChart: React.FC<{ data: VolumeByUser[]; loading: boolean }> = ({
    data,
    loading,
}) => {
    console.log('data', data);
    return (
        <StyledContainer>
            <ContainerHeader>Top User Swap Volume</ContainerHeader>
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
                    <XAxis
                        dataKey="wallet"
                        tickFormatter={xAxisFormatterWallet}
                        minTickGap={30}
                    />
                    <Tooltip
                        formatter={tooltipFormatter}
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
                    <Bar dataKey="swap" stackId="a" name="Swap" fill={COLORS[4]} />
                </ComposedChart>
            </ResponsiveContainer>
        </StyledContainer>
    );
};

export default VolumeUserRankChart;

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    padding-top: 10px;
`;
const ContainerHeader = styled.div`
    padding: 10px 20px;
    font-weight: 700;
`;
