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
      finished: stepIndex >= 2,
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
    // const {amount, price} = this.props;
    console.log(nextProps, this.props)
    //first run of selecting price, this.props.price is undefined
    if(nextProps.price && !this.props.price && !nextProps.amount){
      this.handleNext()
    } else if (nextProps.price && nextProps.amount && !this.props.amount){
      this.handleNext()
    } else if (nextProps.price && nextProps.amount && this.props.amount && this.props.price){
      // this.handleNext()
    } else {
      // this.handlePrev()
    }


      //if price is empty, dont move
      //if price is populated but amount is empty, go to step two
      //if price is populated and amount is populared, go to step three

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