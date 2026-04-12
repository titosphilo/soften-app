import { useState } from 'react';
import Landing from './components/Landing';
import Home from './components/Home';
import SoloChat from './components/SoloChat';
import CouplesSetup from './components/CouplesSetup';
import TemenosInvitation from './components/TemenosInvitation';
import TemenosThreshold from './components/TemenosThreshold';
import TemenosSession from './components/TemenosSession';

function App() {
  const [screen, setScreen] = useState('landing');
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');

  function handleCouplesStart(p1, p2) {
    setPartner1(p1);
    setPartner2(p2);
    setScreen('invitation');
  }

  switch (screen) {
    case 'landing':
      return <Landing onAccept={() => setScreen('home')} />;
    case 'home':
      return (
        <Home
          onSolo={() => setScreen('solo')}
          onCouples={() => setScreen('couples-setup')}
        />
      );
    case 'solo':
      return <SoloChat onBack={() => setScreen('home')} />;
    case 'couples-setup':
      return (
        <CouplesSetup
          onStart={handleCouplesStart}
          onBack={() => setScreen('home')}
        />
      );
    case 'invitation':
      return (
        <TemenosInvitation
          partner1={partner1}
          partner2={partner2}
          onAccept={() => setScreen('threshold')}
        />
      );
    case 'threshold':
      return (
        <TemenosThreshold
          partner1={partner1}
          partner2={partner2}
          onEnter={() => setScreen('temenos')}
        />
      );
    case 'temenos':
      return (
        <TemenosSession
          partner1={partner1}
          partner2={partner2}
          onEnd={() => setScreen('home')}
        />
      );
    default:
      return <Landing onAccept={() => setScreen('home')} />;
  }
}

export default App;
