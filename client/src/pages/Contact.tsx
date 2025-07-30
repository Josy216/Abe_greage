import Address from '../components/Address/Address';
import CallToAction from '../components/CallToAction/CallToAction';
import ContactBanner from '../components/ContactBanner/ContactBanner';
import banner from '../assets/template_assets/images/custom/banner/bottomBanner.png';

const Contact: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <ContactBanner
        banner={banner}
        title="Contact Us"
        linkText1="Home"
        linkText2="About Us"
        linkUrl1="/"
        linkUrl2="/about"
      />
      <Address />
      <CallToAction />
    </div>
  );
};

export default Contact;
