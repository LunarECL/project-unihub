import { render } from '@testing-library/react';

import Sharedoc from './sharedoc';

describe('Sharedoc', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Sharedoc />);
    expect(baseElement).toBeTruthy();
  });
});
