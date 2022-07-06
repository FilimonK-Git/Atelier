import React from 'react';
import ReactDOM from 'react-dom/client';
import ProductOverview from './components/overview/ProductOverview.jsx';
import RatingsAndReviews from './components/ratingsAndReviews/RatingsAndReviews.jsx';
import RelatedAndOutfit from './components/relatedItems/index.jsx';
import QuestionsAnswersMain from './components/questionsAndAnswers/components/QuestionsAnswersMain.jsx';
import $ from 'jquery';
const axios = require('axios');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: 71697,
      productInfo: undefined,
      styleInfo: [],
      defaultStyle: undefined,
      reviewData: null,
      reviews: null,
      metaData: null,
      rating: null
    };
  }

  getAllReviewsFunc() {
    return axios.get('/reviews', {params: {productId: this.state.productId} });
  }

  getAllMetaFunc() {
    return axios.get('/reviews/meta', {params: {productId: this.state.productId} });
  }

  componentDidMount() {
    // this.updateProduct(this.state.productId);
    this.getAllReviewsFunc()
      .then(response => {
        const reviewData = response.data;
        const reviews = response.data.results;
        this.getAllMetaFunc()
          .then(response => {
            const metaData = response.data;
            // console.log('reviewdata', reviewData);
            // console.log('reviews', reviews);
            // console.log('metadata', metaData);
            this.setState({reviews, reviewData, metaData}, () => {
              console.log('this.state', this.state);
              const ratings = this.state.metaData.ratings;
              let totalNumberOfRatings = 0;
              let totalRatings = 0;
              let averageRating;
              for (var key in ratings) {
                totalNumberOfRatings += parseInt(ratings[key]);
                totalRatings += (parseInt(key) * parseInt(ratings[key]));
              }

              averageRating = totalRatings / totalNumberOfRatings;
              averageRating = Math.round(10 * averageRating) / 10;
              this.setState({rating: averageRating}, () => {
                console.log('this.state for rating', this.state);
              });
            });
          });
      }).catch(err => {
        console.log('error getting reviews and metaData', err);
      });
  }

  updateProduct(productId) {
    var query = {productId: productId};
    $.ajax({
      url: '/products/:product_id',
      type: 'POST',
      data: query,
      success: (data) => {
        console.log('THIS IS MY DATA!', data);
        this.setState({
          productId: productId,
          productInfo: data
        });
      },
      error: (err) => {
        console.log(err);
      }
    }).then(() => {
      $.ajax({
        url: '/products/:product_id/styles',
        type: 'POST',
        data: query,
        success: (styles) => {
          console.log('THIS IS STYLE DATA', styles);
          this.setState({
            styleInfo: styles.results,
            defaultStyle: styles.results.find((product) => product['default?'] === true)
          });
        },
        error: (err) => {
          console.log(err);
        }
      });
    });
    // .then(() => {
    //   this.getAllReviewsFunc()
    //     .then(response => {
    //       console.log('reviews', response);
    //       const reviewData = response.data;
    //       const reviews = response.data.results;
    //       this.getAllMetaFunc()
    //         .then(response => {
    //           const metaData = response.data;
    //           this.setState({reviewData, reviews, metaData});
    //         });
    //     }).catch(err => {
    //       console.log('error getting reviews and metaData', err);
    //     });
    // });
  }

  render () {
    return (
      <div>
        <h1>Atelier</h1>
        {/* <ProductOverview productInfo={this.state.productInfo} rating={this.state.rating}/>
        <RelatedAndOutfit prodID={this.state.productId} rating={this.state.rating}/>
        <QuestionsAnswersMain productId={this.state.productId} key={this.state.productId} /> */}
        <RatingsAndReviews productId={this.state.productId} reviewData={this.state.reviewData} reviews={this.state.reviews} metaData={this.state.metaData}/>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);

export default App;
