import { Checkbox, FormControlLabel, FormGroup, FormLabel } from "@mui/material"
import PropTypes from 'prop-types'

CustomFormCheckbox.propTypes = {
    input: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default function CustomFormCheckbox(props) {
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

    input.value = getCheckedOptions(options)

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
            {options.map(option => (
                <FormControlLabel
                    key={(option.label ?? null)}
                    value={input.value}
                    control={
                        <Checkbox
                            id={input.key}
                            checked={option.checked ?? false}
                            name={option.label ?? null}
                            value={option.value ?? null}
                            onChange={handleChange}
                        />
                    }
                    label={option.label ?? null}
                />
            ))}
        </FormGroup>
    </>
}