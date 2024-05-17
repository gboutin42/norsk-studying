import { Autocomplete, TextField } from "@mui/material";
import PropTypes from 'prop-types'

CustomFormSelect.propTypes = {
    input: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default function CustomFormSelect(props) {
    const input = props.input
    const options = input.options

    const handleChange = (e, newValue) => {
        e.target.id = input.key
        if (props.onChange)
            props.onChange(e, newValue.value)
    }

    const getOptionValue = () => {
        return (options)
            ? options.find(option => option.value === input.value)?.label
            : null
    }

    return <Autocomplete
        key={input.key ?? null}
        id={input.key ?? null}
        autoHighlight
        autoComplete
        size="small"
        fullWidth={true}
        isOptionEqualToValue={(option, value) => option.label === value}
        options={options}
        value={getOptionValue()}
        onChange={handleChange}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.label + option.value}>
              {option.label}
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label={input.label ?? null} required={input.rules?.required ?? false} error={(!input.value && input.value !== 0 && input.rules?.required)} />}
    />
}