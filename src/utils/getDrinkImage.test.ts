import { getDrinkImage } from './getDrinkImage';

describe('getDrinkImage', () => {
  test('builds a lowercase, space-stripped image path', () => {
    expect(getDrinkImage('Moscow Mule')).toBe('/Images/moscowmule.jpeg');
  });

  test('handles single-word names', () => {
    expect(getDrinkImage('Mojito')).toBe('/Images/mojito.jpeg');
  });

  test('strips multiple spaces', () => {
    expect(getDrinkImage('Gin   Tonic')).toBe('/Images/gintonic.jpeg');
  });
});
