'use client';

import Style from '@/components/DrumMachine/DrumMachine.module.css';
import Pad from '../Pad/Pad';
import { pack1, startSounds } from '../SoundPacks/SoundPacks';
import { useEffect, useRef, useState } from 'react';
import VolumeSlider from '../VolumeSlider/VolumeSlider';

import * as Tone from 'tone';

import KnobSkin from '../Knob/KnobSkin';

const DrumMachine = () => {
  const pads = pack1;
  const powerSound = startSounds;

  const [volume, setVolume] = useState(0);
  const [chebyValue, setChebyValue] = useState(1);
  const [distortionValue, setDistortionValue] = useState(0);
  const [reverbValue, setReverbValue] = useState(0.1);
  const [pitchValue, setPitchValue] = useState(0);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [nowPlaying, setNowPlaying] = useState('');
  const [isPowered, setIsPowered] = useState(false);

  const waveformRef = useRef<HTMLCanvasElement>(null);

  const removePathFromSound = (sound: string) => {
    if (sound === '/sounds/power/start.wav') {
      return 'Welcome to the Drum Machine!'
    }
    if (sound === '/sounds/power/off.wav') {
      return 'Goodbye!'
    }
    const regexSound = /\/([^\/]+\.wav)$/;
    const match = sound.match(regexSound);
    if (match) {
      return match[1];
    }
  };

  const handlePowerButton = () => {
    if (!isPowered) {
      handlePlay(powerSound[0].sound);
      setIsPowered(true);
    } else {
      handlePlay(powerSound[1].sound);
      setIsPowered(false);
    }
  };

  const handlePlay = async (sound: string) => {
    const player = new Tone.Player({
      url: sound,
      autostart: false,
      onload: async () => {
        try {
          await Tone.loaded();
          const cheby = new Tone.Chebyshev(chebyValue).toDestination();
          const distortion = new Tone.Distortion(distortionValue).toDestination();
          const reverb = new Tone.Reverb(reverbValue).toDestination();
          const pitch = new Tone.PitchShift(pitchValue).toDestination();
          player.chain(cheby, distortion, reverb, pitch);

          setIsSoundPlaying(true);
          setNowPlaying(removePathFromSound(sound) || '');

          visualize(player);

          player.start();
        } catch (error) {
          console.error('Error loading audio:', error);
        }
      },
      onstop: () => {
        setIsSoundPlaying(false);
        setNowPlaying('');
        player.dispose();
      },
    });

    player.volume.value = volume;
  };

  const visualize = (player: Tone.Player) => {
    const analyser = new Tone.Analyser('waveform', 256);
    player.connect(analyser);

    if (waveformRef.current) {
      const canvas = waveformRef.current;
      const canvasContext = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      const drawWaveform = () => {
        if (canvasContext) {
          const dataArray = analyser.getValue();
          canvasContext.clearRect(0, 0, width, height);
          canvasContext.beginPath();
          for (let i = 0; i < dataArray.length; i++) {
            const x = (i / dataArray.length) * width;
            const y = (0.5 + Number(dataArray[i]) / 2) * height;
            if (i === 0) {
              canvasContext.moveTo(x, y);
            } else {
              canvasContext.lineTo(x, y);
            }
          }
          canvasContext.lineWidth = 3;
          canvasContext.strokeStyle = '#002e63';
          canvasContext.stroke();
        }
        requestAnimationFrame(drawWaveform);
      };

      drawWaveform();
    }
  };

  useEffect(() => {
    const dummyPlayer = new Tone.Player().toDestination();
    visualize(dummyPlayer);
    return () => {
      dummyPlayer.dispose();
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPowered) {
        return
      }
      const pressedKey = pads.find((pad) => pad.key.toLowerCase() === e.key);
      if (pressedKey) {
        handlePlay(pressedKey.sound);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [pads, volume, chebyValue, distortionValue, reverbValue, pitchValue, isSoundPlaying]);

  return (
    <div className={Style.machineBase}>
      <div className={Style.logoWrapper}>
        <img src="logo.svg" alt="logo" />
      </div>
      <div className={Style.speakerWrapper}>
        <img src='speaker.svg' alt='speaker' className={Style.speaker} />
        {isSoundPlaying && <img src='speakerPlaying.svg' alt='speakerPlaying' className={Style.speakerPlaying} />}
      </div>
      {/*Power button*/}
      <div className={Style.powerButtonWrapper}>
        <button className={Style.powerButton} onClick={() => handlePowerButton()}><h1 className={Style.powerButtonText}>POWER</h1></button>
      </div>
      {/*Screen*/}
      <div className={Style.screenWrapper}>
        <div className={[Style.screen, isPowered ? '' : Style.screenOff].join(' ')} >
          <h1 className={Style.nowPlayingHeading}>{nowPlaying}</h1>
          {/*Waveform*/}
          {isPowered && <canvas className={Style.waveform} ref={waveformRef} id='waveform' width={500} height={200}></canvas>}
        </div>
      </div>
      {/*Knobs*/}
      <div className={Style.knobWrapper}>
        <div className={Style.twoKnobWrapper}>
          {/*Cheby knob*/}
          <KnobSkin diameter={100} min={1} max={50} step={1} value={chebyValue} onValueChange={setChebyValue}>
            <label className={Style.knobLabelWrapper}>
              <h3 className={Style.knobLabelHeading}>CHEBY</h3>
              <div className={Style.knobLabelValueWrapper}>
                <h3 className={Style.knobLabelValue}>{chebyValue}</h3>
              </div>
            </label>
          </KnobSkin>
          {/*Distortion knob*/}
          <KnobSkin diameter={100} min={0} max={10} step={1} value={distortionValue} onValueChange={setDistortionValue}>
            <label className={Style.knobLabelWrapper}>
              <h3 className={Style.knobLabelHeading}>DISTORTION</h3>
              <div className={Style.knobLabelValueWrapper}>
                <h3 className={Style.knobLabelValue}>{distortionValue}</h3>
              </div>
            </label>
          </KnobSkin>
        </div>
        <div className={Style.twoKnobWrapper}>
          {/*Reverb knob*/}
          <KnobSkin diameter={100} min={1} max={10} step={1} value={reverbValue} onValueChange={setReverbValue}>
            <label className={Style.knobLabelWrapper}>
              <h3 className={Style.knobLabelHeading}>REVERB</h3>
              <div className={Style.knobLabelValueWrapper}>
                <h3 className={Style.knobLabelValue}>{reverbValue}</h3>
              </div>
            </label>
          </KnobSkin>
          {/*Pitch knob*/}
          <KnobSkin diameter={100} min={-30} max={30} step={1} value={pitchValue} onValueChange={setPitchValue}>
            <label className={Style.knobLabelWrapper}>
              <h3 className={Style.knobLabelHeading}>PITCH</h3>
              <div className={Style.knobLabelValueWrapper}>
                <h3 className={Style.knobLabelValue}>{pitchValue}</h3>
              </div>
            </label>
          </KnobSkin>
        </div>
      </div>
      {/*Volume slider*/}
      <div className={Style.volumeWrapper}>
        <VolumeSlider onVolumeChange={setVolume} />
      </div>
      {/*Pads*/}
      <div className={Style.padBase}>
        <div className={Style.padWrapper}>
          {pads.map((pad) => (
            <Pad disabled={isPowered} key={pad.key} padKey={pad.key} onClick={() => handlePlay(pad.sound)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrumMachine;
