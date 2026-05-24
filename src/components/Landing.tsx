import { Nav } from './Nav';
import { Hero } from './Hero';
import { Partners } from './Partners';
import { Footer } from './Footer';
import { Icon } from '../icons';
import type { Go } from '../App';

interface LandingProps {
  go: Go;
}

export function Landing({ go }: LandingProps) {
  return (
    <div className="page">
      <Nav go={go} current="home" />
      <Hero go={go} />
      <Partners go={go} />
      <Footer />
      <a
        className="wa-float"
        href={`https://wa.me/918589014122?text=Hi%2C%20I%20need%20admission%20guidance.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with a counsellor on WhatsApp"
      >
        <Icon.WhatsApp size={26} />
        <span className="wa-float-label">Chat with counsellor</span>
      </a>
    </div>
  );
}
