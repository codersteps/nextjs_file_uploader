import styles from '../styles/Spinner.module.css'

interface Props {
	className: string;
}
const Spinner = ({
	className,
}: Props) => {
	return <div id={styles.loading} className={className} ></div>;
}

export default Spinner;