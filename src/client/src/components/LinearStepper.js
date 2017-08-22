import React, { Component } from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

class HorizontalLinearStepper extends Component {

  state = {
    finished: false,
    stepIndex: -1
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 1,
    });
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  componentDidMount(){
    this.handleNext()
  }

  componentWillUpdate(nextProps){
    const {stepIndex} = this.state;
    console.log(nextProps, this.props, stepIndex)
    //first run of selecting price, this.props.price is undefined
    if(nextProps.price && !this.props.price && !nextProps.amount){
      this.handleNext()
    } else if (nextProps.price && nextProps.amount && !this.props.amount){
      this.handleNext()
    } else if (nextProps.price && !nextProps.amount && this.props.price && stepIndex === 2){
      this.handlePrev()
    }
  }

  render() {
    const {finished, stepIndex} = this.state;

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Select a coin at exchange price in the table</StepLabel>
          </Step>
          <Step>
            <StepLabel>Enter the amount you want to purchase in USD</StepLabel>
          </Step>
          <Step>
            <StepLabel>Check out your Abacus calculation!</StepLabel>
          </Step>
        </Stepper>
      </div>
    );
  }
}

export default HorizontalLinearStepper;