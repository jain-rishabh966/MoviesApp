import { FormControl, Card, CardContent, Typography, Button, Select, MenuItem, TextField, InputLabel } from '@material-ui/core';
import React, { useState } from "react";

export default function Filters({ genres, artists, setHead, setMovies }) {
    function jsonToQueryString(json) {
        if (Object.keys(json).length === 0)
            return '';

        return '?' +
            Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }

    const [releaseDateStart, setReleaseDateStart] = useState('');
    const [releaseDateEnd, setReleaseDateEnd] = useState('');
    const [movieName, setMovieName] = useState('');
    const [genresFilter, setGenresFilter] = useState([]);
    const [artistsFilter, setArtistsFilter] = useState([]);
    const [previousFocusOnName, setPreviousFocusOnName] = useState(false);

    const filterStyle = { minWidth: 240, maxWidth: 240, justifyContent: 'center' };
    const spacingStyle = { margin: 8 };

    async function filterHandler() {
        try {
            const payload = {};

            if (genresFilter.length) payload['genre'] = genresFilter;
            if (artistsFilter.length) payload['artists'] = artistsFilter;
            if (releaseDateStart) payload['start_date'] = releaseDateStart;
            if (releaseDateEnd) payload['end_date'] = releaseDateEnd;
            if (movieName) payload['title'] = movieName;

            const rawData = await fetch(`/api/v1/movies${jsonToQueryString(payload)}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json;charset=UTF-8'
                }
            });

            const data = await rawData.json();

            if (rawData.status === 200) {
                setMovies(data.movies);
                setHead(data.movies.slice(0, 6));
            } else {
                alert(data.message || 'Something went wrong.. Please try again later...');
            }
        } catch (error) {
            console.error({ error: error.message });
            alert('Something went wrong.. Please try again later...');
        }
    }

    const [openGenre, setOpenGenre] = useState(false);
    const [openArtist, setOpenArtist] = useState(false);

    const handleChangeGenre = event => {
        const genre = event.target.value;
        if (genresFilter.includes(genre)) {
            setGenresFilter(genresFilter.filter(e => e !== genre))
        } else {
            setGenresFilter([...genresFilter, genre]);
        }
    };

    const handleCloseGenre = () => {
        setOpenGenre(false);
    };

    const handleOpenGenre = () => {
        setOpenGenre(true);
    };

    const handleChangeArtists = event => {
        const artist = event.target.value;
        if (artistsFilter.includes(artist)) {
            setArtistsFilter(artistsFilter.filter(e => e !== artist))
        } else {
            setArtistsFilter([...artistsFilter, artist]);
        }
    };

    const handleCloseArtists = () => {
        setOpenArtist(false);
    };

    const handleOpenArtists = () => {
        setOpenArtist(true);
    };

    return (
        <div>
            <Card className='filters'>
                <CardContent>
                    <Typography style={{ color: '#a6d4fa', ...spacingStyle }}>
                        FIND MOVIES BY:
                    </Typography>
                    <FormControl style={spacingStyle}>
                        <TextField
                            onFocus={() => setPreviousFocusOnName(true)}
                            onBlur={() => setPreviousFocusOnName(false)}
                            style={filterStyle}
                            autoFocus={previousFocusOnName}
                            label="Movie Name"
                            type="text"
                            name="movieName"
                            id="movieName"
                            value={movieName}
                            onChange={e => setMovieName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl style={spacingStyle}>
                        <InputLabel id="genres-label">Genres</InputLabel>
                        <Select
                            labelid="genres-label"
                            id="genres"
                            name="genres"
                            multiple
                            className={`formControl`}
                            open={openGenre}
                            onClose={handleCloseGenre}
                            onOpen={handleOpenGenre}
                            value={genresFilter}
                            onChange={handleChangeGenre}
                        >
                            {
                                genres.map(e => {
                                    return (
                                        <MenuItem value={e.genre} key={e.id}>
                                            <input type="checkbox" name="genre" value={e.genre} defaultChecked={genresFilter.includes(e.genre)} />{e.genre}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                    <FormControl style={spacingStyle}>
                        <InputLabel id="artists-label">Artists</InputLabel>
                        <Select
                            multiple
                            labelid="artists-label"
                            name="artists"
                            id="artists"
                            className={`formControl`}
                            open={openArtist}
                            onClose={handleCloseArtists}
                            onOpen={handleOpenArtists}
                            value={artistsFilter}
                            onChange={handleChangeArtists}
                        >
                            {
                                artists.map(e => {
                                    return (
                                        <MenuItem value={e.first_name + ' ' + e.last_name} key={e.id}>
                                            <input type="checkbox" name="artist" value={e.first_name + ' ' + e.last_name} defaultChecked={artistsFilter.includes(e.first_name + ' ' + e.last_name)} />{e.first_name + ' ' + e.last_name}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                    <FormControl style={spacingStyle}>
                        <TextField
                            style={filterStyle}
                            label="Release Date Start"
                            type="date"
                            name="releaseDateStart"
                            value={releaseDateStart}
                            onChange={e => setReleaseDateStart(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl style={spacingStyle}>
                        <TextField
                            style={filterStyle}
                            label="Release Date End"
                            type="date"
                            name="releaseDateEnd"
                            value={releaseDateEnd}
                            onChange={e => setReleaseDateEnd(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <Button
                        color="primary"
                        variant="contained"
                        style={{ ...filterStyle, ...spacingStyle }}
                        onClick={_ => filterHandler()}
                    >
                        APPLY
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
