import { useState } from 'react';
import { serviceListData } from '../../util';

const HomeFeature: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleDescription = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="services-section px-2">
      <div className="auto-container">
        <div className="sec-title style-two">
          <h2>Our Featured Services</h2>
          <div className="text">
            Bring to the table win-win survival strategies to ensure proactive
            domination. At the end of the day, going forward, a new normal that
            has evolved from generation X is on the runway heading towards a
            streamlined cloud solution.
          </div>
        </div>
        <div className="row">
          {serviceListData.map((service, index) => (
            <div key={index} className="col-lg-4 service-block-one mb-4">
              <div className="inner-box hvr-float-shadow p-3">
                <h5>Service and Repairs</h5>
                <h2>{service.title}</h2>

                {expandedIndex === index && (
                  <p style={{ whiteSpace: 'pre-line', fontSize: '0.9rem' }}>
                    {service.description}
                  </p>
                )}

                <button
                  className="read-more btn btn-link text-danger p-0"
                  onClick={() => toggleDescription(index)}
                >
                  {expandedIndex === index ? 'read less' : 'read more +'}
                </button>

                <div className="icon mt-2">
                  <span className={service.icon}></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeFeature;
