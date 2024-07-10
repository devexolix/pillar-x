import renderer from 'react-test-renderer';
import { render, screen, fireEvent } from '@testing-library/react';

// components
import SelectToken from '../SelectToken';

// types
import { CardPosition } from '../../../utils/types';

// utils
import { convertChainIdtoName } from '../../../utils/converters';

// Mock the convertChainIdtoName function
jest.mock('../../../utils/converters', () => ({
    convertChainIdtoName: jest.fn(),
}));

describe('<SelectToken />', () => {
    const type = CardPosition.SWAP;
    const tokenName = 'Token Example';
    const tokenChain = 1; 
    const tokenLogo = 'https://example.com/token-logo.png';
    const onClickMock = jest.fn();

    it('renders correctly and matches snapshot', () => {
        const tree = renderer
            .create(<SelectToken type={type} tokenName={tokenName} tokenChain={tokenChain} tokenLogo={tokenLogo} onClick={onClickMock} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders SelectToken correctly with arguments', () => {
        render(<SelectToken type={type} tokenName={tokenName} tokenChain={tokenChain} tokenLogo={tokenLogo} onClick={onClickMock} />);
    
        expect(screen.getByText(tokenName)).toBeInTheDocument();
        expect(screen.getByText(`On ${convertChainIdtoName(tokenChain)}`)).toBeInTheDocument();
        expect(screen.getByAltText('token-logo')).toHaveAttribute('src', tokenLogo);
    });
    
    it('renders "Select Token" with type when token is not provided', () => {
        render(<SelectToken type={type} onClick={onClickMock} />);
    
        expect(screen.getByText(type)).toBeInTheDocument();
        expect(screen.getByText('Select Token')).toBeInTheDocument();
        expect(screen.queryByText(`On ${convertChainIdtoName(tokenChain)}`)).not.toBeInTheDocument();
        expect(screen.queryByAltText('token-logo')).not.toBeInTheDocument();
    });
    
    it('calls onClick when SelectToken is clicked', () => {
        render(<SelectToken type={type} tokenName={tokenName} tokenChain={tokenChain} tokenLogo={tokenLogo} onClick={onClickMock} />);
    
        const selectTokenDiv = screen.getByText(tokenName).closest('div');
        if (selectTokenDiv) {
            fireEvent.click(selectTokenDiv);
            expect(onClickMock).toHaveBeenCalled();
        }
    });
});
