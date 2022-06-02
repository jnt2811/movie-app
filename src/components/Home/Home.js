import React, { Component } from "react";
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE } from "../../config";
import SearchBar from "../elements/SearchBar/SearchBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import MovieThumb from "../elements/MovieThumb/MovieThumb";
import LoadMoreBtn from "../elements/LoadMoreBtn/LoadMoreBtn";
import Spinner from "../elements/Spinner/Spinner";
import "./Home.css";
import Helmet from "react-helmet";

const listType = {
  popular: "popular",
  now_playing: "now_playing",
  top_rated: "top_rated",
  upcoming: "upcoming",
};

class Home extends Component {
  state = {
    movies: [],
    heroImage: null,
    loading: false,
    currentPage: 0,
    totalPages: 0,
    searchTerm: "",
    type: listType.popular,
  };

  componentDidMount() {
    if (localStorage.getItem("HomeState")) {
      const state = JSON.parse(localStorage.getItem("HomeState"));
      this.setState({ ...state });
    } else {
      this.setState({ loading: true });
      const endpoint = `${API_URL}movie/${this.state.type}?api_key=${API_KEY}&language=en-US&page=1`;
      this.fetchItems(endpoint);
    }
  }

  searchItems = (searchTerm) => {
    let endpoint = "";
    this.setState({
      movies: [],
      loading: true,
      searchTerm,
    });

    if (searchTerm === "") {
      endpoint = `${API_URL}movie/${this.state.type}?api_key=${API_KEY}&language=en-US&page=1`;
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
    }
    this.fetchItems(endpoint);
  };

  loadMoreItems = () => {
    let endpoint = "";
    this.setState({ loading: true });

    if (this.state.searchTerm === "") {
      endpoint = `${API_URL}movie/${
        this.state.type
      }?api_key=${API_KEY}&language=en-US&page=${this.state.currentPage + 1}`;
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${
        this.state.searchTerm
      }&page=${this.state.currentPage + 1}`;
    }
    this.fetchItems(endpoint);
  };

  fetchItems = (endpoint) => {
    fetch(endpoint)
      .then((result) => result.json())
      .then((result) => {
        this.setState(
          {
            movies: [...this.state.movies, ...result.results],
            heroImage: this.state.heroImage || result.results[0],
            loading: false,
            currentPage: result.page,
            totalPages: result.total_pages,
          },
          () => {
            if (this.state.searchTerm === "") {
              localStorage.setItem("HomeState", JSON.stringify(this.state));
            }
          }
        );
      })
      .catch((error) => console.error("Error:", error));
  };

  handleClickType = (type) => {
    console.log(type);
    this.setState({
      movies: [],
      loading: true,
      type,
    });
    const endpoint = `${API_URL}movie/${type}?api_key=${API_KEY}&language=en-US&page=1`;
    console.log(endpoint);
    this.fetchItems(endpoint);
  };

  renderTypeName = (type) => {
    switch (type) {
      case listType.popular:
        return "Phim ăn khách";
      case listType.latest:
        return "Phim mới";
      case listType.now_playing:
        return "Phim đang chiếu";
      case listType.top_rated:
        return "Phim hay nhất";
      default:
        return "Phim sắp chiếu";
    }
  };

  render() {
    console.log(this.state);

    return (
      <div className="rmdb-home">
        <Helmet>
          <title>About - yoursite.com</title>
          <meta
            name="description"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>

        <SearchBar callback={this.searchItems} />

        {!this.state.searchTerm && (
          <div className="rmdb-home-filter">
            {Object.values(listType).map((type) => (
              <button
                key={type}
                className={type === this.state.type ? "active" : ""}
                onClick={() => this.handleClickType(type)}
              >
                {this.renderTypeName(type)}
              </button>
            ))}
          </div>
        )}

        <div className="rmdb-home-grid">
          <FourColGrid
            header={
              this.state.searchTerm
                ? "Kết quả tìm kiếm"
                : this.renderTypeName(this.state.type)
            }
            loading={this.state.loading}
          >
            {this.state.movies.map((element, i) => {
              return (
                <div key={i}>
                  <MovieThumb
                    clickable={true}
                    image={
                      element.poster_path
                        ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}`
                        : "./images/no_image.jpg"
                    }
                    movieId={element.id}
                    movieName={element.original_title}
                    movieVote={element.vote_average}
                  />
                </div>
              );
            })}
          </FourColGrid>

          {this.state.loading ? <Spinner /> : null}

          {this.state.currentPage <= this.state.totalPages &&
          !this.state.loading ? (
            <LoadMoreBtn text="Tải thêm" onClick={this.loadMoreItems} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Home;
