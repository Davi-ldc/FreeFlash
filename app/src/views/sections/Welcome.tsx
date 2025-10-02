export interface WelcomeProps {
	text: string
}

const Welcome = ({ text }: WelcomeProps) => {
	return <section class="welcome">{text}</section>
}

export default Welcome
