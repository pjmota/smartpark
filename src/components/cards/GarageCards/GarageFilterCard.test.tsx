import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GarageFilterCard } from './index';
import { IGarageFilterCardProps } from '@/types/garage.type';

jest.mock('@/components/IOSSwitch', () => {
  return function MockIOSSwitch({ checked, onChange }: any) {
    return (
      <input
        data-testid="ios-switch"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  };
});

jest.mock('lucide-react', () => ({
  Search: ({ className, ...props }: any) => (
    <span data-testid="search-icon" className={className} {...props}>
      Search
    </span>
  ),
  ArrowRight: ({ className, ...props }: any) => (
    <span data-testid="arrow-right-icon" className={className} {...props}>
      ArrowRight
    </span>
  ),
}));

jest.mock('@mui/material', () => ({
  Card: ({ children }: any) => (
    <div data-testid="card">{children}</div>
  ),
  CardContent: ({ children }: any) => (
    <div data-testid="card-content">{children}</div>
  ),
  TextField: ({ value, onChange, onKeyDown, placeholder, InputProps, sx }: any) => (
    <div>
      <input
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
      {InputProps?.startAdornment && (
        <div data-testid="input-adornment-start">
          {InputProps.startAdornment}
        </div>
      )}
      {InputProps?.endAdornment && (
        <div data-testid="input-adornment-end">
          {InputProps.endAdornment}
        </div>
      )}
    </div>
  ),
  InputAdornment: ({ children, position }: any) => (
    <div data-testid={`input-adornment-${position}`}>
      {children}
    </div>
  ),
  IconButton: ({ children, onClick }: any) => (
    <button data-testid="search-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('GarageFilterCard', () => {
  const mockSetSearch = jest.fn();
  const mockSetEnabled = jest.fn();
  const mockOnFiltersChange = jest.fn();

  const defaultProps: IGarageFilterCardProps = {
    count: 25,
    search: '',
    setSearch: mockSetSearch,
    enabled: false,
    setEnabled: mockSetEnabled,
    onFiltersChange: mockOnFiltersChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render correctly with all props', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('card-content')).toBeInTheDocument();
      expect(screen.getByTestId('ios-switch')).toBeInTheDocument();
      expect(screen.getByText('Mensalista Digital')).toBeInTheDocument();
      expect(screen.getByText('25 registros')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('should show correct record count', () => {
      const propsWithCount = { ...defaultProps, count: 150 };
      render(<GarageFilterCard {...propsWithCount} />);
      
      expect(screen.getByText('150 registros')).toBeInTheDocument();
    });

    it('should render with initial search value', () => {
      const propsWithSearch = { ...defaultProps, search: 'teste busca' };
      render(<GarageFilterCard {...propsWithSearch} />);
      
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toHaveValue('teste busca');
    });

    it('should render with enabled switch', () => {
      const propsWithEnabled = { ...defaultProps, enabled: true };
      render(<GarageFilterCard {...propsWithEnabled} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toBeChecked();
    });
  });

  describe('Switch functionality', () => {
    it('should render switch with initial state', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveProperty('checked', false);
    });

    it('should render enabled switch when enabled is true', () => {
      render(<GarageFilterCard {...defaultProps} enabled={true} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveProperty('checked', true);
    });
  });

  describe('Search functionality', () => {
    it('should call setSearch when input value changes', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'nova busca' } });
      
      expect(mockSetSearch).toHaveBeenCalledTimes(1);
      expect(mockSetSearch).toHaveBeenCalledWith('nova busca');
    });

    it('should execute search when Enter is pressed', () => {
      const propsWithSearch = { ...defaultProps, search: 'busca teste' };
      render(<GarageFilterCard {...propsWithSearch} />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      
      expect(mockOnFiltersChange).toHaveBeenCalledTimes(1);
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: 'busca teste',
        digitalMonthlyPayer: false,
      });
    });

    it('should execute search when search button is clicked', () => {
      const propsWithSearch = { ...defaultProps, search: 'busca clique' };
      render(<GarageFilterCard {...propsWithSearch} />);
      
      const searchButton = screen.getByTestId('search-button');
      fireEvent.click(searchButton);
      
      expect(mockOnFiltersChange).toHaveBeenCalledTimes(1);
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: 'busca clique',
        digitalMonthlyPayer: false,
      });
    });

    it('should not execute search with other keys', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.keyDown(searchInput, { key: 'Tab', code: 'Tab' });
      fireEvent.keyDown(searchInput, { key: 'Escape', code: 'Escape' });
      
      expect(mockOnFiltersChange).not.toHaveBeenCalled();
    });

    it('should execute search with undefined search when field is empty', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: undefined,
        digitalMonthlyPayer: false,
      });
    });
  });

  describe('Filter integration', () => {
    it('should combine search and switch correctly', () => {
      const propsWithBoth = { ...defaultProps, search: 'teste', enabled: true };
      render(<GarageFilterCard {...propsWithBoth} />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: 'teste',
        digitalMonthlyPayer: true,
      });
    });

    it('should work without onFiltersChange defined', () => {
      const propsWithoutCallback = { ...defaultProps, onFiltersChange: undefined };
      render(<GarageFilterCard {...propsWithoutCallback} />);
      
      const searchInput = screen.getByTestId('search-input');
      const switchElement = screen.getByTestId('ios-switch');
      
      // Should not break when callbacks don't exist
      expect(() => {
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
        fireEvent.change(switchElement, { target: { checked: true } });
      }).not.toThrow();
    });
  });

  describe('Visual elements', () => {
    it('should render icons correctly', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
    });

    it('should have correct placeholder in input', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toHaveAttribute('placeholder', 'Buscar por nome ou código');
    });

    it('should render input adornments', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      expect(screen.getByTestId('input-adornment-start')).toBeInTheDocument();
      expect(screen.getByTestId('input-adornment-end')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should work with undefined values', () => {
      const propsWithUndefined = {
        ...defaultProps,
        search: '',
        onFiltersChange: undefined,
      };
      
      expect(() => render(<GarageFilterCard {...propsWithUndefined} />)).not.toThrow();
    });

    it('should work with zero count', () => {
      render(<GarageFilterCard {...defaultProps} count={0} />);
      
      expect(screen.getByText('0 registros')).toBeInTheDocument();
    });

    it('should work with empty search', () => {
      render(<GarageFilterCard {...defaultProps} search="" />);
      
      const input = screen.getByTestId('search-input');
      expect(input).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('should have focusable elements', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      const searchInput = screen.getByTestId('search-input');
      const switchElement = screen.getByTestId('ios-switch');
      const searchButton = screen.getByTestId('search-button');
      
      searchInput.focus();
      expect(searchInput).toHaveFocus();
      
      switchElement.focus();
      expect(switchElement).toHaveFocus();
      
      searchButton.focus();
      expect(searchButton).toHaveFocus();
    });

    it('should have appropriate labels', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      expect(screen.getByText('Mensalista Digital')).toBeInTheDocument();
    });
  });
});