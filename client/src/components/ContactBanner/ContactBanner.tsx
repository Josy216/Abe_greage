interface Props {
  banner: string;
  title: string;
  linkText1: string;
  linkText2: string;
  linkUrl1: string;
  linkUrl2: string;
}

const ContactBanner: React.FC<Props> = ({
  banner,
  title,
  linkText1,
  linkText2,
  linkUrl1,
  linkUrl2,
}) => {
  return (
    <section
      className="contact-banner"
      style={{
        backgroundImage: `url(${banner})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '300px',
      }}
    >
      <div
        className="auto-container d-flex align-items-center"
        style={{ height: '100%', width: '70%', marginTop: '-15px' }}
      >
        <div>
          <h1 className="text-white">{title}</h1>
          <div className="d-flex">
            <a href={linkUrl1}>
              {linkText1} {' > '}
            </a>
            <a href={linkUrl2} style={{ marginLeft: '10px' }}>
              {linkText2}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactBanner;
