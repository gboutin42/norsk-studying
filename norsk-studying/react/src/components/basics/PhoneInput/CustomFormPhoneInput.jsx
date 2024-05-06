import { TextField } from "@mui/material"
import { MuiTelInput } from 'mui-tel-input'
import PropTypes from 'prop-types'
import { useState } from "react"

CustomFormPhoneInput.propTypes = {
    input: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default function CustomFormPhoneInput(props) {
    const input = props.input
    const [country, setCountry] = useState('FR')
    const [value, setValue] = useState(input.value)

    const handleChange = (newValue, info) => {
        console.log(info)
        console.log(newValue)
        setCountry(info.countryCode)
        setValue(info.numberValue)

        if (props.onChange)
            props.onChange(input.key, info.numberValue)
    }

    return <MuiTelInput
        key={input.key ?? null}
        id={input.key ?? null}
        label={input.label ?? null}
        value={value ?? ''}
        variant="outlined"
        size="small"
        fullWidth={true}
        inputMode="tel"
        forceCallingCode
        defaultCountry={country}
        required={input.rules?.required ?? false}
        onChange={handleChange}
    />
    // return <TextField
    //     key={input.key ?? null}
    //     id={input.key ?? null}
    //     type={input.type ?? 'text'}
    //     inputProps={{
    //         min: (input.type === 'number' && (input.rules?.min || parseInt(input.rules?.min) === 0))
    //             ? input.rules.min
    //             : null,
    //         max: (input.type === 'number' && (input.rules?.max || parseInt(input.rules?.max) === 0))
    //             ? input.rules.max
    //             : null,
    //         inputMode: (input.type === 'number' && input.rules?.inputMode)
    //             ? input.rules?.inputMode
    //             : null,
    //     }}
    //     label={input.label ?? null}
    //     value={input.value ?? ''}
    //     required={input.rules?.required ?? false}
    //     error={(!input.value && input.value !== 0 && input.rules?.required)}
    //     onChange={handleChange}
    //     variant="outlined"
    //     size="small"
    //     fullWidth={true}
    //     multiline={input.rules?.multiline ?? false}
    //     maxRows={input.rules?.multiline && input.rules?.maxRows ? input.rules?.maxRows : null}
    // />
}