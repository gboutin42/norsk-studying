
import CustomFormTextfield from '../Textfield/CustomFormTextfield'
import CustomFormSelect from '../Select/CustomFormSelect'
import CustomFormRadio from '../Radio/CustomFormRadio'
import CustomFormSwitch from '../Switch/CustomFormSwitch'
import CustomFormCheckbox from '../Checkbox/CustomFormCheckbox'
import CustomFormToggle from '../Toggle/CustomFormToggle'
import CustomFormToggleRadio from '../Toggle/CustomFormToggleRadio'
import CustomFormDatePicker from '../DatePicker/CustomFormDatePicker'
import PropTypes from 'prop-types'
import CustomFormTimePicker from '../TimePicker/CustomFormTimePicker'
import CustomFormPhoneInput from '../PhoneInput/CustomFormPhoneInput'

DynamicComponent.propTypes = {
    listInputs: PropTypes.array.isRequired,
    input: PropTypes.any,
    index: PropTypes.number,
    setIsDisableSubmitButtonAndInputs: PropTypes.func.isRequired,
}

export default function DynamicComponent(props) {
    const inputs = props.listInputs

    const handleChangeBasic = (e, newValue) => {
        let newInputs = [...inputs];
        const target = e.target
        const id = target ? target.id : e.id ?? e.key
        const name = target ? target.name : e.id ?? e.key

        inputs.map((input, index) => {
            if (newInputs[index].key === id || newInputs[index].key === name) {
                newInputs[index].value = newValue
            }
        })

        props.setIsDisableSubmitButtonAndInputs(newInputs)
    }

    const handleChangeTextfield = (e, newValue) => {
        handleChangeBasic(e, newValue)
    }

    const handleChangeSelect = (e, newValue) => {
        handleChangeBasic(e, newValue)
    }

    const handleChangeRadio = (e, newValue) => {
        handleChangeBasic(e, newValue)
    }

    const handleChangeToggleRadio = (e, newValue) => {
        handleChangeBasic(e, newValue)
    }

    const handleChangeToggle = (e) => {
        let newInputs = [...inputs];
        const target = e.target
        const value = target.value
        const id = target.id
        const name = target.name

        inputs.map((input, index) => {
            if (newInputs[index].key === id || newInputs[index].key === name) {
                let values = []
                if (newInputs[index].value !== undefined) {
                    if (typeof (newInputs[index].value) === 'object')
                        newInputs[index].value.map(v => {
                            values.push(v)
                        })
                    else
                        values.push(newInputs[index].value.toString())
                }
                values.includes(value) ? values = values.filter(v => v !== value) : values.push(value)
                newInputs[index].value = values
                newInputs[index].options.map(option => {
                    if (option.value == value)
                        option.checked = !option.checked
                })
            }
        })

        props.setIsDisableSubmitButtonAndInputs(newInputs)
    }

    const handleChangeSwitch = (e) => {
        let newInputs = [...inputs];
        const target = e.target
        const type = target.type
        const checked = type === 'checkbox' ? target.checked : null
        const id = target.id
        const name = target.name

        inputs.map((input, index) => {
            if (newInputs[index].key === id || newInputs[index].key === name) {
                newInputs[index].value = checked
                newInputs[index].checked = checked
            }
        })

        props.setIsDisableSubmitButtonAndInputs(newInputs)
    }

    const handleChangeCheckbox = (e) => {
        let newInputs = [...inputs];
        const target = e.target
        const type = target.type
        const value = target.value
        const checked = type === 'checkbox' ? target.checked : null
        const id = target.id
        const name = target.name

        inputs.map((input, index) => {
            if (newInputs[index].key === id || newInputs[index].key === name) {
                let values = []
                if (newInputs[index].value !== undefined) {
                    if (typeof (newInputs[index].value) === 'object')
                        newInputs[index].value.map(v => {
                            values.push(v)
                        })
                    else
                        values.push(newInputs[index].value.toString())
                }
                checked ? values.push(value) : values = values.filter(v => v !== value)
                newInputs[index].value = values
                newInputs[index].checked = checked
                newInputs[index].options.map(option => {
                    if (option.value == value)
                        option.checked = !option.checked
                })
            }
        })

        props.setIsDisableSubmitButtonAndInputs(newInputs)
    }

    const handleChangeDatePicker = (e, newValue) => {
        handleChangeBasic(e, newValue)
    }

    const handleChangeTimePicker = (e, newValue) => {
        handleChangeBasic(e, newValue)
    }

    const handleChangePhoneInput = (key, newValue) => {
        let newInputs = [...inputs];

        inputs.map((input, index) => {
            if (newInputs[index].key === key)
                newInputs[index].value = newValue
        })

        props.setIsDisableSubmitButtonAndInputs(newInputs)
    }

    const dynamicComponent = (input) => {
        switch (input.type) {
            case 'checkbox':
                return <CustomFormCheckbox input={input} onChange={handleChangeCheckbox} />
            case 'switch':
                return <CustomFormSwitch input={input} onChange={handleChangeSwitch} />
            case 'radio':
                return <CustomFormRadio input={input} onChange={handleChangeRadio} />
            case 'toggle':
                return <CustomFormToggle input={input} onChange={handleChangeToggle} />
            case 'toggleRadio':
                return <CustomFormToggleRadio input={input} onChange={handleChangeToggleRadio} />
            case 'select':
                return <CustomFormSelect input={input} onChange={handleChangeSelect} />
            case 'date':
                return <CustomFormDatePicker input={input} onChange={handleChangeDatePicker} />
            case 'time':
                return <CustomFormTimePicker input={input} onChange={handleChangeTimePicker} />
            case 'phone':
                return <CustomFormPhoneInput input={input} onChange={handleChangePhoneInput} />
            default:
                return <CustomFormTextfield input={input} onChange={handleChangeTextfield} />
        }
    }

    return dynamicComponent(props.input)
}

