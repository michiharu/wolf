import React from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

interface State {
  focus: boolean;
  hover: boolean;
  top: number;
  left: number;
  width: number;
  height: number;
}

export class ScrollableTextField extends React.Component<TextFieldProps, State> {
  textfieldRef = React.createRef<any>();
  coverRef = React.createRef<HTMLDivElement>();

  constructor(props: TextFieldProps) {
    super(props);
    this.state = {focus: false, hover: false, top: 0, left: 0, width: 0, height: 0 };
  }

  componentDidMount() {
    process.nextTick(this.resize);
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    const tfEl = this.textfieldRef.current;
    const cvEl = this.coverRef.current;
    if (tfEl === null || cvEl === null) { throw 'Element not found.'; }

    const inputContainerEl = tfEl.parentNode.parentNode;
      this.setState({
        top: inputContainerEl.offsetTop,
        left: inputContainerEl.offsetLeft,
        width: inputContainerEl.offsetWidth,
        height: inputContainerEl.offsetHeight
      });
  }

  setFocus = () => {
    if (this.props.disabled) { return; }
    this.setState({focus: true});
    this.textfieldRef.current!.focus();
  }

  render() {
    const { focus, hover, top, left, width, height } = this.state;
    return (
      <div style={{position: 'relative'}}>
        <TextField inputRef={this.textfieldRef} {...this.props} onBlur={() => this.setState({focus: false})} />
        {!focus && !hover &&
        <div
          ref={this.coverRef}
          style={{position: 'absolute', top, left, width, height}}
          onClick={this.setFocus}
          onTouchEnd={this.setFocus}
          onMouseEnter={() => !this.props.disabled && this.setState({hover: true})}
        />}
      </div>
    );
  }
}