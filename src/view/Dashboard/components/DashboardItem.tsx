import styled from 'styled-components';

const DashboardItem: React.FC = () => {
    return (
        <>
            <StyledItemFrame></StyledItemFrame>
        </>
    );
};

export default DashboardItem;

const StyledItemFrame = styled.div`
    width: 268px;
    height: 124px;
    border-radius: 10px;
    background: rgba(54, 54, 54, 0.5);
`;
