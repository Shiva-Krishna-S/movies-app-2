import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import MoviesSlider from '../MoviesSlider'
import Footer from '../Footer'
import TopRatedMovies from '../TopRatedMovies'
import TrendingMovies from '../TrendingMovies'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    originalsMoviesList: [],
    originalsMoviesApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getOriginalMovies()
  }

  getOriginalMovies = async () => {
    try {
      this.setState({originalsMoviesApiStatus: apiStatusConstants.inProgress})
      const jwtToken = Cookies.get('jwt_token')
      const apiUrl = 'https://apis.ccbp.in/movies-app/originals'
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedOriginalsData = fetchedData.results.map(eachMovie => ({
          backdropPath: eachMovie.backdrop_path,
          id: eachMovie.id,
          overview: eachMovie.overview,
          posterPath: eachMovie.poster_path,
          name: eachMovie.title,
        }))

        this.setState({
          originalsMoviesList: updatedOriginalsData,
          originalsMoviesApiStatus: apiStatusConstants.success,
        })
      } else if (response.status === 404 || response.status === 401) {
        this.setState({originalsMoviesApiStatus: apiStatusConstants.failure})
      } else {
        this.setState({originalsMoviesApiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({originalsMoviesApiStatus: apiStatusConstants.failure})
    }
  }

  renderMoviesCategoryLoadingView = () => (
    <div className="movie-category-failure-view" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={20} width={20} />
    </div>
  )

  renderOriginalsFailureView = () => (
    <div className="movie-category-failure-view">
      <img
        src="https://res.cloudinary.com/df8n5yti7/image/upload/v1671379818/alert-trianglefailure_view_bdhscp.png"
        alt="failure view"
        className="movie-category-failure-image"
      />
      <p className="movie-category-failure-message">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        onClick={this.onOriginalsTryAgain}
        className="failure-retry-button"
      >
        Try Again
      </button>
    </div>
  )

  renderOriginalsListView = () => {
    const {originalsMoviesList} = this.state

    return <MoviesSlider moviesList={originalsMoviesList} />
  }

  renderOriginalMovies = () => {
    const {originalsMoviesApiStatus} = this.state

    switch (originalsMoviesApiStatus) {
      case apiStatusConstants.success:
        return this.renderOriginalsListView()
      case apiStatusConstants.failure:
        return this.renderOriginalsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderMoviesCategoryLoadingView()
      default:
        return null
    }
  }

  renderRandomMovieLoadingView = () => (
    <div className="random-movie-failure-view" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  onOriginalsTryAgain = () => {
    this.getOriginalMovies()
  }

  renderRandomFailureView = () => (
    <div className="random-movie-failure-view">
      <img
        src="https://res.cloudinary.com/df8n5yti7/image/upload/v1671379818/alert-trianglefailure_view_bdhscp.png"
        alt="failure view"
        className="random-movie-failure-image"
      />
      <p className="random-movie-failure-message">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        onClick={this.onOriginalsTryAgain}
        className="failure-retry-button"
      >
        Try Again
      </button>
    </div>
  )

  renderRandomMovie = () => {
    const {originalsMoviesApiStatus, originalsMoviesList} = this.state

    const randomMovie =
      originalsMoviesList[
        Math.floor(Math.random() * originalsMoviesList.length)
      ]
    const {name, overview, backdropPath} = randomMovie

    const pageContentsLoading = originalsMoviesApiStatus === 'IN_PROGRESS'

    return (
      <div
        className="home-page-top-section"
        style={{
          backgroundImage: `url(${backdropPath})`,
        }}
      >
        <Header pageContentsLoading={pageContentsLoading} />
        <div className="random-movie-container">
          <h1 className="random-movie-title">{name}</h1>
          <p className="random-movie-desc">{overview}</p>
          <button type="button" className="random-movie-play-button">
            Play
          </button>
        </div>
        <div className="random-movie-shade-container">{}</div>
      </div>
    )
  }

  renderRandomMovieContainer = () => {
    const {originalsMoviesApiStatus} = this.state

    switch (originalsMoviesApiStatus) {
      case apiStatusConstants.success:
        return this.renderRandomMovie()
      case apiStatusConstants.failure:
        return this.renderRandomFailureView()
      case apiStatusConstants.inProgress:
        return this.renderRandomMovieLoadingView()
      default:
        return null
    }
  }

  render() {
    const {originalsMoviesApiStatus} = this.state

    const pageContentsLoading = originalsMoviesApiStatus === 'IN_PROGRESS'

    return (
      <div className="home-background-container">
        {originalsMoviesApiStatus !== 'SUCCESS' && (
          <Header pageContentsLoading={pageContentsLoading} />
        )}
        {this.renderRandomMovieContainer()}
        <h1 className="movies-category-title">Trending Now</h1>
        <TrendingMovies />
        <h1 className="movies-category-title">Popular</h1>
        <TopRatedMovies />
        <h1 className="movies-category-title">Originals</h1>
        {this.renderOriginalMovies()}
        <Footer />
      </div>
    )
  }
}

export default Home
