import { Nav } from './Nav';
import { Hero } from './Hero';
import { Partners } from './Partners';
import { Footer } from './Footer';
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
    </div>
  );
}
