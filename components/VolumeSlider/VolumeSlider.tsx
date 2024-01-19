import { useState } from 'react';
import Style from '@/components/VolumeSlider/VolumeSlider.module.css';


type VolumeSliderProps = {
    onVolumeChange: (volume: number) => void;
};

const VolumeSlider = ({ onVolumeChange }: VolumeSliderProps) => {
  const [volume, setVolume] = useState(50);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = Number(e.target.value);
    setVolume(volume);
    onVolumeChange(volume - 50);
  };

  return (
    <>
      <input type='range' id='volumeSlider' value={volume} onChange={handleVolumeChange} className={Style.volumeInput}/>
    </>
  );
};

export default VolumeSlider;
