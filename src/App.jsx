import { useEffect, useState } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import "./App.css";

function App() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "2822664ab2c795a616ad0cd6cd1eea9a";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";
  const URL_IMAGE = "https://image.tmdb.org/t/p/original";

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);

  const getMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
        language: "es-ES",
      },
    });
    console.log(results);
    setMovies(results);
    setMovie(results[0]);

    if (results.length) {
      await getTrailer(results[0].id);
    }
  };

  const getTrailer = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        language: "es-ES",
        append_to_response: "videos",
      },
    });
    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (video) => video.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    setMovie(data);
  };

  const handleSelectMovie = async (movie) => {
    getTrailer(movie.id);
    setMovie(movie);
    window.scrollTo(0, 90);
  };

  const searchMovie = (e) => {
    e.preventDefault();
    getMovies(searchKey);
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div className="contenedor">
      <h1 className="text-center mb-5 text-white font-bold">
        Peliculas y Series
      </h1>
      <form className="input-group mb-3 container" onSubmit={searchMovie}>
        <input
          type="search"
          placeholder="Buscar..."
          onChange={(e) => setSearchKey(e.target.value)}
          className="form-control form-control-lg bg-transparent text-white"
        />
        <button
          className="btn btn-outline-light"
          type="button"
          id="button-addon2"
        >
          Buscar
        </button>
      </form>
      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Cerrar
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Ver Trailer
                      </button>
                    ) : (
                      <p className="text-white">No encontramos el trailer de la pelicula 😢</p>
                    )}
                    <h1 className="titleBack">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>
      <div>
        <div className="contenedorCard">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="contenedorPeliculas"
              onClick={() => handleSelectMovie(movie)}
            >
              <img
                src={`${URL_IMAGE + movie.poster_path}`}
                alt=""
                height={260}
                width="60%"
                className="contenedorImage"
              />
              <h4 className="contenedorTitle">{movie.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
