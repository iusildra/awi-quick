import { CheckAvailabilityMiddleware } from './check-availability.middleware';

describe('CheckAvailabilityMiddleware', () => {
  it('should be defined', () => {
    expect(new CheckAvailabilityMiddleware()).toBeDefined();
  });
});
