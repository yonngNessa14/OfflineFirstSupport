import {ActionType} from '@/types';

const SMALL_DELAY_MS = 500;
const LARGE_DELAY_MS = 2000;

export const sendSmall = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, SMALL_DELAY_MS);
  });
};

export const sendLarge = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, LARGE_DELAY_MS);
  });
};

export const sendAction = (type: ActionType): Promise<void> => {
  return type === ActionType.Small ? sendSmall() : sendLarge();
};
