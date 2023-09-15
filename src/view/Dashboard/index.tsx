import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import InputTokenWithSelect from '../../component/InputToken/InputTokenWithSelect';
import { formatUnits } from 'viem';
import { getAllTokenSymbol, getWrapNativeTokenSymbol } from '../../config';
const Dashboard: React.FC = () => {
    const tokens = useMemo(() => {
        return getAllTokenSymbol()?.filter((i) => i !== getWrapNativeTokenSymbol());
    }, []);

    const amountChange = useCallback((e: BigInt) => {
        console.log('dash', formatUnits(e as bigint, 0));
    }, []);
    return (
        <StyledContainer>
            <InputTokenWithSelect tokens={tokens} amountChange={amountChange} />
        </StyledContainer>
    );
};

export default Dashboard;

const StyledContainer = styled.div`
    background: #c9c9c9;
`;
