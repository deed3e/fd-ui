export interface TypeUser {
  wallet: string | undefined;
  connected: boolean;
  web3Provider: unknown;
}

let initState: TypeUser = {
  wallet: undefined,
  connected: false,
  web3Provider: undefined,
};

// REDUCER
export const userReducer = (state = initState, action: any) => {
  switch (action.type) {
    case 'SETWALLET':
      return {
        wallet: action.payload.wallet,
        connected: true,
        web3Provider: state.web3Provider,
      };
    case 'SETWEB3PROVIDER':
      return {
        wallet: state.wallet,
        connected: state.connected,
        web3Provider: action.payload.web3Provider,
      };
    default:
      return state;
  }
};

// ACTIONS
export const setWallet = (address: any) => {
  return {
    type: 'SETWALLET',
    payload: {
      wallet: address,
    },
  };
};

export const setWeb3Provider = (provider: any) => {
  return {
    type: 'SETWEB3PROVIDER',
    payload: {
      web3Provider: provider,
    },
  };
};
