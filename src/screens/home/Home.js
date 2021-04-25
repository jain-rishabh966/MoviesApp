import React, { useEffect, useState } from "react";
import { GridListTile, GridListTileBar } from '@material-ui/core';
import { Link } from 'react-router-dom';

import Movies from "./movies/Movies";
import Filters from './filters/Filters';
import './Home.css';

export default function () {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [artists, setArtists] = useState([]);
    const [head, setHead] = useState([]);

    function jsonToQueryString(json) {
        if (Object.keys(json).length === 0)
            return '';

        return '?' +
            Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }

    useEffect(() => {
        async function getMovie() {
            try {
                const payload = {};
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

        async function getGenres() {
            try {
                const rawData = await fetch(`/api/v1/genres`, {
                    method: 'GET',
                    headers: { Accept: 'application/json;charset=UTF-8' }
                });

                const data = await rawData.json();

                if (rawData.status === 200) {
                    setGenres(data.genres);
                } else {
                    alert(data.message || 'Something went wrong.. Please try again later...');
                }
            } catch (error) {
                console.error({ error: error.message });
                alert('Something went wrong.. Please try again later...');
            }
        }

        async function getArtists() {
            try {
                const rawData = await fetch(`/api/v1/artists`, {
                    method: 'GET',
                    headers: { Accept: 'application/json;charset=UTF-8' }
                });

                const data = await rawData.json();

                if (rawData.status === 200) {
                    setArtists(data.artists);
                } else {
                    alert(data.message || 'Something went wrong.. Please try again later...');
                }
            } catch (error) {
                console.error({ error: error.message });
                alert('Something went wrong.. Please try again later...');
            }
        }

        getMovie();
        getArtists();
        getGenres();
    }, []);

    return (
        <div>
            <div className="home">
                Upcoming Movies
            </div>
            <div className="root">
                {
                    head.map(movie => (
                        <Link to={`/movie/${movie.id}`} key={movie.id} style={{ height: 350, width: 235 }}>
                            <GridListTile className="movie-card" key={movie.poster_url}>
                                <img src={movie.poster_url} alt={movie.title} />
                                <GridListTileBar
                                    title={movie.title}
                                />
                            </GridListTile>
                        </Link>
                    ))
                }
            </div>
            <br />
            <div className="splitContainer">
                <div className="left">
                    <Movies movies={movies} />
                </div>

                <div className="right">
                    <Filters genres={genres} artists={artists} setHead={setHead} setMovies={setMovies}  />
                </div>
            </div>
        </div>
    );
};
