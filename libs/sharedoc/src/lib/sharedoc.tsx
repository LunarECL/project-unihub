import styles from './sharedoc.module.css';

/* eslint-disable-next-line */
export interface SharedocProps {}

export function Sharedoc(props: SharedocProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Sharedoc!</h1>
    </div>
  );
}

export default Sharedoc;
