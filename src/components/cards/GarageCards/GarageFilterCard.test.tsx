import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GarageFilterCard } from './index';
import { IGarageFilterCardProps } from '@/types/garage.type';

// Mock do componente IOSSwitch
jest.mock('@/components/IOSSwitch', () => {
  return ({ checked, onChange, ...props }: any) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    };
    
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        data-testid="ios-switch"
        {...props}
      />
    );
  };
});

// Mock dos ícones do Lucide React
jest.mock('lucide-react', () => ({
  Search: ({ style }: { style?: React.CSSProperties }) => (
    <div data-testid="search-icon" style={style} />
  ),
  ArrowRight: ({ style }: { style?: React.CSSProperties }) => (
    <div data-testid="arrow-right-icon" style={style} />
  ),
}));

// Mock do Material-UI
jest.mock('@mui/material', () => ({
  Card: ({ children, sx }: { children: React.ReactNode; sx?: any }) => (
    <div data-testid="card">
      {children}
    </div>
  ),
  CardContent: ({ children, sx }: { children: React.ReactNode; sx?: any }) => (
    <div data-testid="card-content">
      {children}
    </div>
  ),
  OutlinedInput: ({ 
    placeholder, 
    value, 
    onChange, 
    onKeyDown, 
    startAdornment, 
    endAdornment, 
    sx 
  }: any) => (
    <div data-testid="outlined-input-container">
      {startAdornment}
      <input
        data-testid="search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      {endAdornment}
    </div>
  ),
  InputAdornment: ({ children, position }: { children: React.ReactNode; position: string }) => (
    <div data-testid={`input-adornment-${position}`}>
      {children}
    </div>
  ),
  IconButton: ({ children, onClick, size, sx }: any) => (
    <button
      data-testid="search-button"
      onClick={onClick}
    >
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

  describe('Renderização básica', () => {
    it('deve renderizar corretamente com todas as props', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('card-content')).toBeInTheDocument();
      expect(screen.getByTestId('ios-switch')).toBeInTheDocument();
      expect(screen.getByText('Mensalista Digital')).toBeInTheDocument();
      expect(screen.getByText('25 registros')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('deve mostrar contagem correta de registros', () => {
      const propsWithCount = { ...defaultProps, count: 150 };
      render(<GarageFilterCard {...propsWithCount} />);
      
      expect(screen.getByText('150 registros')).toBeInTheDocument();
    });

    it('deve renderizar com valor de busca inicial', () => {
      const propsWithSearch = { ...defaultProps, search: 'teste busca' };
      render(<GarageFilterCard {...propsWithSearch} />);
      
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toHaveValue('teste busca');
    });

    it('deve renderizar com switch habilitado', () => {
      const propsWithEnabled = { ...defaultProps, enabled: true };
      render(<GarageFilterCard {...propsWithEnabled} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toBeChecked();
    });
  });

  describe('Funcionalidade do switch', () => {
    it('deve renderizar o switch com estado inicial', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveProperty('checked', false);
    });

    it('deve renderizar o switch habilitado quando enabled é true', () => {
      render(<GarageFilterCard {...defaultProps} enabled={true} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveProperty('checked', true);
    });
  });

  describe('Funcionalidade de busca', () => {
    it('deve chamar setSearch quando valor do input muda', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'nova busca' } });
      
      expect(mockSetSearch).toHaveBeenCalledTimes(1);
      expect(mockSetSearch).toHaveBeenCalledWith('nova busca');
    });

    it('deve executar busca quando Enter é pressionado', () => {
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

    it('deve executar busca quando botão de busca é clicado', () => {
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

    it('não deve executar busca com outras teclas', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.keyDown(searchInput, { key: 'Tab', code: 'Tab' });
      fireEvent.keyDown(searchInput, { key: 'Escape', code: 'Escape' });
      
      expect(mockOnFiltersChange).not.toHaveBeenCalled();
    });

    it('deve executar busca com search undefined quando campo está vazio', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: undefined,
        digitalMonthlyPayer: false,
      });
    });
  });

  describe('Integração de filtros', () => {
    it('deve combinar search e switch corretamente', () => {
      const propsWithBoth = { ...defaultProps, search: 'teste', enabled: true };
      render(<GarageFilterCard {...propsWithBoth} />);
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: 'teste',
        digitalMonthlyPayer: true,
      });
    });

    it('deve funcionar sem onFiltersChange definido', () => {
      const propsWithoutCallback = { ...defaultProps, onFiltersChange: undefined };
      render(<GarageFilterCard {...propsWithoutCallback} />);
      
      const searchInput = screen.getByTestId('search-input');
      const switchElement = screen.getByTestId('ios-switch');
      
      // Não deve quebrar quando callbacks não existem
      expect(() => {
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
        fireEvent.change(switchElement, { target: { checked: true } });
      }).not.toThrow();
    });
  });

  describe('Elementos visuais', () => {
    it('deve renderizar ícones corretamente', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
    });

    it('deve ter placeholder correto no input', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toHaveAttribute('placeholder', 'Buscar por nome ou código');
    });

    it('deve renderizar adornments do input', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      expect(screen.getByTestId('input-adornment-start')).toBeInTheDocument();
      expect(screen.getByTestId('input-adornment-end')).toBeInTheDocument();
    });
  });

  describe('Casos extremos', () => {
    it('deve funcionar com valores undefined', () => {
      const propsWithUndefined = {
        ...defaultProps,
        search: '',
        onFiltersChange: undefined,
      };
      
      expect(() => render(<GarageFilterCard {...propsWithUndefined} />)).not.toThrow();
    });

    it('deve funcionar com count zero', () => {
      render(<GarageFilterCard {...defaultProps} count={0} />);
      
      expect(screen.getByText('0 registros')).toBeInTheDocument();
    });

    it('deve funcionar com search vazio', () => {
      render(<GarageFilterCard {...defaultProps} search="" />);
      
      const input = screen.getByTestId('search-input');
      expect(input).toHaveValue('');
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter elementos focáveis', () => {
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

    it('deve ter labels apropriados', () => {
      render(<GarageFilterCard {...defaultProps} />);
      
      expect(screen.getByText('Mensalista Digital')).toBeInTheDocument();
    });
  });
});