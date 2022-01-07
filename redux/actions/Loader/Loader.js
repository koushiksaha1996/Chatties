import {LOADER} from '../../types/Actiontypes';

export const setLoader = item => {
  return {
    type: LOADER,
    payload: item,
  };
};
