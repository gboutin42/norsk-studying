import AbortControllerSignal from "../../../../components/providers/AbortController"
import SingleForm from "../../../../components/basics/Form/Single/SingleForm"
import { useEffect, useState } from "react";
import axiosClient from "../../../../axios";
import { useSnackbar } from "notistack";

export default function EditVerb(props) {
    const baseUrl = '/verbs/' + props.id
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const setAlert = (type, message) => {
        enqueueSnackbar(
            message,
            {
                variant: type,
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            }
        )
    }
    const [listInputs, setListInputs] = useState(null);

    const getForm = (signal = null) => {
        axiosClient.get(baseUrl + '/form', { signal: signal })
            .then(response => {
                if (response.data.success)
                    setListInputs(response.data.fields)
                else
                    setAlert('error', "Impossible de récupérer les informations du formulaire")
            })
    }

    useEffect(() => {
        AbortControllerSignal([getForm])
    }, [props])

    const handleCloseForm = () => props.setOpen(false)
    const handleSubmit = (inputs) => {
        setListInputs(inputs)
        let data = {}
        inputs.map((input) => {
            if (input.value !== undefined)
                data = { ...data, [input.key]: input.value }
        })
        axiosClient.patch(baseUrl, data)
            .then(response => {
                if (response.data.success) {
                    props.getDatasTable()
                    setAlert('success', "Verbe modifié avec succès")
                } else {
                    setAlert('error', "Le verbe n'a pu être modifié")
                }
            })
            .catch(error => {
                setAlert('error', error)
            })

    }

    return (props.open && listInputs) && <SingleForm
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        listInputs={listInputs}
        open={props.open}
        title="Edition du verbe"
    />
}