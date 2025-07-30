import ContactBanner from '../components/ContactBanner/ContactBanner';
import banner from '../assets/template_assets/images/custom/banner/bottomBanner.png';
import HomeAbout from '../components/HomeAbout/HomeAbout';
import WhyChoose from '../components/WhyChoose/WhyChoose';
import banner2 from '../assets/template_assets/images/custom/banner/bottomBanner.png';
import HomeBanner from '../components/HomeBanner/HomeBanner';
import CallToAction from '../components/CallToAction/CallToAction';
import img1 from '../assets/template_assets/images/custom/vehicle-service.jpg';
import { aboutText } from '../util';

const About: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <ContactBanner
        banner={banner}
        title="About Us"
        linkText1="Home"
        linkText2="Contact Us"
        linkUrl1="/"
        linkUrl2="/contact"
      />
      <div className="auto-container mt-5 px-2">
        <div className="row">
          <div className="col-lg-7 pl-lg-5">
            <div className="sec-title">
              <h3>We are highly skilled mechanics for your car repair</h3>
            </div>
            <div className="text">
              {aboutText.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="col-lg-5">
            <div className="image-box service-image">
              <img src={img1} alt="" />
            </div>
          </div>
        </div>
      </div>
      <HomeAbout />
      <WhyChoose />
      <HomeBanner banner={banner2} />
      <CallToAction />
    </div>
  );
}

export default About;
