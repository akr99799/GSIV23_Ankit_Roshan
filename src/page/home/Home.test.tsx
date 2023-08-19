import { fireEvent, render, screen } from "@testing-library/react";
import App from "../../App";
import userEvent from "@testing-library/user-event";

test("initial loading", () => {
  render(<App />);
  const loadingText = screen.getByText(/loading.../i);
  expect(loadingText).toBeInTheDocument();
});

test("check for search bar", () => {
  render(<App />);
  const searchBarInput = screen.getByPlaceholderText(/Search/i);
  expect(searchBarInput).toBeInTheDocument();
});

test("typing in search bar", () => {
  render(<App />);
  const searchBarInput = screen.getByLabelText(/search-input/i) as HTMLInputElement;
  fireEvent.change(searchBarInput, { target: { value: "23" } });
  expect(searchBarInput.value).toBe("23");
});

test("navigate to movie detail page", async () => {
  render(<App />);
  await screen.findAllByAltText(/movie poster/i);
  const moviePoster = screen.getAllByAltText(/movie poster/i)[0];
  await userEvent.click(moviePoster);
  await screen.findByText(/movie details/i);
  expect(screen.getByText(/movie details/i)).toHaveTextContent(/movie details/i);
});
