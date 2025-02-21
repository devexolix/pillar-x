import { Token } from '@etherspot/prime-sdk/dist/sdk/data';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

// redux store
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

// components
import TokensSearchResult from '../TokensSearchResult';

// reducers
import {
  setSearchTokenResult,
  setSelectedChain,
  setSelectedToken,
  setTokenListData,
} from '../../../reducer/tokenAtlasSlice';

const mockTokens: Token[] = [
  {
    name: 'Token1',
    symbol: 'TK1',
    chainId: 1,
    icon: 'logo1.png',
    decimals: 18,
    address: '0x01',
  },
  {
    name: 'Token2',
    symbol: 'TK2',
    chainId: 2,
    icon: 'logo2.png',
    decimals: 18,
    address: '0x02',
  },
];

const mockTokenListData: Token[] = [
  {
    name: 'TokenList1',
    symbol: 'TL1',
    chainId: 1,
    icon: 'listLogo1.png',
    decimals: 18,
    address: '0x01',
  },
  {
    name: 'TokenList2',
    symbol: 'TL2',
    chainId: 2,
    icon: 'listLogo2.png',
    decimals: 18,
    address: '0x02',
  },
];

describe('<TokensSearchResult />', () => {
  beforeEach(() => {
    store.dispatch(setSearchTokenResult(mockTokens));
    store.dispatch(setSelectedChain({ chainId: 0, chainName: 'all' }));
    store.dispatch(setSelectedToken(undefined));
    store.dispatch(setTokenListData(mockTokenListData));
  });
  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <TokensSearchResult />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders search results when tokens are present', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TokensSearchResult />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Token1')).toBeInTheDocument();
    expect(screen.getByText('Token2')).toBeInTheDocument();
  });

  it('renders token list data when no search results are present and chain is selected', () => {
    store.dispatch(setSearchTokenResult([]));
    store.dispatch(setSelectedChain({ chainId: 1, chainName: 'chain1' }));
    store.dispatch(setSelectedToken(undefined));
    store.dispatch(setTokenListData(mockTokenListData));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TokensSearchResult />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('TokenList1')).toBeInTheDocument();
    expect(screen.queryByText('TokenList2')).not.toBeInTheDocument();
  });

  it('handles token selection', () => {
    const mockToken: Token = {
      name: 'TestToken',
      symbol: 'TTK',
      chainId: 1,
      icon: 'testLogo.png',
      decimals: 6,
      address: '0x06',
    };

    store.dispatch(setSearchTokenResult([mockToken]));
    store.dispatch(setSelectedChain({ chainId: 0, chainName: 'all' }));
    store.dispatch(setSelectedToken(undefined));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TokensSearchResult />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('TestToken'));

    expect(store.getState().tokenAtlas.selectedToken).toEqual(mockToken);
    expect(store.getState().tokenAtlas.isSearchTokenModalOpen).toBe(false);
    expect(store.getState().tokenAtlas.selectedChain).toEqual({
      chainId: 0,
      chainName: 'all',
    });
    expect(store.getState().tokenAtlas.searchTokenResult).toEqual([]);
  });
});
