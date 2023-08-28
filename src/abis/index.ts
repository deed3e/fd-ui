import { ethers } from 'ethers';
const { Interface } = ethers;

// eslint-disable-next-line import/first
import IERC20Abi from './IERC20.json';
// eslint-disable-next-line import/first
import { IERC20Interface } from '../typechain/IERC20';

// eslint-disable-next-line import/first
import MockERC20 from './MockERC20.json';
// eslint-disable-next-line import/first
import { MockERC20Interface } from '../typechain/MockERC20';

export const erc20Interface = new Interface(IERC20Abi) as IERC20Interface;
export const mockERC20Interface = new Interface(MockERC20) as MockERC20Interface;
