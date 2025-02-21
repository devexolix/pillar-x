import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// components
import TokenResultCard from '../TokenResultCard';

// utils
import { convertChainIdtoName } from '../../../utils/converters';

// Mock of the convertChainIdtoName function
jest.mock('../../../utils/converters', () => ({
  convertChainIdtoName: jest.fn(),
}));

const mockOnClick = jest.fn();
const mockTokenName = 'Ethereum';
const mockTokenSymbol = 'ETH';
const mockTokenChain = 1;
const mockTokenLogo = 'https://example.com/logo.png';

describe('<TokenResultCard />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <TokenResultCard
          onClick={mockOnClick}
          tokenName={mockTokenName}
          tokenSymbol={mockTokenSymbol}
          tokenChain={mockTokenChain}
          tokenLogo={mockTokenLogo}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('displays the token name and symbol when provided', () => {
    render(
      <TokenResultCard
        onClick={mockOnClick}
        tokenName={mockTokenName}
        tokenSymbol={mockTokenSymbol}
        tokenChain={mockTokenChain}
        tokenLogo={mockTokenLogo}
      />
    );

    expect(screen.getByText(mockTokenName)).toBeInTheDocument();
    expect(screen.getByText(mockTokenSymbol)).toBeInTheDocument();
  });

  it('displays the token chain name when provided', () => {
    (convertChainIdtoName as jest.Mock).mockReturnValue('Ethereum');
    render(
      <TokenResultCard
        onClick={mockOnClick}
        tokenName={mockTokenName}
        tokenSymbol={mockTokenSymbol}
        tokenChain={mockTokenChain}
        tokenLogo={mockTokenLogo}
      />
    );

    expect(screen.getByText('On Ethereum')).toBeInTheDocument();
    expect(convertChainIdtoName as jest.Mock).toHaveBeenCalledWith(
      mockTokenChain
    );
  });

  it('displays the token logo when provided', () => {
    render(
      <TokenResultCard
        onClick={mockOnClick}
        tokenName={mockTokenName}
        tokenSymbol={mockTokenSymbol}
        tokenChain={mockTokenChain}
        tokenLogo={mockTokenLogo}
      />
    );

    const logo = screen.getByRole('img');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', mockTokenLogo);
  });

  it('does not display token name, symbol, chain, or logo when not provided', () => {
    render(<TokenResultCard onClick={mockOnClick} />);

    expect(screen.queryByText(mockTokenName)).not.toBeInTheDocument();
    expect(screen.queryByText(mockTokenSymbol)).not.toBeInTheDocument();
    expect(screen.queryByText('On Ethereum')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('handles click events correctly', () => {
    render(
      <TokenResultCard
        onClick={mockOnClick}
        tokenName={mockTokenName}
        tokenSymbol={mockTokenSymbol}
        tokenChain={mockTokenChain}
        tokenLogo={mockTokenLogo}
      />
    );

    fireEvent.click(screen.getByTestId('token-result-card'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
