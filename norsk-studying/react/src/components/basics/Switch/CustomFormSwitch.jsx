import { FormControlLabel, FormGroup, FormLabel, Switch } from "@mui/material"
import PropTypes from 'prop-types'

CustomFormSwitch.propTypes = {
    input: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default function CustomFormSwitch(props) {
    const input = props.input
    const options = input.options
    input.value = input.checked ?? false

    const handleChange = (e) => {
        if (props.onChange)
            props.onChange(e)
    }

    return <>
        <FormLabel
            key={input.key ?? null}
            id={input.key ?? null}
            required={input.rules?.required ?? false}
            error={((!input.value || input.value.length === 0) && input.rules?.required)}
        >
            {input.label ?? null}
        </FormLabel>
        <FormGroup aria-label="position" row={input.position === 'row'}>
            {options[0].label}
            <FormControlLabel
                key={(input.label ?? null)}
                value={input.value ?? false}
                control={
                    <Switch
                        id={input.key}
                        checked={input.checked ?? false}
                        size="small"
                        onChange={handleChange}
                        name={input.key}
                    />
                }
                sx={{
                    marginLeft: 2,
                    textTransform: 'none'
                }}
            />
            {options[1].label}
        </FormGroup>
    </>

}