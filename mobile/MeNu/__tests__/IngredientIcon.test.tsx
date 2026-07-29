import { render } from '@testing-library/react-native';

import { IngredientIcon } from '../meal/components/IngredientIcon/IngredientIcon';

describe('IngredientIcon', () => {
  it('renders the matching Game Icons SVG for a resolvable key', async () => {
    const { getByTestId } = await render(<IngredientIcon iconKey="GiPig" />);

    expect(getByTestId('ingredient-icon-svg')).toBeTruthy();
  });

  it('renders a neutral fallback glyph for an unresolved key, not a blank/broken image', async () => {
    const { getByText, queryByTestId } = await render(<IngredientIcon iconKey="GiNotARealIcon" />);

    expect(getByText('🍽️')).toBeTruthy();
    expect(queryByTestId('ingredient-icon-svg')).toBeNull();
  });

  it('sizes the fallback glyph relative to the requested size', async () => {
    const { getByText } = await render(<IngredientIcon iconKey="GiNotARealIcon" size={100} />);

    const glyph = getByText('🍽️');
    const flatStyle = [glyph.props.style].flat();
    expect(flatStyle).toContainEqual(expect.objectContaining({ fontSize: 70 }));
  });
});
