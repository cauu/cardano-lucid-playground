import { MenuList, MenuItem } from '@mui/material';

import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { SwitchNetworkButton } from '../components/SwitchNetworkButton';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const menus = [
  {
    title: 'Simplest Mint',
    path: '/simplest-mint'
  },
  {
    title: 'Mint By Guessword',
    path: '/mint-by-guessword'
  },
  {
    title: 'Hello, World!',
    path: '/hello-world'
  },
  {
    title: 'Vesting',
    path: '/vesting'
  }
];

export const MainLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-[100vh]">
      <header className="flex justify-between items-center w-full border-b p-4">
        <a href="/" target="_blank" className="font-[600] text-xl">
          Cardano Playground
        </a>
        <div className="flex gap-2">
          <SwitchNetworkButton />
          <ConnectWalletButton />
        </div>
      </header>

      <main className="flex flex-1">
        <div className="w-[180px] border-r flex-0">
          <MenuList className="!py-0">
            {menus.map((menu) => {
              return (
                <MenuItem
                  key={menu.path}
                  selected={pathname === menu.path}
                  onClick={() => {
                    navigate(menu.path);
                  }}
                >
                  {menu.title}
                </MenuItem>
              );
            })}
          </MenuList>
        </div>
        <div className="flex flex-1 px-8 py-4">
          <Outlet />
        </div>
      </main>

      {/* <ConnectWalletList showUnavailableWallets={UnavailableWalletVisibility.SHOW_UNAVAILABLE} /> */}
    </div>
  );
};
