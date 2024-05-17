import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    Step,
    StepLabel,
    Stepper
} from '@mui/material';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import DynamicComponent from '../../DynamicComponent/DynamicComponent';

function checkRequiredField(inputs) {
    let error = false
    if (typeof inputs === 'object' && typeof inputs.$$typeof === 'undefined')
        inputs.map(input => {
            if (
                input.rules?.required
                && (
                    input.value === undefined
                    || input.value === ''
                    || input.value === null
                    || input.value.length === 0
                )
            )
                error = true
        })

    return error;
}

StepperForm.propTypes = {
    listInputs: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    steps: PropTypes.array.isRequired,
    actions: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    sx: PropTypes.object,
}

export default function StepperForm(props) {
    const [activeStep, setActiveStep] = useState(0);
    const [inputs, setInputs] = useState(props.listInputs)
    const steps = props.steps
    const [currentInputs, setCurrentInputs] = useState(inputs[activeStep])
    const [isDisableSubmitButton, setIsDisableSubmitButton] = useState(checkRequiredField(currentInputs))

    useEffect(() => setCurrentInputs(inputs[activeStep]), [inputs, activeStep])

    const handleNext = () => {
        if (props.actions[activeStep]) {
            new Promise((resolve, reject) => {
                props.actions[activeStep](inputs[activeStep])
                    .then((response) => {
                        response.success === true
                            ? resolve(response)
                            : reject(response)
                    })
            }).then((response) => {
                if (response.success && response.data) {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                    setInputs([...inputs, inputs[activeStep + 1] = response.data])
                } else {
                    console.log("here")
                }
            }).catch((e) => console.error(e.message))
        } else
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleClose = () => {
        props.onClose()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const inputsSend = []
        inputs.map(step => {
            console.log(step)
            step.map(input => {
                console.log(input)
                inputsSend.push(input)
            })
        })
        console.log(inputsSend)
        props.actions[activeStep](inputsSend)
        handleClose()
    }

    const setIsDisableSubmitButtonAndInputs = (newInputs) => {
        setInputs(newInputs)
        setIsDisableSubmitButton(checkRequiredField(newInputs))
        if (props.onChange) props.onChange(newInputs)
    }

    if (inputs !== props.listInputs) {
        setIsDisableSubmitButtonAndInputs(props.listInputs)
    }

    return <Box sx={props.sx}>
        <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth={(typeof currentInputs === 'object' && typeof currentInputs.$$typeof === 'undefined') ? 'sm' : 'md'}>
            <DialogTitle>
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                    {props.title ?? 'Title is missing'}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <FormControl>
                <DialogContent>
                    <Stepper activeStep={activeStep} sx={{ marginY: 2 }}>
                        {
                            steps && steps.map((label, index) => {
                                return <Step key={label} >
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            })
                        }
                    </Stepper>
                    <Grid container columnSpacing={2} rowSpacing={2} sx={{ alignItems: 'flex-end' }} >
                        {
                            (typeof currentInputs === 'object' && typeof currentInputs.$$typeof === 'undefined')
                                ? currentInputs.map(input => <Grid xs={input.xs ?? 12} sm={input.sm ?? 12} item key={input.key ?? null}>
                                    <DynamicComponent
                                        listInputs={currentInputs}
                                        input={input}
                                        setIsDisableSubmitButtonAndInputs={setIsDisableSubmitButtonAndInputs}
                                    />
                                </Grid>)
                                : currentInputs
                        }
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ padding: "20px 24px" }}>
                    <Button
                        disabled={activeStep === 0}
                        variant='text'
                        onClick={handleBack}
                    >
                        Précédent
                    </Button>
                    <Button
                        disabled={((activeStep === steps.length - 1) && isDisableSubmitButton)}
                        variant={activeStep === steps.length - 1 ? 'contained' : 'text'}
                        onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                    >
                        {activeStep === steps.length - 1 ? 'Valider' : 'Suivant'}
                    </Button>
                </DialogActions>
            </FormControl>
        </Dialog>
    </Box>
}