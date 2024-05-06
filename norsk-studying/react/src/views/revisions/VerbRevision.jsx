import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import AbortControllerSignal from "../../components/providers/AbortController";
import { useSnackbar } from "notistack";
import axiosClient from "../../axios";

function VerbRevision({ type }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const setAlert = (type, message, anchor, duration = 3000) => {
        enqueueSnackbar(
            message,
            {
                variant: type,
                anchorOrigin: {
                    vertical: anchor.vertical,
                    horizontal: anchor.horizontal
                },
                autoHideDuration: duration
            }
        )
    }
    const [origin, setOrigin] = useState(
        {
            id: null,
            translation: null,
            infinitiv: null,
            present: null,
            preteritum: null,
            perfektum: null,
            whichDisplayed: null
        }
    )
    const [answers, setAnswers] = useState(
        {
            translation: null,
            infinitiv: null,
            present: null,
            preteritum: null,
            perfektum: null,
        }
    )
    const [errors, setErrors] = useState([])
    const [pendingStatus, setPendingStatus] = useState(false)
    const [nbGoodAnswers, setNbGoodAnswer] = useState(0)
    const [getNewVerb, setGetNewVerb] = useState(true)
    const [nbErrorConsecutive, setNbErrorConsecutive] = useState(0)
    const [displayAnswers, setDisplayAnswers] = useState(false)
    const inputs = [
        "translation",
        "infinitiv",
        "present",
        "preteritum",
        "perfektum"
    ]

    useEffect(() => AbortControllerSignal([getWord]), [getNewVerb])
    useEffect(() => {
        if (nbErrorConsecutive === 3)
            setDisplayAnswers(true)
    }, [nbErrorConsecutive])

    const reinitializeDefaultValues = () => {
        setErrors([])
        setPendingStatus(true)
        setNbErrorConsecutive(0)
        setDisplayAnswers(false)
        setAnswers(
            {
                translation: null,
                infinitiv: null,
                present: null,
                preteritum: null,
                perfektum: null,
            }
        )
    }

    const getWord = (signal) => {
        if (getNewVerb) {
            reinitializeDefaultValues()
            axiosClient.get('/verbs/show/' + (origin.id !== null ? origin.id : 0), { signal: signal })
                .then(response => {
                    if (response.data.success && response.data.data) {
                        const data = response.data.data
                        if (data.verb) {
                            setOrigin(
                                {
                                    id: data.verb.id,
                                    translation: data.verb.translation,
                                    infinitiv: data.verb.infinitiv,
                                    present: data.verb.present,
                                    preteritum: data.verb.preteritum,
                                    perfektum: data.verb.perfektum,
                                    whichDisplayed: data.whichDisplayed
                                }
                            )
                            setAnswers({
                                ...{
                                    translation: null,
                                    infinitiv: null,
                                    present: null,
                                    preteritum: null,
                                    perfektum: null,
                                },
                                [data.whichDisplayed]: data.verb[data.whichDisplayed]
                            })
                            setPendingStatus(false)
                            setGetNewVerb(false)
                        }
                        else
                            setAlert('info', "Aucun verbe n'hexiste de manière active.", { vertical: 'bottom', horizontal: 'right' })
                    } else {
                        setAlert('warning', "Impossible de récupérer les données", { vertical: 'bottom', horizontal: 'right' })
                    }
                })
        }
    }

    const handleKeyUp = (e) => {
        e.preventDefault()
        const enterKey = 13
        if (e.keyCode === enterKey && pendingStatus === false)
            handleSubmit()
    }

    const handleChange = (e, input) => {
        e.preventDefault()
        setAnswers({ ...answers, [input]: e.target.value })
    };

    const handleSubmit = () => {
        setPendingStatus(true)

        axiosClient.post('/verbs/check-answer', {
            id: origin.id,
            answers
        }).then((response) => {
            setPendingStatus(false)
            if (response?.data?.success) {
                setNbGoodAnswer(nbGoodAnswers + 1)
                setGetNewVerb(true)
                setAlert('success', 'Bien joué !', { vertical: 'top', horizontal: 'center' }, 1500)
            } else {
                setErrors(response?.data?.data)
                setNbErrorConsecutive(nbErrorConsecutive + 1)
                setAlert('error', 'Mauvaise réponse !', { vertical: 'top', horizontal: 'center' }, 1500)
            }
        })
    }

    const handleNewWord = (event) => {
        event.preventDefault()
        setGetNewVerb(true)
    }

    const checkIfError = (input) => {
        return errors[input] && errors[input] === true;
    }

    const displayingVerbs = () => {
        const length = Object.values(origin).filter((o) => o !== null).length - 2
        return <Grid container spacing={2} mt={8} mb={4} sx={{ justifyContent: 'space-between' }}>
            {
                inputs.map((input) => {
                    if (origin[input])
                        return <Grid item lg={12 / length} md={12 / length} sm={12} xs={12}>
                            <TextField
                                key={{ input } + '-answer'}
                                id={{ input } + '-answer'}
                                type='text'
                                label={input.toUpperCase()}
                                value={(input === origin.whichDisplayed) ? origin[input] : null}
                                defaultValue={(input === origin.whichDisplayed) ? origin[input] : null}
                                InputProps={{
                                    readOnly: input === origin.whichDisplayed,
                                }}
                                required={origin[input] !== null}
                                error={checkIfError(input)}
                                onChange={(e) => handleChange(e, input)}
                                variant="outlined"
                                fullWidth={true}
                                onKeyUp={handleKeyUp}
                            />
                        </Grid>
                })
            }
        </Grid>
    }

    const displayingAnswers = () => {
        const goodAnswers = Object.entries(origin).filter((o) => o[1] !== null)
        const length = goodAnswers.length - 2
        return <Grid container spacing={2} mb={4} sx={{ justifyContent: 'space-between' }}>
            {
                goodAnswers.map((answer) => {
                    if (answer[0] !== 'id' && answer[0] !== 'whichDisplayed')
                        return <Grid item lg={12 / length} md={12 / length} sm={12} xs={12}>
                            <Box color='green' fontWeight={600} textAlign='center' p={2} sx={{ borderRadius: '4px', border: '2px solid green' }}>
                                {answer[1]}
                            </Box>
                        </Grid>
                })
            }
        </Grid>
    }

    return <>
        {
            getNewVerb
                ? <Box display="flex" justifyContent='center' mt={8} mb={4}><CircularProgress size={60} /></Box>
                : displayingVerbs()
        }

        {
            displayAnswers && <Box>
                <Typography variant="h3" sx={{ mt: 4, mb: 4, fontWeight: 700, textAlign: 'center', color: 'green' }}>
                    Les bonnes réponses sont :
                </Typography>
                {displayingAnswers()}
            </Box>
        }

        <Box display="flex" justifyContent="space-between" sx={{ mt: 2, mb: 2 }}>
            <Button
                variant="outlined"
                size="large"
                onClick={handleNewWord}
                disabled={pendingStatus}
                fullWidth
                sx={{ mr: 1 }}
            >
                Nouveau verbe
            </Button>
            <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={pendingStatus || displayAnswers}
                fullWidth
                sx={{ ml: 1 }}
            >
                Valider
            </Button>
        </Box>
        <Typography sx={{ mt: 2, fontWeight: 700, textAlign: 'center' }}>
            {nbGoodAnswers === 0 ? "Vous n'avez encore aucune bonne réponse !" :
                "Vous avez révisés " + nbGoodAnswers + " " + ((nbGoodAnswers > 1) ? 'verbes' : 'verbe') + " pour le moment !"
            }
        </Typography>
    </>
}

export default VerbRevision;