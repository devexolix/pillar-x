import { usePrivy } from '@privy-io/react-auth';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// images
import { ReactComponent as IconApps } from '../../assets/images/icon/icon-apps.svg';
import { ReactComponent as IconHistory } from '../../assets/images/icon/icon-history.svg';
import { ReactComponent as IconHome } from '../../assets/images/icon/icon-home.svg';
import { ReactComponent as IconSend } from '../../assets/images/icon/icon-send.svg';
import { ReactComponent as IconWallet } from '../../assets/images/icon/icon-wallet.svg';

// navigation
import { navigationRoute } from '../../navigation';

// hooks
import useBottomMenuModal from '../../hooks/useBottomMenuModal';

// providers
import { BottomMenuItem } from '../../providers/BottomMenuModalProvider';

// components
import BottomMenuModal from '../BottomMenuModal';

const BottomMenu = () => {
  const { authenticated } = usePrivy();
  const navLocation = useLocation();
  const navigate = useNavigate();
  const [t] = useTranslation();
  const { active, show, hide } = useBottomMenuModal();

  if (!authenticated) return null;

  const menuItems = [
    {
      icon: <IconSend />,
      type: 'send',
      label: t`menuAction.send`,
    },
    {
      icon: <IconHistory />,
      type: 'history',
      label: t`menuAction.history`,
    },
    {
      icon: <IconWallet />,
      type: 'account',
      label: t`menuAction.account`,
    },
    {
      icon: <IconApps />,
      type: 'apps',
      label: t`menuAction.apps`,
    },
  ];

  const isHomeActive = active === null
    && navLocation.pathname === '/';

  return (
    <>
      <Wrapper>
        <HomeMenuItem>
          <MenuItem
            onClick={() => navigate(navigationRoute.home)}
            className={isHomeActive ? 'active' : ''}
          >
            <IconHome />
          </MenuItem>
        </HomeMenuItem>
        <MainMenuItems>
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.label + index}
              onClick={() => {
                if (active?.type === item.type) {
                  hide();
                  return;
                }
                show({ type: item.type as BottomMenuItem['type'] });
              }}
              className={active?.type === item.type ? 'active' : ''}
            >
              {item.icon}
              <span>{item.label}</span>
            </MenuItem>
          ))}
        </MainMenuItems>
      </Wrapper>
      <BottomMenuModal
        activeMenuItem={active}
        onClose={hide}
      />
    </>
  );
}

const MenuItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${({ theme }) => theme.color.text.bottomMenuItem};
  height: 48px;
  overflow: hidden;
  cursor: pointer;
  transition: all .1s ease-in-out;
  font-weight: 400;
  letter-spacing: -0.5px;
  font-size: 14px;

  &:first-child {
    margin-left: 17px;
  }

  &:last-child {
    margin-right: 17px;
  }

  span {
    display: none;
  }
`;

const Wrapper = styled.div`
  // max-width: 800px; TODO: inspect and remove/adjust
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  position: fixed;
  bottom: 40px;
  left: 50%;
  z-index: 100;
  transform: translateX(-50%);

  &:not(&:hover) ${MenuItem}.active, ${MenuItem}:hover {
    padding: 0 13px;
    margin: 0;
    border-radius: 100px;
    background: ${({ theme }) => theme.color.background.bottomMenuItemHover};

    span {
      display: block;
    }
  }
`;

const MainMenuItems = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(5px);
  background: ${({ theme }) => theme.color.background.bottomMenu};
  border-radius: 130px;
  padding: 6px 7px;
  width: 280px;
  height: 60px;
`;

const HomeMenuItem = styled(MainMenuItems)`
  flex: none;
  width: 60px;
  height: 60px;

  ${MenuItem} {
    width: 48px;

    &:first-child, &:last-child {
      margin: 0
    }

    &:hover {
      padding: 0;
    }
  }
`;

export default BottomMenu;
