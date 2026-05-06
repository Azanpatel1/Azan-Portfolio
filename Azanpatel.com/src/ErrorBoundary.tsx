import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {}

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <pre
          style={{
            padding: 16,
            margin: 16,
            fontSize: 12,
            color: '#f59e0b',
            background: '#111',
            border: '1px solid #525252',
            whiteSpace: 'pre-wrap',
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          }}
        >
          {this.state.error.message}
          {'\n\n'}
          {this.state.error.stack}
        </pre>
      )
    }
    return this.props.children
  }
}
