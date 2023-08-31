import { useAccount } from 'wagmi';
const Liquidity: React.FC = () => {
  const { address } = useAccount();
  return <>{address}</>;
};

export default Liquidity;
