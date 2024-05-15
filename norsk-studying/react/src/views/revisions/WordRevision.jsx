import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import AbortControllerSignal from "../../components/providers/AbortController";
import { useSnackbar } from "notistack";
import axiosClient from "../../axios";

function WordRevision({ type }) {
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
    const [origin, setOrigin] = useState({ id: null, norwegian: null, french: null, type: null, help: null, lang: null })
    const [value, setValue] = useState("")
    const [error, setError] = useState(false)
    const [pendingStatus, setPendingStatus] = useState(false)
    const [nbWords, setNbWords] = useState(0)
    const [getNewWord, setGetNewWord] = useState(true)
    const [nbErrorConsecutive, setNbErrorConsecutive] = useState(0)
    const [displayAnswer, setDisplayAnswer] = useState(false)

    useEffect(() => AbortControllerSignal([getWord]), [getNewWord])
    useEffect(() => {
        if (nbErrorConsecutive === 3)
            setDisplayAnswer(true)
    }, [nbErrorConsecutive])

    const reinitializeDefaultValues = () => {
        setError(false)
        setPendingStatus(true)
        setNbErrorConsecutive(0)
        setDisplayAnswer(false)
        setValue("")
    }

    const getWord = (signal) => {
        if (getNewWord) {
            reinitializeDefaultValues()
            axiosClient.get('/words/' + (origin.id !== null ? origin.id : 0) + '/' + type, { signal: signal })
                .then(response => {
                    if (response.data.success && response.data.data) {
                        const data = response.data.data
                        if (data.word) {
                            setOrigin({
                                id: data.word.id,
                                norwegian: data.word.norwegian,
                                french: data.word.french,
                                type: data.word.type,
                                help: data.word.help,
                                lang: data.lang
                            })
                            setPendingStatus(false)
                            setGetNewWord(false)
                        }
                        else
                            setAlert('info', "Aucun mot n'existe de manière active dans cette catégorie", { vertical: 'bottom', horizontal: 'right' })
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

    const handleChange = (e) => {
        e.preventDefault()
        setValue(e.target.value);
    };

    const handleSubmit = () => {
        setPendingStatus(true)

        axiosClient.post('/words/check-answer', {
            id: origin.id,
            lang: origin.lang,
            answer: value,
            type: origin.type
        }).then((response) => {
            setPendingStatus(false)
            if (response?.data?.success) {
                setNbWords(nbWords + 1)
                setGetNewWord(true)
                setAlert('success', 'Bien joué !', { vertical: 'top', horizontal: 'center' }, 1500)
            } else {
                setError(true)
                setNbErrorConsecutive(nbErrorConsecutive + 1)
                setAlert('error', 'Mauvaise réponse !', { vertical: 'top', horizontal: 'center' }, 1500)
            }
        })
    }

    const handleNewWord = (event) => {
        event.preventDefault()
        setGetNewWord(true)
    }

    return <>
        {
            getNewWord
                ? <Box display="flex" justifyContent='center' mt={8} mb={4}><CircularProgress size={60} /></Box>
                : <Typography variant="h3" sx={{ my: 4, fontWeight: 700, textAlign: 'center' }}>{origin[origin.lang]}</Typography>
        }

        {
            displayAnswer && <Typography variant="h3" sx={{ my: 4, fontWeight: 700, textAlign: 'center', color: 'green' }}>
                La bonne réponse était : {origin.lang === "french" ? origin.norwegian : origin.french}
            </Typography>
        }

        <TextField
            autoFocus
            key="answer"
            id="answer"
            type='text'
            label="Réponse"
            value={value}
            required={true}
            error={error}
            onChange={handleChange}
            variant="outlined"
            fullWidth={true}
            onKeyUp={handleKeyUp}
        />
        {
            (error && origin.help) && <Typography
                sx={{ mt: 2, color: 'blue', textAlign: 'center' }}
            >
                ( {origin.help} )
            </Typography>
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
                Nouveau mot
            </Button>
            <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={pendingStatus || displayAnswer}
                fullWidth
                sx={{ ml: 1 }}
            >
                Valider
            </Button>
        </Box>
        <Button
            size="large"
            fullWidth
            onClick={() => setDisplayAnswer(true)}
            disabled={pendingStatus || displayAnswer}
        >
            Révéler
        </Button>
        <Typography sx={{ mt: 2, fontWeight: 700, textAlign: 'center' }}>
            {nbWords === 0 ? "Vous n'avez encore aucune bonne réponse !" :
                "Vous avez révisés " + nbWords + " " + ((nbWords > 1) ? 'mots' : 'mot') + " dans cette catégorie pour le moment !"
            }
        </Typography>
    </>
}

export default WordRevision;