import Header from '../../component/Header';
import { useSelector } from 'react-redux';
import { TypeUser } from '../../stores';
const Liquidity: React.FC = () => {
  const userRedux = useSelector((state: TypeUser) => state);
  return (
    <>
      <Header />
      {userRedux?.wallet}
    </>
  );
};

export default Liquidity;
