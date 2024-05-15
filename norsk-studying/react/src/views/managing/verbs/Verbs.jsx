import { DataGrid, frFR, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import AbortControllerSignal from '../../../components/providers/AbortController';
import { useEffect, useState } from 'react';
import axiosClient from '../../../axios';
import { Box, Chip } from '@mui/material';
import { renderDate } from '../../../components/functions/date';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import EditVerb from './form/EditVerb';
import AddVerb from './form/AddVerb';

function displayStatus(value) {
    const label = ["Inactif", "Actif"];
    const color = ["error", "success"];

    return <Chip label={label[value]} color={color[value]} sx={{ borderRadius: '4px', fontWeight: 700 }} />
}

function Verbs() {
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
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [table, setTable] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const [openEdit, setOpenEdit] = useState(false)
    const [id, setId] = useState(null)

    const columns = [
        {
            field: 'translation',
            headerName: 'Français',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
        },
        {
            field: 'infinitiv',
            headerName: 'Infinitif',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'present',
            headerName: 'Présent',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
        },
        {
            field: 'preteritum',
            headerName: 'Preteritum',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            valueFormatter: ({ value }) => value ?? '---'
        },
        {
            field: 'perfektum',
            headerName: 'Perfectum',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            valueFormatter: ({ value }) => value ?? '---'
        },
        {
            field: 'status',
            headerName: 'Statut',
            headerAlign: 'center',
            align: 'center',
            flex: 0.5,
            renderCell: ({ value }) => displayStatus(value)
        },
        {
            field: 'updated_at',
            headerName: 'Date mise à jour',
            headerAlign: 'center',
            align: 'center',
            flex: 0.75,
            type: 'date',
            valueFormatter: ({ value }) => renderDate(value)
        },
        {
            field: 'created_at',
            headerName: 'Date création',
            headerAlign: 'center',
            align: 'center',
            flex: 0.75,
            type: 'date',
            valueFormatter: ({ value }) => renderDate(value)
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            headerAlign: 'center',
            align: 'center',
            width: 80,
            cellClassName: 'actions',
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditRoundedIcon />}
                    label="Modifier"
                    onClick={() => handleEditVerb(params.row.id)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={params.row.status === 1 ? <CloseRoundedIcon /> : <DoneRoundedIcon />}
                    label={params.row.status === 1 ? "Désactiver" : "Activer"}
                    onClick={() => {
                        axiosClient.patch('verbs/' + params.row.id + '/disable')
                            .then(response => {
                                if (response.data.success) {
                                    const data = response.data.data
                                    setAlert('success', "Mot " + (data.status ? "activé" : "désactivé"))
                                    getDatasTable()
                                } else
                                    setAlert('error', "Le statut du mot n'a pu être modifié")
                            })
                    }}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteRoundedIcon />}
                    label="Supprimer"
                    onClick={() => {
                        axiosClient.delete('verbs/' + params.row.id)
                            .then(response => {
                                if (response.data.success) {
                                    setAlert('success', "Mot supprimé")
                                    getDatasTable()
                                } else
                                    setAlert('error', "Le mot n'a pu être supprimé")
                            })
                    }}
                    showInMenu
                />
            ]
        }
    ]

    const handleEditVerb = (id) => {
        setOpenEdit(true)
        setId(id)
    }

    const getDatasTable = (signal = null) => {
        if (!isLoadingData)
            setIsLoadingData(true)
        axiosClient.get('/verbs', { signal: signal })
            .then(response => {
                console.log(response)
                if (response.data.success && response.data.data?.length > 0) {
                    setTable(response.data.data)
                    setIsLoadingData(false)
                } else {
                    setAlert('warning', "Impossible de récupérer les données")
                    setTable([])
                    setIsLoadingData(false)
                }
            })
            .catch((error) => {
                if (error.code !== "ERR_CANCELED") {
                    setAlert('error', "Une erreur est survenue pendant la réupération des datas")
                    setTable([])
                    setIsLoadingData(false)
                }
            })
    }

    useEffect(() => AbortControllerSignal([getDatasTable]), [])

    return <Box height="inherit" width="inherit">
        <DataGrid
            // checkboxSelection
            columns={columns}
            rows={table}
            sx={{ boxShadow: 5 }}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pagination
            loading={isLoadingData}
            localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
                toolbar: {
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { disableToolbarButton: true },
                    showQuickFilter: true,
                },
            }}
            disableColumnSelector
            disableDensitySelector
        />
        <AddVerb getDatasTable={getDatasTable} />
        {openEdit &&
            <EditVerb id={id} open={openEdit} setOpen={setOpenEdit} getDatasTable={getDatasTable} />
        }
    </Box>
}

export default Verbs;