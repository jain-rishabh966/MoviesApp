import { Typography, GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import React, { useState, useEffect } from 'react';
import YouTube from "react-youtube";
import { Link } from 'react-router-dom';

import './Details.css'

export default function (props) {
    const urlPath = props.location.pathname.split('/');
    const [movie, setMovie] = useState({
        poster_url: '', title: '', genres: [], duration: '', release_date: '',
        rating: '', wiki_url: '#', storyline: '', trailer_url: '', artists: []
    });

    useEffect(() => {
        async function getMovies() {
            try {
                const rawData = await fetch(`/api/v1/movies/${urlPath[urlPath.length - 1]}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json;charset=UTF-8'
                    }
                });

                const data = await rawData.json();

                if (rawData.status === 200) {
                    setMovie(data);
                } else {
                    alert(data.message || 'Something went wrong.. Please try again later...');
                }
            } catch (error) {
                console.error({ error: error.message });
                alert('Something went wrong.. Please try again later...');
            }
        }

        getMovies();
    }, []);

    const { poster_url, title, genres, duration, release_date, rating, wiki_url, storyline, trailer_url, artists } = movie;

    const [, setStars] = useState(0);

    function handleClickStars(userRating) {
        for (let e of document.getElementsByClassName('star')) {
            e.style.fill = 'currentColor';
        }

        let elems;

        switch (userRating) {
            case 5:
                elems = document.querySelectorAll('.five');
                break;
            case 4:
                elems = document.querySelectorAll('.four');
                break;
            case 3:
                elems = document.querySelectorAll('.three');
                break;
            case 2:
                elems = document.querySelectorAll('.two');
                break;
            case 1:
                elems = document.querySelectorAll('.one');
                break;
            default:
                break;
        }

        for (let e of elems) {
            e.style.fill = 'yellow';
        }

        setStars(userRating);
    }

    const opts = {
        width: '85%',
        height: '500',
        playerVars: {
            autoplay: 1,
        },
    };

    function _onReady(event) {
        event.target.pauseVideo();
    }

    let urlId = trailer_url.split('?v=');
    urlId = urlId[1];

    return (
        <div>
            <Typography className="backBtn" style={{ margin: '8px 0 0 24px', height: 24 }}>
                <Link to={`/`}>{'<'} Back To Home</Link>
            </Typography>
            <div className="split">
                <div className="poster left" align="center">
                    <img src={poster_url} alt="Movie Name" width="85%" />
                </div>
                <div className="description middle">
                    <Typography variant="h5" component="h2">
                        {title}
                    </Typography>
                    <Typography>
                        <b>Genres:&nbsp;</b>{genres.join(', ')}
                    </Typography>
                    <Typography>
                        <b>Duration:&nbsp;</b>{duration} min
                    </Typography>
                    <Typography>
                        <b>Release Date:&nbsp;</b>{new Date(release_date).toDateString()}
                    </Typography>
                    <Typography>
                        <b>Rating:&nbsp;</b>{rating}
                    </Typography>
                    <Typography className="plot" style={{ marginTop: 24 }}>
                        <b>Plot:&nbsp;</b><a href={wiki_url}>(Wiki Link)</a>&nbsp;{storyline}
                    </Typography>
                    <Typography style={{ marginTop: 16 }}>
                        <b>Trailer:</b>
                    </Typography >
                    <YouTube videoId={urlId} opts={opts} onReady={_onReady} />
                </div>
                <div className="rating right">
                    <Typography>
                        <b>Rate this movie:</b>
                    </Typography>
                    <StarBorderIcon className="one two three four five star" onClick={() => handleClickStars(1)} />
                    <StarBorderIcon className="two three four five star" onClick={() => handleClickStars(2)} />
                    <StarBorderIcon className="three four five star" onClick={() => handleClickStars(3)} />
                    <StarBorderIcon className="four five star" onClick={() => handleClickStars(4)} />
                    <StarBorderIcon className="five star" onClick={() => handleClickStars(5)} />
                    <Typography style={{ marginTop: 16, marginBottom: 16 }}>
                        <b>Artists:</b>
                    </Typography>
                    <GridList cols={2}>
                        {
                            artists.map(e => {
                                return (
                                    <GridListTile key={e.id}>
                                        <img src={e.profile_url} alt={e.first_name + ' ' + e.last_name} />
                                        <GridListTileBar
                                            title={e.first_name + ' ' + e.last_name}
                                        />
                                    </GridListTile>
                                )
                            })
                        }
                    </GridList>
                </div>
            </div>
        </div>
    );
};
