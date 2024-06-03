// src/components/Calendar.tsx
import { useEffect, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { FaStar, FaRegStar } from 'react-icons/fa';
import axios from 'axios';

interface Birthday {
    text: string;
    year: number;
}

const BASE_URL = "https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday"

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [birthdays, setBirthdays] = useState<Birthday[]>([]);
    const [favorites, setFavorites] = useState<Birthday[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchBirthdays = async (date: Date) => {
        setLoading(true);
        try {
            setBirthdays([]);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const response = await axios.get(`${BASE_URL}/births/${month}/${day}`);
            setBirthdays(response.data.births);
            setLoading(false);
        } catch (error) {
            alert('Error fetching birthdays');
            setLoading(false);
        }
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date) {
            fetchBirthdays(date);
        }
    };

    const isFavorite = (birthday: Birthday) => {
        return favorites.some(fav => fav.text === birthday.text && fav.year === birthday.year);
    };

    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    const saveFavourites = (favorites: Birthday[]) => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };

    const toggleFavorite = (birthday: Birthday) => {
        if (isFavorite(birthday)) {
            const updatedFavorites = favorites.filter(
                fav => fav.text !== birthday.text || fav.year !== birthday.year
            );
            setFavorites(updatedFavorites);
            saveFavourites(updatedFavorites);
        } else {
            const updatedFavorites = [...favorites, birthday];
            setFavorites(updatedFavorites);
            saveFavourites(updatedFavorites);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box className="flex flex-col justify-center items-center my-10">
                <DatePicker
                    label="Select a date"
                    value={selectedDate}
                    onChange={(date) => handleDateChange(date)}
                />
                {loading && <CircularProgress />}
                <div className="grid gap-4 sm:grid-cols-2">

                    {selectedDate ? (
                        <Box className="flex-1 ml-4 mr-4">
                            <Typography variant="h6">Birthdays on {selectedDate.toDateString()}:</Typography>
                            <ul className="list-disc list-inside">
                                {birthdays.map((birthday, index) => (
                                    <li key={index} className="flex items-center justify-between">
                                        <span>{birthday.text} ({birthday.year})</span>
                                        <Button onClick={() => toggleFavorite(birthday)}>
                                            {isFavorite(birthday) ? <FaStar /> : <FaRegStar />}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </Box>
                    ) : "select a date to get birthdays"}
                    <Box className="flex-1 ml-4">
                        <Typography variant="h6">Favorite Birthdays:</Typography>
                        <ul className="list-disc list-inside">
                            {favorites.length > 0 ? favorites.map((favorite, index) => (
                                <li key={index} className="flex items-center justify-between">
                                    <span>{favorite.text} ({favorite.year})</span>
                                    <Button onClick={() => toggleFavorite(favorite)}>
                                        {isFavorite(favorite) ? <FaStar /> : <FaRegStar />}
                                    </Button>
                                </li>
                            )) : <p>No birthdays added</p>}
                        </ul>
                    </Box>
                </div>
            </Box>
        </LocalizationProvider>
    );
};

export default Calendar;
