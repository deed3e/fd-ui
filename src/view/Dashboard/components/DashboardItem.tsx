import styled from 'styled-components';
import { ReactComponent as IconUp } from '../../../assets/icons/ic-price-up.svg';


export type DashboardItemProps = {
    img: JSX.Element;
    title: string;
    value: JSX.Element | string;
    status: JSX.Element | string;
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
                <StyledValue>
                    {value}
                </StyledValue>
                <StyledStatus>
                    <IconUp/>
                    {status}
                </StyledStatus>
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
    align-items: start;
    padding-top: 28px;
    padding-bottom: 19px;
    padding-left: 55px;
`;

const StyledTitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 7.8px;
    margin-left: -30px;
    svg{
        width: 24px;
    }
   
`;

const StyledTitle = styled.p`
    margin: 0;
    text-transform: capitalize;
    color: rgba(255, 255, 255, 0.50);
    font-family: IBM Plex Mono;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`

const StyledValue = styled.div`
    margin: 0;
    color: #fff;
    font-weight: 700;
    font-size: 28px;
    font-family: 'IBM Plex Sans',ui-sans-serif,system-ui,'-apple-system','BlinkMacSystemFont','Segoe UI','Roboto','Helvetica Neue','Arial','Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';
    line-height: normal;
`

const StyledStatus = styled.div`
    margin: 0;
    color: var(--green, #19AB72);
    font-family: IBM Plex Mono;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -1.2px;
    display: flex;
    gap: 5px;
    justify-content:center;
    align-items: start;
    margin-left: 5px;
    svg{
        height: 16px;
    }
`
