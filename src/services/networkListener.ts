import NetInfo, {NetInfoSubscription} from '@react-native-community/netinfo';

type NetworkCallback = () => void;

export const subscribeToNetwork = (
  onOnline: NetworkCallback,
  onOffline: NetworkCallback,
): NetInfoSubscription => {
  return NetInfo.addEventListener(state => {
    if (state.isConnected) {
      onOnline();
    } else {
      onOffline();
    }
  });
};

export const getNetworkState = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};
