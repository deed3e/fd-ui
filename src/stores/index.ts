import { legacy_createStore } from 'redux';

export interface TypeUser {
  wallet: string | undefined;
  chain: string | undefined;
  balance: string | undefined;
}

let initState: TypeUser = {
  wallet: undefined,
  chain: undefined,
  balance: undefined,
};

// REDUCER
export const userReducer = (state = initState, action: any) => {
  console.log('userReducer', action);
  switch (action.type) {
    case 'SETWALLET':
      return action.payload;
    default:
      return state;
  }
};

// ACTIONS
export const setWallet = (address: string | undefined) => {
  return {
    type:'SETWALLET',
    payload: {
      wallet: address,
      chain: undefined,
      balance: undefined,
    },
  };
};
