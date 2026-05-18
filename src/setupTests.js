import '@testing-library/jest-dom';

// Mock axios so Jest doesn't have to parse its ESM build (CRA's Jest config
// doesn't transform node_modules and axios v1 ships as ESM).
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: () => ({
      get: jest.fn().mockResolvedValue({ data: [] }),
      post: jest.fn().mockResolvedValue({ data: {} }),
      defaults: { headers: { common: {} } },
    }),
  },
}));
