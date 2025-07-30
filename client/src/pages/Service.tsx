import ContactBanner from '../components/ContactBanner/ContactBanner';
import banner from '../assets/template_assets/images/custom/banner/bottomBanner.png';
import HomeFeature from '../components/HomeFeature/HomeFeature';
import WhyChoose from '../components/WhyChoose/WhyChoose';
import HomeBanner from '../components/HomeBanner/HomeBanner';
import banner2 from '../assets/template_assets/images/custom/banner/bottomBanner.png';
import CallToAction from '../components/CallToAction/CallToAction';

const Service: React.FC = () => {
  return (
    <div className='overflow-hidden'>
      <ContactBanner
        banner={banner}
        title="Our Services"
        linkText1="Home"
        linkText2="Contact Us"
        linkUrl1="/"
        linkUrl2="/contact"
      />
      <HomeFeature />
      <WhyChoose />
      <HomeBanner banner={banner2} />
      <CallToAction />
    </div>
  );
}

export default Service;
