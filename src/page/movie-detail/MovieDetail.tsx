import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ReactComponent as BackIcon } from "../../assets/arrow_back_FILL0_wght300_GRAD200_opsz24.svg";
import { ReactComponent as HomeIcon } from "../../assets/home_FILL0_wght300_GRAD200_opsz24.svg";
import IconButton from "../../utils/uiComponents/icon-button/IconButton";
import EmptyPage from "../../utils/uiComponents/empty-page/EmptyPage";
import { Credits, MovieDetails } from "../../types/types";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieDetail, setMovieDetail] = useState<MovieDetails>();
  const [credits, setCredits] = useState<Credits>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const castNames = credits?.cast
    ?.filter((cast) => cast.known_for_department === "Acting")
    .map((cast) => cast.name)
    .join(", ");

  const directorName = credits?.crew?.find((crew) => crew.job === "Director")?.name;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
    },
  };

  const fetchData = async (movieId: number) => {
    setLoading(true);
    Promise.allSettled([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options)
        .then((response) => response.json())
        .then((response) => setMovieDetail(response))
        .catch((err: Error) => setError(err.message)),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, options)
        .then((response) => response.json())
        .then((response) => setCredits(response))
        .catch((err: Error) => setError(err.message)),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) {
      try {
        const movieId = Number(window.atob(id));
        if (isNaN(movieId)) {
          setError("Invalid Id");
          return;
        }
        fetchData(movieId);
      } catch {
        setError("Invalid Id");
      }
    }
  }, [id]);

  const handleBackHome = () => {
    navigate("/");
  };

  if (loading) {
    return <EmptyPage message="Loading..." />;
  }

  if (error) {
    return <EmptyPage message={error || "Error"} />;
  }

  if (movieDetail === undefined) {
    return <EmptyPage message="No Detail" />;
  }

  return (
    <>
      <header className="flex w-full gap-4 p-4 border-b-2 items-center">
        <IconButton onClick={handleBackHome} icon={BackIcon} />
        <p>Movie Details</p>
        <div className="ml-auto">
          <IconButton onClick={handleBackHome} icon={HomeIcon} />
        </div>
      </header>
      <main className="max-w-[1440px] mx-auto">
        <div className="flex py-8 px-4 gap-2 flex-wrap">
          <div className="px-2">
            <img
              className="w-40 h-48 object-cover"
              src={`https://image.tmdb.org/t/p/original${movieDetail.poster_path}`}
              alt="Movie poster"
            />
          </div>
          <div className="flex-1 px-2">
            <div className="flex gap-2">
              <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                {movieDetail.title}
              </p>
              <span className="text-gray-700">({movieDetail.vote_average})</span>
            </div>{" "}
            <div className="text-gray-700 my-2">
              <p>
                {movieDetail.release_date.split("-")[0]} | {Math.floor(movieDetail.runtime / 60)}h{" "}
                {movieDetail.runtime % 60}m | {directorName?.length ? directorName : ""}
              </p>
              {(castNames?.length ?? 0) > 0 && (
                <p className="w-64 overflow-hidden text-ellipsis whitespace-nowrap">
                  Cast: {castNames}
                </p>
              )}
            </div>
            <p className="text-gray-700">Description: {movieDetail.overview}</p>
          </div>
        </div>
      </main>
    </>
  );
}
