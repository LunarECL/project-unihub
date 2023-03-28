import { render } from '@testing-library/react';

import { WebappTimetable } from './webapp-timetable';

describe('WebappTimetable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WebappTimetable />);
    expect(baseElement).toBeTruthy();
  });
});
