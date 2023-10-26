import { styled } from '@linaria/react'

const Container = styled.div<{ color: string }>`
	background-color: blue;
	color: ${props => props.color};
`

export default Container
