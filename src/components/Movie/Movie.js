import React, { Component } from "react";
import { API_URL, API_KEY, IMAGE_BASE_URL, BACKDROP_SIZE } from "../../config";
import Navigation from "../elements/Navigation/Navigation";
import MovieInfo from "../elements/MovieInfo/MovieInfo";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import Actor from "../elements/Actor/Actor";
import Spinner from "../elements/Spinner/Spinner";
import "./Movie.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

class Movie extends Component {
  state = {
    movie: null,
    actors: null,
    trailer: [],
    directors: [],
    loading: false,
    reviews: [],
  };

  componentDidMount() {
    // if (localStorage.getItem(`${this.props.match.params.movieId}`)) {
    //   const state = JSON.parse(
    //     localStorage.getItem(`${this.props.match.params.movieId}`)
    //   );
    //   this.setState({ ...state });
    // } else {
    this.setState({ loading: true });
    // First fetch the movie...
    const endpoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=en-US`;
    this.fetchItems(endpoint);
    // }
  }

  fetchItems = (endpoint) => {
    fetch(endpoint)
      .then((result) => result.json())
      .then((result) => {
        //  console.log
        if (result.status_code) {
          this.setState({ loading: false });
        } else {
          this.setState({ movie: result }, () => {
            // ... then fetch actors in the setState callback function
            const endpointCreadit = `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}`;
            fetch(endpointCreadit)
              .then((result) => result.json())
              .then((result) => {
                const directors = result.crew.filter(
                  (member) => member.job === "Director"
                );

                this.setState(
                  {
                    actors: result.cast,
                    directors,
                    loading: false,
                  },
                  () => {
                    localStorage.setItem(
                      `${this.props.match.params.movieId}`,
                      JSON.stringify(this.state)
                    );
                  }
                );
              });

            const endpointVideos = `${API_URL}movie/${this.props.match.params.movieId}/videos?api_key=${API_KEY}`;
            fetch(endpointVideos)
              .then((result) => result.json())
              .then((result) => {
                const videos = result.results;
                this.setState({
                  loading: false,
                  trailer: videos,
                });
              });

            const endpointReviews = `${API_URL}movie/${this.props.match.params.movieId}/reviews?api_key=${API_KEY}`;
            fetch(endpointReviews)
              .then((result) => result.json())
              .then((result) => {
                const reviews = result.results;
                this.setState({
                  loading: false,
                  reviews: reviews,
                });
              });
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  render() {
    console.log(this.state);

    return (
      <div className="rmdb-movie">
        {this.state.movie ? (
          <div>
            <Navigation movie={this.props.location.movieName} />
            <MovieInfo
              movie={this.state.movie}
              directors={this.state.directors}
            />
            <MovieInfoBar
              time={this.state.movie.runtime}
              budget={this.state.movie.budget}
              revenue={this.state.movie.revenue}
            />
          </div>
        ) : null}

        {this.state.trailer.length > 0 && (
          <div className="movie-videos">
            <h2>Trailer</h2>

            <Carousel infiniteLoop>
              {this.state.trailer
                .slice(0, 5)
                .map((video, index) =>
                  video.site === "YouTube" ? (
                    <iframe
                      key={index}
                      width="1280px"
                      height="600px"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : null
                )}
            </Carousel>
          </div>
        )}

        {this.state.reviews.length > 0 && (
          <div className="movie-reviews">
            <h2>Đánh giá</h2>

            <Carousel infiniteLoop>
              {this.state.reviews.map((item, index) => (
                <div key={index} className="movie-review">
                  <img
                    src={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${item.author_details.avatar_path}`}
                    alt={item.id}
                    className="movie-review-avatar"
                  />
                  <h3>{item.author}</h3>
                  <p>{item.content}</p>
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {this.state.actors ? (
          <div className="rmdb-movie-grid">
            <FourColGrid header={"Diễn viên"}>
              {this.state.actors.map((element, i) => {
                return <Actor key={i} actor={element} />;
              })}
            </FourColGrid>
          </div>
        ) : null}

        {/* {!this.state.actors && !this.state.loading ? (
          <h1>Không có phim nào!</h1>
        ) : null} */}

        {this.state.loading ? <Spinner /> : null}
      </div>
    );
  }
}

export default Movie;
