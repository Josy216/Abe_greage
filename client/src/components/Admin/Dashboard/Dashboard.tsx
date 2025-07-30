import { dashboardData } from "../../../util";

const Dashboard: React.FC = () => {
    return (
      <section className="services-section">
        <div className="auto-container">
          <div className="sec-title style-two">
            <h2>Admin Dashboard</h2>
            <div className="text">
              Bring to the table win-win survival strategies to ensure proactive
              domination. At the end of the day, going forward, a new normal
              that has evolved from generation X is on the runway heading a
              streamlined cloud solution.
            </div>
          </div>
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {dashboardData.map((item, index) => (
              <div
                className="col-lg-4 service-block-one"
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1 0 auto',
                  minHeight: '100%',
                }}
              >
                <div
                  className="inner-box hvr-float-shadow"
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h5>{item.description}</h5>
                    <h2>{item.title}</h2>
                  </div>
                  <a href={item.link} className="read-more">
                    {item.linkText}
                  </a>
                  <div className="icon">
                    <span className={item.icon}></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}

export default Dashboard;
