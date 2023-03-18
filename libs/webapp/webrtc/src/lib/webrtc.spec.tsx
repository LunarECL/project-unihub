import { render } from '@testing-library/react';

import Webrtc from './DisplayRoom';

describe('WebappWebrtc', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Webrtc />);
    expect(baseElement).toBeTruthy();
  });
});
