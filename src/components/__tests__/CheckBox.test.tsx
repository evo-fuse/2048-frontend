import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CheckBox } from '../CheckBox';
import { Images } from '../../assets/images';

describe('CheckBox Component', () => {
  const mockToggle = jest.fn();
  
  beforeEach(() => {
    mockToggle.mockClear();
  });

  test('renders with unchecked state', () => {
    render(<CheckBox isOpen={false} onToggle={mockToggle} size={24} />);
    const img = screen.getByAltText('check');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', Images.Uncheck);
    expect(img).toHaveAttribute('width', '24');
  });

  test('renders with checked state', () => {
    render(<CheckBox isOpen={true} onToggle={mockToggle} size={24} />);
    const img = screen.getByAltText('check');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', Images.Check);
  });

  test('calls onToggle when clicked', () => {
    render(<CheckBox isOpen={false} onToggle={mockToggle} size={24} />);
    fireEvent.click(screen.getByAltText('check'));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
}); 