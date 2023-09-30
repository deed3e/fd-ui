import styled from 'styled-components';



export type DashboardItemProps = {
    img: JSX.Element;
    title: string;
    value: JSX.Element;
    status: string;
};

const DashboardItem: React.FC<DashboardItemProps> = ({
    img,
    title,
    value,
    status
}) => {
    return (
        <>
            <StyledItemFrame>
                <StyledTitleContainer>
                    {img}
                    <StyledTitle>{title}</StyledTitle>
                </StyledTitleContainer>
                {value}
                <StyledStatus>{status}</StyledStatus>
            </StyledItemFrame>
        </>
    );
};

export default DashboardItem;

const StyledItemFrame = styled.div`
    width: 268px;
    height: 124px;
    border-radius: 10px;
    background: rgba(54, 54, 54, 0.5);
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content:center;
    align-items: center;
    padding-top: 28px;
    padding-bottom: 19px;
`;

const StyledTitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 7.8px;
    margin-left: -10px;
`;

const StyledTitle = styled.p`
    margin: 0;
    text-transform: capitalize;
    color: rgba(255, 255, 255, 0.50);
    font-family: IBM Plex Mono;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`

// const StyledValue = styled.div`
//     margin: 0;
//     color: #fff;
//     font-weight: 700;
//     font-size: 28px;
//     font-style: normal;
//     font-family: IBM Plex Mono;
//     line-height: normal;
// `

const StyledStatus = styled.p`
    margin: 0;
    color: var(--green, #19AB72);
    font-family: IBM Plex Mono;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -1.2px;
`
