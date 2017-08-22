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
    //start on step 1 to select price
    this.handleNext()
  }

  componentWillUpdate(nextProps){
    const {stepIndex} = this.state;

    if(nextProps.price && !this.props.price && !nextProps.amount){
      //move to step 2 to select amount
      this.handleNext()
    } else if (nextProps.price && nextProps.amount && !this.props.amount){
      //price and amount are selected, move to final step 3
      this.handleNext()
    } else if (nextProps.price && !nextProps.amount && this.props.price && stepIndex === 2){
      //price selected, amount cleared, move back to step 2 to select amount
      this.handlePrev()
    } else if (!nextProps.price && !nextProps.amount && this.props.price && stepIndex === 1){
      //on step 2, but no amount entered, and price is deselected, move back to step 1
      this.handlePrev()
    } else if (!nextProps.price && nextProps.amount && this.props.amount){
      //no price selected, clear out amount and move back to step 2
      this.props.clear();
      this.handlePrev();
    } else if(!nextProps.price && !nextProps.amount && this.props.amount){
      //handle moving back to step 2 again, since no price but props.amount still set
      this.handlePrev();
    } else if(!nextProps.price && !nextProps.amount && !this.props.amount && !this.props.price){
      //*starts here on page load
      //handle moving back to step 1 when price and amount cleared
      this.handlePrev();
    }
  }

  render() {
    const {stepIndex} = this.state;

    return (
      <div className="Linear-Stepper">
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