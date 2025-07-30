import HomeAbout from '../components/HomeAbout/HomeAbout';
import HomeBanner from '../components/HomeBanner/HomeBanner';
import HomeFeature from '../components/HomeFeature/HomeFeature';
import WhyChoose from '../components/WhyChoose/WhyChoose';
import banner from '../assets/template_assets/images/custom/banner/banner1.jpg';
import banner2 from '../assets/template_assets/images/custom/banner/bottomBanner.png';
import CallToAction from '../components/CallToAction/CallToAction';
import HomeUnderFeature from '../components/HomeUnderFeature/HomeUnderFeature';

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <HomeBanner banner={banner} />
      <HomeAbout />
      <HomeFeature />
      <HomeUnderFeature />
      <WhyChoose />
      <HomeBanner banner={banner2} />
      <CallToAction />
    </div>
  );
};

export default Home;
