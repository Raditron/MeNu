import { cleanup } from '@testing-library/react-native';
import { resetMockAuth } from './mocks/firebaseAuth';
import { stubFetch } from './mocks/fetch';

beforeEach(() => {
  resetMockAuth();
  stubFetch();
});

afterEach(() => {
  cleanup();
});
