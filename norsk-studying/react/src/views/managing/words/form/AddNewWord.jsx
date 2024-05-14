import { Button, Zoom } from "@mui/material"
import AbortControllerSignal from "../../../../components/providers/AbortController"
import SingleForm from "../../../../components/basics/Form/Single/SingleForm"
import { useEffect, useState } from "react";
import axiosClient from "../../../../axios";

export default function AddNewWord(props) {
    const [formOpen, setFormOpen] = useState(false)
    const [listInputs, setListInputs] = useState(null);

    const getForm = (signal = null) => {
        axiosClient.get('/words/form', { signal: signal })
            .then(response => {
                console.log(response.data)
                if (response.data.success)
                    setListInputs(response.data.fields)
            })
    }

    useEffect(() => {
        AbortControllerSignal([getForm])
    }, [])

    const handleOpenForm = () => setFormOpen(true)
    const handleCloseForm = () => setFormOpen(false)
    const handleSubmit = (inputs) => {
        setListInputs(inputs)
        let data = {}
        inputs.map((input) => {
            if (input.value !== undefined)
                data = { ...data, [input.key]: input.value }
        })
        axiosClient.post("/words", data)
            .then(response => {
                console.log(response)
                if (response.data.success) {
                    props.getDatasTable()
                    setAlert('success', "Produit créé avec succès")
                } else {
                    setAlert('error', "Le produit n'a pu être créé")
                }
            })
            .catch(error => {
                setAlert('error', error)
            })

    }

    return <>
        <Zoom in={listInputs !== null}>
            <Button variant='contained' sx={{ marginTop: 2 }} onClick={handleOpenForm}>
                Nouveau mot
            </Button>
        </Zoom>
        {
            formOpen && <SingleForm
                onClose={handleCloseForm}
                onSubmit={handleSubmit}
                listInputs={listInputs}
                open={formOpen}
                title="Nouveau mot"
            />
        }
    </>
}