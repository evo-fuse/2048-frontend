// Add TextEncoder and TextDecoder polyfills
import { TextEncoder, TextDecoder } from 'util';

// Use type assertion to fix the compatibility issue
global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from '../PrivateRoute';
import { useAuthContext } from '../../context';
import { PATH } from '../../const';

// Mock the context
jest.mock('../../context', () => ({
  useAuthContext: jest.fn()
}));

describe('PrivateRoute Component', () => {
  test('renders outlet when user is authenticated', () => {
    // Mock authenticated user
    (useAuthContext as jest.Mock).mockReturnValue({
      user: { id: '123', name: 'Test User' }
    });
    
    const { getByText } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<PrivateRoute />}>
            <Route index element={<div>Protected Content</div>} />
          </Route>
          <Route path={PATH.WALLET_CREATION} element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    // Mock unauthenticated user
    (useAuthContext as jest.Mock).mockReturnValue({
      user: null
    });
    
    const { getByText } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<PrivateRoute />}>
            <Route index element={<div>Protected Content</div>} />
          </Route>
          <Route path={PATH.WALLET_CREATION} element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(getByText('Login Page')).toBeInTheDocument();
  });
}); 