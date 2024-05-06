import { FormLabel, ToggleButton, ToggleButtonGroup } from "@mui/material"
import { red } from "@mui/material/colors"
import PropTypes from 'prop-types'

CustomFormToggle.propTypes = {
    input: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default function CustomFormToggle(props) {
    const input = props.input
    const options = input.options

    const getCheckedOptions = (options) => {
        const values = []
        options.map(option => {
            if (option.checked)
                values.push(option.value)
        })

        return values
    }

    const values = getCheckedOptions(options)
    const toggleButtonErrorColor = ((!values || values.length === 0) && input.rules?.required) ? { borderColor: red[500], color: red[500] } : null

    const handleChange = (e, value) => {
        console.log(e)
        console.log(value)
        if (props.onChange)
            props.onChange(e, value)
    }

    return <>
        <FormLabel
            key={input.key ?? null}
            id={input.key ?? null}
            required={input.rules?.required ?? false}
            error={((!values || values.length === 0) && input.rules?.required)}
        >
            {input.label ?? null}
        </FormLabel>
        <ToggleButtonGroup
            color="primary"
            value={values}
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
