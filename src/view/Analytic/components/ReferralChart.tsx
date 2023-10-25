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
import { tooltipLabelFormatter } from '../../../utils/helpers';
import { COLORS } from './FeeChart';

const ReferralChart: React.FC<{ data: ReferralData | undefined }> = ({ data }) => {
    const res: ReferralData[] = useMemo(() => {
        return data
            ? [data]
            : ([
                  {
                      level0: 0,
                      level1: 0,
                      level2: 0,
                      level3: 0,
                  },
              ] as ReferralData[]);
    }, []);

    return (
        <StyledContainer>
            <ContainerHeader>Referral</ContainerHeader>
            <ResponsiveContainer height="88%" width="95%">
                <ComposedChart
                    width={500}
                    height={300}
                    data={res}
                    margin={{
                        top: 12,
                        right: 15,
                        left: 15,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis width={30} />
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
                    <Bar dataKey="level1" stackId="a" name="Level 1" fill={COLORS[11]} />
                    <Bar dataKey="level2" stackId="a" name="Level 2" fill={COLORS[8]} />
                    <Bar dataKey="level3" stackId="a" name="Level 3" fill={COLORS[1]} />
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
