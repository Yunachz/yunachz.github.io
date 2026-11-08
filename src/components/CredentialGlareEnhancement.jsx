import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import GlareHover from './react-bits/GlareHover.jsx';

export default function CredentialGlareEnhancement() {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const nextSlots = [...document.querySelectorAll('[data-credential-glare-slot]')]
      .map((element) => ({ element, key: element.dataset.credentialGlareKey }))
      .filter(({ key }) => Boolean(key));
    setSlots(nextSlots);

    const notify = () => {
      document.querySelectorAll('[data-credential-glare-slot] .glare-hover').forEach((root) => {
        root.dispatchEvent(new Event('credential:eligibilitychange'));
      });
    };
    document.addEventListener('portfolio:credentialpagechange', notify);
    document.addEventListener('portfolio:localechange', notify);
    document.addEventListener('visibilitychange', notify);
    return () => {
      document.removeEventListener('portfolio:credentialpagechange', notify);
      document.removeEventListener('portfolio:localechange', notify);
      document.removeEventListener('visibilitychange', notify);
    };
  }, []);

  return (
    <>
      <span className="credential-glare-bootstrap" aria-hidden="true" />
      {slots.map(({ element, key }) => createPortal(
        <GlareHover
          width="100%"
          height="100%"
          background="transparent"
          borderRadius="20px"
          borderColor="transparent"
          mode="hover"
          variant="streak"
          glareColor="#ffffff"
          glareOpacity={0.5}
          glareSize={30}
          softness={0.6}
          glareAngle={-45}
          blendMode="screen"
          rimGlint={true}
          transitionDuration={650}
          intro={true}
          playOnce={false}
        />,
        element,
        key,
      ))}
    </>
  );
}
