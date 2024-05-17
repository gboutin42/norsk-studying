import { FormLabel, ToggleButton, ToggleButtonGroup } from "@mui/material"
import PropTypes from 'prop-types'
import { red } from "@mui/material/colors"

CustomFormToggleRadio.propTypes = {
    input: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default function CustomFormToggleRadio(props) {
    const input = props.input
    const options = input.options
    const toggleButtonErrorColor = (!input.value && input.value !== 0 && input.rules?.required) ? { borderColor: red[500], color: red[500] } : null

    const handleChange = (e, newValue) => {
        if (props.onChange && newValue)
            props.onChange(e, newValue)
    }

    return <>
        <FormLabel
            key={input.key ?? null}
            id={input.key ?? null}
            required={input.rules?.required ?? false}
            error={input.rules?.required}
        >
            {input.label ?? null}
        </FormLabel>
        <ToggleButtonGroup
            color="primary"
            value={input.value}
            exclusive
            onChange={handleChange}
            aria-label={input.label ?? null}
            size="small"
            fullWidth
        >
            {
                options.map(option => (
                    <ToggleButton
                        id={input.key}
                        key={(option.label ?? null)}
                        value={option.value ?? null}
                        sx={toggleButtonErrorColor}
                    >
                        {option.label ?? null}
                    </ToggleButton>
                ))
            }
        </ToggleButtonGroup>
    </>
}
