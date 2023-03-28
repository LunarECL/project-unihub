import { render } from '@testing-library/react';

import WebappShareDocList from './webapp-share-doc-list';

describe('WebappShareDocList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WebappShareDocList />);
    expect(baseElement).toBeTruthy();
  });
});
