import Style from '@/components/Pad/Pad.module.css';

type PadProps = {
  padKey: string;
  onClick: () => void;
  disabled: boolean;
};

const Pad: React.FC<PadProps> = ({ padKey, onClick, disabled }) => {
  return (
    <button disabled={!disabled} onClick={onClick} className={Style.pad}>
      <p className={Style.padText}>{padKey}</p>
    </button>
  );
};

export default Pad;
