import { FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material"
import PropTypes from 'prop-types'

CustomFormRadio.propTypes = {
    input: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default function CustomFormRadio(props) {
    const input = props.input
    const options = input.options

    const handleChange = (e) => {
        if (props.onChange)
            props.onChange(e, e.target.value)
    }

    return <>
        <FormLabel
            key={input.key ?? null}
            id={input.key ?? null}
            required={input.rules?.required ?? false}
            error={(!input.value && input.value !== 0 && input.required)}
        >
            {input.label ?? null}
        </FormLabel>
        <RadioGroup
            aria-label="position"
            row={input.position === 'row'}
            value={input.value}
            onChange={handleChange}
        >
            {options.map(option => (
                <FormControlLabel
                    key={(option.label ?? null)}
                    control={
                        <Radio
                            id={input.key}
                            key={(option.label ?? null)}
                            checked={input.value == option.value}
                            value={option.value ?? null}
                            size="small"
                            name={option.label ?? null}
                        />
                    }
                    label={option.label ?? null}
                />
            ))}
        </RadioGroup>
    </>
}