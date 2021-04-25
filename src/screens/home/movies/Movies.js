import React from "react";
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import { Link } from 'react-router-dom';


export default function Movies({ movies }) {
    return (
        <div>
            <GridList cols={4.5} >
                {
                    movies.map(movie => (
                        <Link to={`/movie/${movie.id}`} key={movie.id} style={{ height: 350 }}>
                            <GridListTile className="movie-card" key={movie.poster_url}>
                                <img src={movie.poster_url} alt={movie.title} />
                                <GridListTileBar
                                    title={movie.title}
                                />
                            </GridListTile>
                        </Link>
                    ))
                }
            </GridList>
        </div>
    )
}
