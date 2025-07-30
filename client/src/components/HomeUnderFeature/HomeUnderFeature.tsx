import image3 from '../../assets/template_assets/images/custom/features-guage.png';

const HomeUnderFeature: React.FC = () => {
  return (
    <section className="features-section px-2">
      <div className="auto-container">
        <div className="row">
          <div className="col-lg-6">
            <div className="inner-container">
              <h2>
                Quality Service And <br /> Customer Satisfaction !!
              </h2>
              <div className="text">
                We utilize the most recent symptomatic gear to ensure your
                vehicle is fixed or adjusted appropriately and in an opportune
                manner. We are an individual from Professional Auto Service, a
                first class execution arrange, where free assistance offices
                share shared objectives of being world-class car administration
                focuses.
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="image">
              <img src={image3} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeUnderFeature;
