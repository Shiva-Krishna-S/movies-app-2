import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import MoviesSlider from '../MoviesSlider'
import Footer from '../Footer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    trendingMoviesList: [],
    originalsMoviesList: [],
    topRatedMoviesList: [],
    trendingMoviesApiStatus: apiStatusConstants.initial,
    topRatedMoviesApiStatus: apiStatusConstants.initial,
    originalsMoviesApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrendingMovies()
    this.getOriginalMovies()
    this.getTopRatedMovies()
  }

  getTopRatedMovies = async () => {
    try {
      this.setState({topRatedMoviesApiStatus: apiStatusConstants.inProgress})
      const jwtToken = Cookies.get('jwt_token')
      const apiUrl = 'https://apis.ccbp.in/movies-app/top-rated-movies'
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedTopRatedData = fetchedData.results.map(eachMovie => ({
          backdropPath: eachMovie.backdrop_path,
          id: eachMovie.id,
          overview: eachMovie.overview,
          posterPath: eachMovie.poster_path,
          name: eachMovie.title,
        }))

        this.setState({
          topRatedMoviesList: updatedTopRatedData,
          topRatedMoviesApiStatus: apiStatusConstants.success,
        })
      } else if (response.status === 404 || response.status === 401) {
        this.setState({topRatedMoviesApiStatus: apiStatusConstants.failure})
      } else {
        this.setState({topRatedMoviesApiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({topRatedMoviesApiStatus: apiStatusConstants.failure})
    }
  }

  renderMoviesCategoryLoadingView = () => (
    <div className="movie-category-failure-view" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={20} width={20} />
    </div>
  )

  onTopRatedMoviesTryAgain = () => {
    this.getTopRatedMovies()
  }

  renderTopRatedMoviesFailureView = () => (
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
        onClick={this.onTopRatedMoviesTryAgain}
        className="failure-retry-button"
      >
        Try Again
      </button>
    </div>
  )

  renderTopRatedMoviesListView = () => {
    const {topRatedMoviesList} = this.state

    return <MoviesSlider moviesList={topRatedMoviesList} />
  }

  renderTopRatedMovies = () => {
    const {topRatedMoviesApiStatus} = this.state

    switch (topRatedMoviesApiStatus) {
      case apiStatusConstants.success:
        return this.renderTopRatedMoviesListView()
      case apiStatusConstants.failure:
        return this.renderTopRatedMoviesFailureView()
      case apiStatusConstants.inProgress:
        return this.renderMoviesCategoryLoadingView()
      default:
        return null
    }
  }

  getTrendingMovies = async () => {
    try {
      this.setState({trendingMoviesApiStatus: apiStatusConstants.inProgress})
      const jwtToken = Cookies.get('jwt_token')
      const apiUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedTrendingData = fetchedData.results.map(eachMovie => ({
          backdropPath: eachMovie.backdrop_path,
          id: eachMovie.id,
          overview: eachMovie.overview,
          posterPath: eachMovie.poster_path,
          name: eachMovie.title,
        }))

        this.setState({
          trendingMoviesList: updatedTrendingData,
          trendingMoviesApiStatus: apiStatusConstants.success,
        })
      } else if (response.status === 404 || response.status === 401) {
        this.setState({trendingMoviesApiStatus: apiStatusConstants.failure})
      } else {
        this.setState({trendingMoviesApiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({trendingMoviesApiStatus: apiStatusConstants.failure})
    }
  }

  onTrendingTryAgain = () => {
    this.getTrendingMovies()
  }

  renderTrendingFailureView = () => (
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
        onClick={this.onTrendingTryAgain}
        className="failure-retry-button"
      >
        Try Again
      </button>
    </div>
  )

  renderTrendingMoviesListView = () => {
    const {trendingMoviesList} = this.state

    return <MoviesSlider moviesList={trendingMoviesList} />
  }

  renderTrendingMovies = () => {
    const {trendingMoviesApiStatus} = this.state

    switch (trendingMoviesApiStatus) {
      case apiStatusConstants.success:
        return this.renderTrendingMoviesListView()
      case apiStatusConstants.failure:
        return this.renderTrendingFailureView()
      case apiStatusConstants.inProgress:
        return this.renderMoviesCategoryLoadingView()
      default:
        return null
    }
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

  onOriginalsTryAgain = () => {
    this.getOriginalMovies()
  }

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

  onRandomMovieFailureTryAgain = () => {
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
        onClick={this.onRandomMovieFailureTryAgain}
        className="failure-retry-button"
      >
        Try Again
      </button>
    </div>
  )

  renderRandomMovie = () => {
    const {
      trendingMoviesApiStatus,
      originalsMoviesApiStatus,
      originalsMoviesList,
    } = this.state

    const randomMovie =
      originalsMoviesList[
        Math.floor(Math.random() * originalsMoviesList.length)
      ]
    const {name, overview, backdropPath} = randomMovie

    const pageContentsLoading =
      trendingMoviesApiStatus === 'IN_PROGRESS' ||
      originalsMoviesApiStatus === 'IN_PROGRESS'

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
    const {trendingMoviesApiStatus, originalsMoviesApiStatus} = this.state
    const pageContentsLoading =
      trendingMoviesApiStatus === 'IN_PROGRESS' ||
      originalsMoviesApiStatus === 'IN_PROGRESS'

    return (
      <div className="home-background-container">
        {originalsMoviesApiStatus !== 'SUCCESS' && (
          <Header pageContentsLoading={pageContentsLoading} />
        )}
        {this.renderRandomMovieContainer()}
        <h1 className="movies-category-title">Trending Now</h1>
        {this.renderTrendingMovies()}
        <h1 className="movies-category-title">Popular</h1>
        {this.renderTopRatedMovies()}
        <h1 className="movies-category-title">Originals</h1>
        {this.renderOriginalMovies()}
        <Footer />
      </div>
    )
  }
}

export default Home
