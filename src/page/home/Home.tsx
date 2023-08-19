import { Fragment, useEffect, useRef, useState } from "react";

import SearchBar from "../../utils/uiComponents/search-bar/SearchBar";
import { MovieList } from "../../types/types";
import IconButton from "../../utils/uiComponents/icon-button/IconButton";
import { ReactComponent as HomeIcon } from "../../assets/home_FILL0_wght300_GRAD200_opsz24.svg";
import { useNavigate } from "react-router-dom";
import Card from "../../utils/uiComponents/card/Card";
import EmptyPage from "../../utils/uiComponents/empty-page/EmptyPage";
import { debounce } from "../../utils/utils";
import { InputChangeEvent } from "../../types/eventTypes";

export default function Home() {
  const navigate = useNavigate();
  const [movieListData, setMovieListData] = useState<MovieList>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const movieList = movieListData?.results;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
    },
  };

  const fetchData = async (append: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${append ? page + 1 : 1}`,
        options
      ).then((response) => response.json());

      if (append) {
        setMovieListData((prevData) => ({
          ...response,
          results: [...(prevData?.results ?? []), ...response.results],
        }));
        setPage((prev) => prev + 1);
      } else {
        setMovieListData(response);
        setPage(1);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async (query: string) => {
    if (searchInputRef.current?.value.length === 0) {
      return;
    }
    setSearchLoading(true);
    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=en-US&page=1`,
      options
    )
      .then((response) => response.json())
      .then((response) => setMovieListData(response))
      .catch((err: Error) => setError(err.message))
      .finally(() => setSearchLoading(false));
  };

  const debounceFetchSearchResults = debounce(fetchSearchResults);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleFetchDataAtBottom);
    return () => window.removeEventListener("scroll", handleFetchDataAtBottom);
  }, [loading]);

  const handleFetchDataAtBottom = () => {
    if (
      window.innerHeight + Math.round(document.documentElement.scrollTop) + 1 !==
        document.documentElement.offsetHeight ||
      loading
    ) {
      return;
    }
    fetchData(true);
  };

  const handleBackHome = () => {
    if (searchInputRef.current) searchInputRef.current.value = "";
    fetchData();
  };
  const navigateToDetails = (movieId: number) => () =>
    navigate(`/details/${window.btoa(movieId.toString())}`);

  const handleSearch = (event: InputChangeEvent) => {
    const input = event.target.value;
    if (input.length) {
      debounceFetchSearchResults(input);
    } else {
      fetchData();
    }
  };

  if (error) {
    return <EmptyPage message={error} />;
  }

  return (
    <>
      <header className="w-full py-2 border-b-2 shadow-md">
        <div className="flex justify-between gap-4 items-center max-w-[1440px] mx-auto px-8">
          <SearchBar
            inputProps={{
              ref: searchInputRef,
              onChange: handleSearch,
              disabled: loading,
            }}
          />
          <IconButton icon={HomeIcon} onClick={handleBackHome} />
        </div>
      </header>
      <main>
        {loading || searchLoading ? (
          <EmptyPage message="Loading..." />
        ) : (
          <>
            {movieList === undefined || movieList.length === 0 ? (
              <EmptyPage message="No results" />
            ) : (
              <div className="max-w-[1440px] gap-6 mx-auto px-4 py-8 grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {movieList.map((movie) => (
                  <Fragment key={movie.id}>
                    <Card
                      title={
                        <div className="flex justify-between">
                          <p className="font-bold line-clamp-1">{movie.title}</p>{" "}
                          <span className="text-gray-700">({movie.vote_average})</span>
                        </div>
                      }
                      imgUrl={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                      imgProps={{ alt: "Movie Poster" }}
                      description={movie.overview}
                      button
                      onClick={navigateToDetails(movie.id)}
                    />
                  </Fragment>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
