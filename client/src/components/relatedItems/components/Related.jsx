import React from "react";
import $ from "jquery";
import RelatedCard from "./RelatedCard.jsx";
import Comparison from "./Comparison.jsx";

class Related extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalSeen: false,
      relatedProdFeat: [],
      relatedProdName: "",
    };
  }

  comparison(relatedProdFeat, relatedProdName) {
    this.setState({
      modalSeen: !this.state.modalSeen,
      relatedProdFeat: relatedProdFeat,
      relatedProdName: relatedProdName,
    });
  }

  comparisonCloser(e) {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }

  render() {
    return (
      <div
        role="comparisonModalToggler"
        onClick={(e) => {
          this.setState({ modalSeen: false });
        }}
      >
        <div
          className="compClass"
          role="comparisonModalClickClosePreventer"
          onClick={this.comparisonCloser}
        >
          {this.state.modalSeen ? (
            <Comparison
              mainProdName={this.props.prodInfo.name}
              relatedProdName={this.state.relatedProdName}
              toggle={this.comparison.bind(this)}
              mainProdFeat={this.props.prodInfo.features}
              relatedProdFeat={this.state.relatedProdFeat}
              userTracker={this.props.userTracker}
            />
          ) : null}{" "}
        </div>

        <div className="relatedCarousel">
          {this.props.itemInfoAndStyle.map((itemData, index) => (
            <RelatedCard
              itemData={itemData}
              prodIDChanger={this.props.prodIDChanger}
              comparison={this.comparison.bind(this)}
              relatedItemsUpdater={this.props.relatedItemsUpdater}
              userTracker={this.props.userTracker}
              key={index}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Related;
