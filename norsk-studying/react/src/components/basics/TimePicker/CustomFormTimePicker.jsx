
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

CustomFormTimePicker.propTypes = {
    input: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default function CustomFormTimePicker(props) {
    const input = props.input
    const [value, setValue] = useState(input?.value ? dayjs(input.value) : null)

    const handleChange = (newValue) => {
        setValue(newValue)
        if (props.onChange)
            props.onChange(input, newValue)
    }

    // const disableDate = (date) => {
    //     if (input?.rules?.disableDates) {
    //         const disableDates = input.rules.disableDates
    //         if (disableDates.weekdays) {
    //             const day = date.day()
    //             if (typeof disableDates.weekdays === "object" && disableDates.weekdays.includes(day))
    //                 return true
    //             if (disableDates.weekdays === "weekend" && (day === 0 || day === 6))
    //                 return true
    //         }
    //         if (disableDates.before && date.isBefore(dayjs(disableDates.before)))
    //             return true
    //         if (disableDates.after && date.isAfter(dayjs(disableDates.after)))
    //             return true
    //         if (typeof disableDates.specifics === "object" && disableDates.specifics.includes(date.format("YYYY-MM-DD")))
    //             return true
    //     }

    //     return null
    // }

    return <div
        key={input.key ?? null}
        id={input.key ?? null}
    >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            {/* <DatePicker
                key={input.key ?? null}
                id={input.key ?? null}
                label={input.label ?? null}
                value={value ?? null}
                views={['year', 'month', 'day']}
                disableFuture={input.rules?.disableFuture ?? false}
                disablePast={input.rules?.disablePast ?? false}
                shouldDisableDate={input.rules?.disableDates ? disableDate : null}
                slotProps={{ textField: { size: 'small' } }}
                onChange={handleChange}
                minDate={dayjs().year(2000).month(0)}
                sx={{ width: "100%" }}
            /> */}
            <TimePicker
                key={input.key ?? null}
                id={input.key ?? null}
                label={input.label ?? null}
                value={value ?? null}
                slotProps={{ textField: { size: 'small' } }}
                onChange={handleChange}
                sx={{ width: "100%" }}
                viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                }}
            />
        </LocalizationProvider>
    </div>
}