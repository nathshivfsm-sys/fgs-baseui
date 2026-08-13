export const sharedDependencies = {
  react: { singleton: true, requiredVersion: '19.2.8' },
  'react-dom': { singleton: true, requiredVersion: '19.2.8' },
  'react-router-dom': { singleton: true, requiredVersion: '7.18.2' },
  '@tanstack/react-query': { singleton: true, requiredVersion: '5.101.4' },
  zustand: { singleton: true, requiredVersion: '5.0.14' },
  '@cms/ui': { singleton: true, requiredVersion: '0.0.1' },
} as const;
