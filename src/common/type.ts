export enum SupportedWallet {
  eternl = 'eternl',
  flint = 'flint',
  gerowallet = 'gerowallet',
  nami = 'nami',
  cardwallet = 'cardwallet',
  typhon = 'typhoncip30',
  yoroi = 'yoroi',
  lodeWallet = 'LodeWallet',
  nufi = 'nufi',
  vespr = 'vespr',
  begin = 'begin',
  lace = 'lace'
}

export interface WalletInfo {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly extensionUrl: string;
  readonly websiteUrl: string;
  readonly isInstalled?: boolean;
  readonly isMobile?: boolean;
}

export type DataType = 'bytes' | 'integer';
