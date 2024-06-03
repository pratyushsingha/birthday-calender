import { render, screen, fireEvent } from '@testing-library/react';
import Calender from '../src/components/Calender';
test('renders calendar and handles date selection', async () => {
    render(<Calender />);

    const dateInput = screen.getByLabelText(/select a date/i);

    fireEvent.change(dateInput, { target: { value: '01/01/2022' } });

    const birthdayText = await screen.findByText((content) =>
        content.includes('Birthdays on Sat Jan 01 2022')
    );

    expect(birthdayText).toBeInTheDocument();
});
