import React from 'react'
import ReactDOM from 'react-dom'
import styles from './modal.scss'
const modalRoot = document.getElementById('modal-root')

export default class Modal extends React.Component {
  constructor(props) {
    super(props)
  }

  handleKeyDown = event => {
    if (event.key === 'Escape') {
      this.props.onCloseInitiated()
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown)
    document.body.classList.add('modal-open')
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
    document.body.classList.remove('modal-open')
  }

  render() {
    const { children, className } = this.props
    const classes = [className, styles['modal']].filter(Boolean)
    const content = <div className={[...classes]}>{children}</div>
    return ReactDOM.createPortal(content, modalRoot)
  }
}
