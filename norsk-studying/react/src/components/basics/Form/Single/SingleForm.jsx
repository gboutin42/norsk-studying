import { useState } from 'react'
import { Box, Button, FormControl, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import './SingleForm.css'
import PropTypes from 'prop-types'
import DynamicComponent from '../../DynamicComponent/DynamicComponent'

function checkRequiredField(inputs) {
    let error = false
    inputs.map(input => {
        if (input.rules?.required && (input.value === undefined || input.value === '' || input.value === null || input.value.length === 0))
            error = true
    })

    return error;
}

SingleForm.propTypes = {
    listInputs: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
}

function SingleForm(props) {
    const [inputs, setInputs] = useState(props.listInputs)
    const [isDisableSubmitButton, setIsDisableSubmitButton] = useState(checkRequiredField(inputs))

    const setIsDisableSubmitButtonAndInputs = (newInputs) => {
        setInputs(newInputs)
        setIsDisableSubmitButton(checkRequiredField(newInputs))
        if (props.onChange) props.onChange(newInputs)
    }

    if (inputs !== props.listInputs) {
        setIsDisableSubmitButtonAndInputs(props.listInputs)
    }

    const handleClose = () => {
        props.onClose()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(inputs)
        props.onSubmit(inputs)
        handleClose()
    }

    return <Box>
        <Dialog open={props.open} onClose={handleClose} fullWidth>
            <DialogTitle>
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Typography color='primary' fontWeight={600}>{props.title ?? 'Title is missing'}</Typography>
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
                    <Grid container columnSpacing={2} rowSpacing={2} sx={{ alignItems: 'flex-end' }} >
                        {inputs.map(input => <Grid xs={input.xs ?? 12} sm={input.sm ?? 12} item key={input.key ?? null}>
                            <DynamicComponent
                                listInputs={inputs}
                                input={input}
                                setIsDisableSubmitButtonAndInputs={setIsDisableSubmitButtonAndInputs}
                            />
                        </Grid>
                        )}
                    </Grid>
                    {
                        props.children && <Box sx={{ marginTop: 2 }}>
                            {props.children}
                        </Box>
                    }
                </DialogContent>
                <DialogActions sx={{ padding: "20px 24px" }}>
                    <Button onClick={handleClose} variant="text" size="large">Annuler</Button>
                    <Button disabled={isDisableSubmitButton} onSubmit={handleSubmit} onClick={handleSubmit} variant="contained" size="large">Valider</Button>
                </DialogActions>
            </FormControl>
        </Dialog>
    </Box>
}

export default SingleForm;