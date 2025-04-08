import { render, fireEvent } from '@testing-library/react';
import { CustomCursor } from '../Cursor';
import { useAuthContext } from '../../context';

// Mock the context
jest.mock('../../context', () => ({
  useAuthContext: jest.fn()
}));

describe('CustomCursor Component', () => {
  beforeEach(() => {
    // Mock the context values
    (useAuthContext as jest.Mock).mockReturnValue({
      cursor: 'test-cursor.png'
    });
    
    // Mock window methods
    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    Object.defineProperty(window, 'innerHeight', { value: 768 });
  });

  test('renders cursor with correct image', () => {
    const { getByAltText } = render(<CustomCursor />);
    const cursorImg = getByAltText('cursor');
    expect(cursorImg).toBeInTheDocument();
    expect(cursorImg).toHaveAttribute('src', 'test-cursor.png');
    expect(cursorImg).toHaveClass('min-w-16 min-h-16 max-w-16 max-h-16');
  });

  test('updates position on mouse move', () => {
    const { getByAltText } = render(<CustomCursor />);
    const cursorContainer = getByAltText('cursor').parentElement;
    
    // Initial position should be center of screen
    expect(cursorContainer).toHaveStyle('left: 512px');
    expect(cursorContainer).toHaveStyle('top: 384px');
    
    // Simulate mouse movement
    fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
    
    // Position should update
    expect(cursorContainer).toHaveStyle('left: 100px');
    expect(cursorContainer).toHaveStyle('top: 200px');
  });

  test('sets body cursor to none on mount and auto on unmount', () => {
    const { unmount } = render(<CustomCursor />);
    expect(document.body.style.cursor).toBe('none');
    
    unmount();
    expect(document.body.style.cursor).toBe('auto');
  });
}); 