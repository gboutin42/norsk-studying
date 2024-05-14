import AbortControllerSignal from "../../../../components/providers/AbortController"
import SingleForm from "../../../../components/basics/Form/Single/SingleForm"
import { useEffect, useState } from "react";
import axiosClient from "../../../../axios";

export default function EditWord(props) {
    console.log("on rentre ?")
    console.log(props)
    const [listInputs, setListInputs] = useState(null);

    const getForm = (signal = null) => {
        console.log("on rentre ? 2")
        console.log(props.id)
        axiosClient.get('/words/form/' + props.id, { signal: signal })
            .then(response => {
                console.log(response.data)
                if (response.data.success)
                    setListInputs(response.data.fields)
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
        axiosClient.patch("/words/edit/" + props.id, data)
            .then(response => {
                console.log(response)
                if (response.data.success) {
                    props.getDatasTable()
                    setAlert('success', "Produit modifié avec succès")
                } else {
                    setAlert('error', "Le produit n'a pu être modifié")
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
        title="Edition du mot"
    />
}