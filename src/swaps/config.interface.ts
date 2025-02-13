import { Provider } from './swap.interface';

export interface SwapServerConfig {
  rpc: string[];
  steemEngineRpc: string[];
  swaps: SwapConfig;
  priceRefreshIntervalInMinutes: number;
}

export interface SwapConfig {
  account: string;
  marketPool: MarketPoolConfig;
  blockInfoFilePath: string;
  fee: SwapFeeConfig;
  expiration: SwapExpirationConfig;
  slippage: SwapSlippageConfig;
  providers: IProviderItem;
  maxDelayLayerTwo: number;
  maxDelayLayerTwoWithLayerOne: number;
}

export interface SwapExpirationConfig {
  expiresAfterXDays: number;
  clearingRoutineFrequencyInHours: number;
}

export interface SwapFeeConfig {
  account: string;
  amount: number;
  ignoreList: string[];
}

export interface SwapSlippageConfig {
  min: number;
  default: number;
}

export interface MarketPoolConfig {
  deactivated?: boolean;
}

export interface PublicConfig {
  account: string;
  fee: SwapFeeConfig;
  slippage: SwapSlippageConfig;
}

export type IProviderItem = { [p in Provider]?: IProvider };

export interface IProvider {
  name: Provider;
  fullName: string;
  accountName: string;
  withdrawal: IConvertOptions;
  deposit: IConvertOptions;
  deactivated?: boolean;
  rewardAccountName?: string;
  rewardToken?: string;
}

export interface IConvertOptions {
  minimumAmount?: number;
  fee: number;
  minimumFee: number;
  balancedFreeFee: boolean;
  skipBalanceCheck?: boolean;
  memoRegex?: string;
}
