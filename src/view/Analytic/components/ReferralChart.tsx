import React, { PureComponent, useMemo } from 'react';
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
import { ReferralData } from '..';
import { tooltipLabelFormatter, xAxisFormatterUser } from '../../../utils/helpers';
import { COLORS } from './FeeChart';

const ReferralChart: React.FC<{ data: ReferralData[] | undefined }> = ({ data }) => {
    const res: ReferralData[] = useMemo(() => {
        return data ?? ([
                  {
                      type: '0',
                      value: 0
                  },
                  {
                      type: '1',
                      value: 0
                  },
                  {
                      type: '2',
                      value: 0
                  },
                  {
                      type: '3',
                      value: 0
                  }
              ] as ReferralData[]);
    }, []);

    return (
        <StyledContainer>
            <ContainerHeader>Referral</ContainerHeader>
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
                    <XAxis dataKey="type" tickFormatter={xAxisFormatterUser} minTickGap={30} />
                    <Tooltip
                      // labelFormatter={tooltipLabelFormatter}
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
                    <Bar dataKey="value" name="Wallet" fill={COLORS[8]} />
                    <Legend />
                </ComposedChart>
            </ResponsiveContainer>
        </StyledContainer>
    );
};

export default ReferralChart;

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    padding-top: 10px;
`;
const ContainerHeader = styled.div`
    padding: 10px 20px;
    font-weight: 700;
`;
