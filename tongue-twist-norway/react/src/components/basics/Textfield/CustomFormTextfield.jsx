import { TextField } from "@mui/material"
import PropTypes from 'prop-types'

CustomFormTextfield.propTypes = {
    input: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default function CustomFormTextfield(props) {
    const input = props.input

    const handleChange = (e) => {
        if (props.onChange)
            props.onChange(e, e.target.value)
    }

    return <TextField
        key={input.key ?? null}
        id={input.key ?? null}
        type={input.type ?? 'text'}
        inputProps={{
            min: (input.type === 'number' && (input.rules?.min || parseInt(input.rules?.min) === 0))
                ? input.rules.min
                : null,
            max: (input.type === 'number' && (input.rules?.max || parseInt(input.rules?.max) === 0))
                ? input.rules.max
                : null,
            inputMode: (input.type === 'number' && input.rules?.inputMode)
                ? input.rules?.inputMode
                : null,
        }}
        label={input.label ?? null}
        value={input.value ?? ''}
        required={input.rules?.required ?? false}
        error={(!input.value && input.value !== 0 && input.rules?.required)}
        onChange={handleChange}
        variant="outlined"
        size="small"
        fullWidth={true}
        multiline={input.rules?.multiline ?? false}
        maxRows={input.rules?.multiline && input.rules?.maxRows ? input.rules?.maxRows : null}
    />
}