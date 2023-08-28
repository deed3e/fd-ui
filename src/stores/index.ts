export interface TypeUser {
  wallet: string | undefined;
  connected: boolean
}

let initState: TypeUser = {
  wallet: undefined,
  connected: false
};

// REDUCER
export const userReducer = (state = initState, action: any) => {
  switch (action.type) {
    case 'SETWALLET':
      return action.payload;
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
      connected: true
    },
  };
};
