import {
  Footer as USWDSFooter,
  FooterNav,
  Logo,
} from "@trussworks/react-uswds";

const Footer = ({ returnToTop }) => {
  return (
    <USWDSFooter
      size="slim"
      returnToTop={returnToTop}
      primary={
        <div className="usa-footer__primary-container grid-row">
          <div className="mobile-lg:grid-col-8">
            <FooterNav
              size="slim"
              links={[
                <a
                  className="usa-footer__primary-link"
                  href="https://github.com/JCopeland-PIFSC/radfish-cruise-app"
                >
                  RADFish Cruise App Repo
                </a>,
                <a
                  className="usa-footer__primary-link"
                  href="https://nmfs-radfish.github.io/radfish/"
                >
                  RADFish Documentation
                </a>,
                <a
                  className="usa-footer__primary-link"
                  href="https://github.com/NMFS-RADFish/boilerplate"
                >
                  RADFish Boilerplate
                </a>,
              ]}
            />
          </div>
        </div>
      }
      secondary={
        <div className="grid-row grid-gap">
          <div></div>
          <Logo
            className="flex-justify-end"
            size="medium"
            image={
              <img
                className="usa-footer__logo-img"
                alt="radfish logo"
                src="radfish-logo.webp"
              />
            }
            heading={<p className="">Built by RADFish</p>}
          />
        </div>
      }
    />
  );
};

export default Footer;
