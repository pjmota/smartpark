import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GarageFilterCard } from './index';
import { IGarageFilterCardProps } from '@/types/garage.type';

// Mock dos ícones do lucide-react
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">Search</div>,
  ArrowRight: () => <div data-testid="arrow-right-icon">ArrowRight</div>,
}));

// Mock do IOSSwitch
jest.mock('@/components/IOSSwitch', () => {
  return function MockIOSSwitch({ checked, onChange }: { checked: boolean; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e);
    };
    
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        data-testid="ios-switch"
      />
    );
  };
});

describe('GarageFilterCard', () => {
  const defaultProps: IGarageFilterCardProps = {
    count: 10,
    search: '',
    setSearch: jest.fn(),
    enabled: false,
    setEnabled: jest.fn(),
    onFiltersChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente com props padrão', () => {
    render(<GarageFilterCard {...defaultProps} />);
    
    expect(screen.getByText('Mensalista Digital')).toBeInTheDocument();
    expect(screen.getByText('10 registros')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar por nome ou código')).toBeInTheDocument();
    expect(screen.getByTestId('ios-switch')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
  });

  it('deve exibir o valor de busca correto', () => {
    const props = { ...defaultProps, search: 'teste busca' };
    render(<GarageFilterCard {...props} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar por nome ou código');
    expect(searchInput).toHaveValue('teste busca');
  });

  it('deve exibir o switch habilitado quando enabled é true', () => {
    const props = { ...defaultProps, enabled: true };
    render(<GarageFilterCard {...props} />);
    
    const switchElement = screen.getByTestId('ios-switch');
    expect(switchElement).toBeChecked();
  });

  it('deve chamar setSearch quando o valor do input muda', () => {
    const setSearch = jest.fn();
    const props = { ...defaultProps, setSearch };
    render(<GarageFilterCard {...props} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar por nome ou código');
    fireEvent.change(searchInput, { target: { value: 'nova busca' } });
    
    expect(setSearch).toHaveBeenCalledWith('nova busca');
  });

  it('deve chamar setEnabled e onFiltersChange quando o switch muda', () => {
    const setEnabled = jest.fn();
    const onFiltersChange = jest.fn();
    const props = { ...defaultProps, setEnabled, onFiltersChange };
    render(<GarageFilterCard {...props} />);
    
    const switchElement = screen.getByTestId('ios-switch');
    
    fireEvent.click(switchElement);
    
    expect(setEnabled).toHaveBeenCalledWith(true);
    expect(onFiltersChange).toHaveBeenCalledWith({
      search: undefined,
      digitalMonthlyPayer: true,
    });
  });

  it('deve chamar onFiltersChange com search quando pressiona Enter', () => {
    const onFiltersChange = jest.fn();
    const props = { ...defaultProps, search: 'busca teste', onFiltersChange };
    render(<GarageFilterCard {...props} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar por nome ou código');
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    
    expect(onFiltersChange).toHaveBeenCalledWith({
      search: 'busca teste',
      digitalMonthlyPayer: false,
    });
  });

  it('deve chamar onFiltersChange quando clica no botão de busca', () => {
    const onFiltersChange = jest.fn();
    const props = { ...defaultProps, search: 'busca teste', onFiltersChange };
    render(<GarageFilterCard {...props} />);
    
    const searchButton = screen.getByRole('button');
    fireEvent.click(searchButton);
    
    expect(onFiltersChange).toHaveBeenCalledWith({
      search: 'busca teste',
      digitalMonthlyPayer: false,
    });
  });

  it('não deve chamar onFiltersChange quando pressiona outras teclas', () => {
    const onFiltersChange = jest.fn();
    const props = { ...defaultProps, onFiltersChange };
    render(<GarageFilterCard {...props} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar por nome ou código');
    fireEvent.keyDown(searchInput, { key: 'Tab' });
    fireEvent.keyDown(searchInput, { key: 'Escape' });
    
    expect(onFiltersChange).not.toHaveBeenCalled();
  });

  it('deve funcionar sem onFiltersChange definido', () => {
    const setEnabled = jest.fn();
    const props = { ...defaultProps, setEnabled, onFiltersChange: undefined };
    render(<GarageFilterCard {...props} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar por nome ou código');
    const switchElement = screen.getByTestId('ios-switch');
    const searchButton = screen.getByRole('button');
    
    expect(() => {
      fireEvent.keyDown(searchInput, { key: 'Enter' });
      fireEvent.click(searchButton);
      fireEvent.click(switchElement);
    }).not.toThrow();
    
    expect(setEnabled).toHaveBeenCalledWith(true);
  });

  it('deve passar search como undefined quando está vazio', () => {
    const onFiltersChange = jest.fn();
    const props = { ...defaultProps, search: '', onFiltersChange };
    render(<GarageFilterCard {...props} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar por nome ou código');
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    
    expect(onFiltersChange).toHaveBeenCalledWith({
      search: undefined,
      digitalMonthlyPayer: false,
    });
  });

  it('deve exibir contagem correta de registros', () => {
    const props = { ...defaultProps, count: 25 };
    render(<GarageFilterCard {...props} />);
    
    expect(screen.getByText('25 registros')).toBeInTheDocument();
  });

  it('deve manter o estado do switch ao executar busca', () => {
    const onFiltersChange = jest.fn();
    const props = { ...defaultProps, enabled: true, search: 'teste', onFiltersChange };
    render(<GarageFilterCard {...props} />);
    
    const searchButton = screen.getByRole('button');
    fireEvent.click(searchButton);
    
    expect(onFiltersChange).toHaveBeenCalledWith({
      search: 'teste',
      digitalMonthlyPayer: true,
    });
  });

  it('deve testar todos os caminhos do handleSwitchChange', () => {
    const setEnabled = jest.fn();
    const onFiltersChange = jest.fn();
    const props = { ...defaultProps, search: '', setEnabled, onFiltersChange };
    render(<GarageFilterCard {...props} />);
    
    const switchElement = screen.getByTestId('ios-switch');
    fireEvent.click(switchElement);
    
    expect(setEnabled).toHaveBeenCalledWith(true);
    expect(onFiltersChange).toHaveBeenCalledWith({
      search: undefined,
      digitalMonthlyPayer: true,
    });
  });
});