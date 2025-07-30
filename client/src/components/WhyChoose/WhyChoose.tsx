import image4 from '../../assets/template_assets/images/custom/aditionalService.png';
import { additionalServices, reasons } from '../../util';

const WhyChoose: React.FC = () => {
  return (
    <section className="why-choose-us overflow-hidden px-2">
      <div className="auto-container">
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-6">
            <div className="sec-title style-two">
              <h2>Why Choose Us</h2>
              <p>
                Bring to the table win-win survival strategies to ensure
                proactive domination. At the end of the day, going forward, a
                new normal that has evolved from generation heading towards.
              </p>
            </div>

            {reasons.map((reason, index) => (
              <div className="icon-box" key={index}>
                <div className="icon">
                  <span className={reason.icon}></span>
                </div>
                <h4>{reason.title}</h4>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="col-lg-6">
            <div className="sec-title style-two">
              <h2>Additional Services</h2>
            </div>

            <div className="row">
              <div className="col-md-5">
                <div className="image why-image">
                  <img src={image4} alt="Additional Services" />
                </div>
              </div>

              <div className="col-md-7">
                <ul className="list">
                  {additionalServices.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;
