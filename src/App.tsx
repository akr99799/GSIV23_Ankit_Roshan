import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/home/Home";
import MovieDetail from "./page/movie-detail/MovieDetail";
import EmptyPage from "./utils/uiComponents/empty-page/EmptyPage";

function App() {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="details/:id" element={<MovieDetail />} />
          <Route path="*" element={<EmptyPage message="Page not found" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
