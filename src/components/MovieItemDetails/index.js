import {Component} from 'react'
import {format} from 'date-fns'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Footer from '../Footer'
import Header from '../Header'
import SimilarMovieItem from '../SimilarMovieItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MovieItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    movieDetails: {},
    genres: [],
    similarMovies: [],
    spokenLanguages: [],
  }

  componentDidMount() {
    this.getMovieDetails()
  }

  getMovieDetails = async parameter => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {params} = match
    const {id} = params

    const requiredId = parameter === undefined ? id : parameter

    const apiUrl = `https://apis.ccbp.in/movies-app/movies/${requiredId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const fetchedObject = fetchedData.movie_details
      const updatedData = {
        adult: fetchedObject.adult,
        backdropPath: fetchedObject.backdrop_path,
        budget: fetchedObject.budget,
        genres: fetchedObject.genres,
        id: fetchedObject.id,
        overview: fetchedObject.overview,
        posterPath: fetchedObject.poster_path,
        releaseDate: fetchedObject.release_date,
        runtime: fetchedObject.runtime,
        similarMovies: fetchedObject.similar_movies,
        spokenLanguages: fetchedObject.spoken_languages,
        title: fetchedObject.title,
        voteAverage: fetchedObject.vote_average,
        voteCount: fetchedObject.vote_count,
      }
      //   console.log(updatedData)
      const genresList = updatedData.genres
      //   console.log(genresList)
      const similarMoviesList = updatedData.similarMovies.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        posterPath: eachMovie.poster_path,
        id: eachMovie.id,
        title: eachMovie.title,
        overview: eachMovie.overview,
      }))
      //   console.log(similarMoviesList)
      const spokenLanguagesList = updatedData.spokenLanguages.map(eachLang => ({
        englishName: eachLang.english_name,
        id: eachLang.id,
      }))
      //   console.log(spokenLanguagesList)

      this.setState({
        movieDetails: updatedData,
        apiStatus: apiStatusConstants.success,
        genres: genresList,
        similarMovies: similarMoviesList.slice(0, 6),
        spokenLanguages: spokenLanguagesList,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderMovieItemDetailsLoadingView = () => (
    <div className="popular-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  onTryAgain = () => {
    this.getMovieDetails()
  }

  renderMovieItemDetailsFailureView = () => (
    <div className="failure-view-page-container">
      <img
        src="https://res.cloudinary.com/df8n5yti7/image/upload/v1671028483/Background-CompleteSomething_went_wrong_lpwr8q.png"
        alt="failure view"
        className="failure-view-page-image"
      />
      <p className="failure-view-page-msg">
        Something went wrong. Please try again
      </p>
      <div className="failure-view-page-try-again-btn-container">
        <button
          type="button"
          onClick={this.onTryAgain}
          className='failure-view-page-try-again-btn"'
        >
          Try Again
        </button>
      </div>
    </div>
  )

  getSimilarMovieItemDetails = newId => {
    this.getMovieDetails(newId)
  }

  renderMovieItemDetailsSuccessView = () => {
    const {
      apiStatus,
      movieDetails,
      genres,
      similarMovies,
      spokenLanguages,
    } = this.state

    const pageContentsLoading = apiStatus === 'IN_PROGRESS'

    const {
      title,
      adult,
      runtime,
      releaseDate,
      overview,
      budget,
      voteAverage,
      voteCount,
      backdropPath,
    } = movieDetails

    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60
    const date = new Date(releaseDate)
    const year = date.getFullYear()
    const formattedDate = format(new Date(releaseDate), 'do MMMM yyyy')
    return (
      <>
        <div
          className="movie-item-details-top-section"
          style={{
            backgroundImage: `url(${backdropPath})`,
          }}
        >
          <Header pageContentsLoading={pageContentsLoading} />
          <div className="movie-basic-details-container">
            <h1 className="movie-item-title">{title}</h1>
            <div className="movie-basic-details-list">
              <p className="movie-basic-details-list-item">
                {`${hours}h ${minutes}m`}
              </p>
              <p className="movie-basic-details-list-item certification-container">
                {adult ? 'A' : 'U/A'}
              </p>
              <p className="movie-basic-details-list-item">{year}</p>
            </div>
            <p className="movie-item-overview">{overview}</p>
            <button type="button" className="movie-item-play-btn">
              Play
            </button>
          </div>
          <div className="movie-item-shade-container">{}</div>
        </div>
        <div className="movie-item-mid-container">
          <div className="details-each-container">
            <h1 className="movie-item-mid-container-title">Genres</h1>
            {genres.map(eachGenre => (
              <p
                key={eachGenre.id}
                className="movie-item-mid-container-list-item"
              >
                {eachGenre.name}
              </p>
            ))}
          </div>
          <div className="details-each-container">
            <h1 className="movie-item-mid-container-title">Audio Available</h1>

            {spokenLanguages.map(eachLanguage => (
              <p
                key={eachLanguage.id}
                className="movie-item-mid-container-list-item"
              >
                {eachLanguage.englishName}
              </p>
            ))}
          </div>
          <div className="details-each-container">
            <div>
              <h1 className="movie-item-mid-container-title">Rating Count</h1>
              <p className="movie-item-mid-container-list-item">{voteCount}</p>
            </div>
            <div>
              <h1 className="movie-item-mid-container-title">Rating Average</h1>
              <p className="movie-item-mid-container-list-item">
                {voteAverage}
              </p>
            </div>
          </div>
          <div className="details-each-container">
            <div>
              <h1 className="movie-item-mid-container-title">Budget</h1>
              <p className="movie-item-mid-container-list-item">{budget}</p>
            </div>
            <div>
              <h1 className="movie-item-mid-container-title">Release Date</h1>
              <p className="movie-item-mid-container-list-item">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>
        <div className="similar-movies-container">
          <h1 className="similar-movies-container-title">More like this</h1>
          <ul className="similar-movies-items-container">
            {similarMovies.map(eachSimilarMovie => (
              <SimilarMovieItem
                similarMovie={eachSimilarMovie}
                key={eachSimilarMovie.id}
                getSimilarMovieItemDetails={this.getSimilarMovieItemDetails}
              />
            ))}
          </ul>
        </div>
        <Footer />
      </>
    )
  }

  renderMovieDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderMovieItemDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderMovieItemDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderMovieItemDetailsLoadingView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    const pageContentsLoading = apiStatus === 'IN_PROGRESS'
    return (
      <div className="movie-item-details-container">
        {apiStatus !== 'SUCCESS' && (
          <Header pageContentsLoading={pageContentsLoading} />
        )}
        {this.renderMovieDetails()}
      </div>
    )
  }
}

export default MovieItemDetails
