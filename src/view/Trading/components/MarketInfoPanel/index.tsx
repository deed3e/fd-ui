import { useParams } from 'react-router-dom';

const MarketInfoPanel: React.FC = () => {
    const { market } = useParams();
    const token = market?.toUpperCase();

    return <>MarketInfoPanel:{token}</>;
};

export default MarketInfoPanel;
