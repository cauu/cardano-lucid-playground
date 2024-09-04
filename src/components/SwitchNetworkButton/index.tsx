import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

import { useLucid } from '@/src/hooks/useLucid';
import { NetworkType } from '@cardano-foundation/cardano-connect-with-wallet-core';

export const SwitchNetworkButton = () => {
  const { networkType, switchNetwork } = useLucid();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSelect = (network: NetworkType) => {
    setAnchorEl(null);
    switchNetwork(network);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClick}>
        {networkType}
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem id={NetworkType.MAINNET} onClick={() => handleSelect(NetworkType.MAINNET)}>
          {NetworkType.MAINNET}
        </MenuItem>
        <MenuItem id={NetworkType.TESTNET} onClick={() => handleSelect(NetworkType.TESTNET)}>
          {NetworkType.TESTNET}
        </MenuItem>
      </Menu>
    </>
  );
};
