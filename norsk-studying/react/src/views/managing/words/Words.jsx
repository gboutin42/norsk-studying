import { DataGrid, frFR, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import AbortControllerSignal from '../../../components/providers/AbortController';
import { useEffect, useState } from 'react';
import axiosClient from '../../../axios';
import { Box, Chip } from '@mui/material';
import { renderDate } from '../../../components/functions/date';
import AddNewWord from './form/AddNewWord';
import EditWord from './form/EditWord';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';

function displayValueName(value) {
    const match = [
        { id: 1, name: "Tout" },
        { id: 2, name: "Verbe" },
        { id: 3, name: "Mot" },
        { id: 4, name: "Phrase" },
    ]

    return match.filter(v => v.id === value)[0].name
}
function displayStatus(value) {
    const label = ["Inactif", "Actif"];
    const color = ["error", "success"];

    return <Chip label={label[value]} color={color[value]} sx={{ borderRadius: '4px', fontWeight: 700 }} />
}

function Words() {
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
        pageSize: 10,
    });
    const [openEdit, setOpenEdit] = useState(false)
    const [id, setId] = useState(null)

    const columns = [
        {
            field: 'norwegian',
            headerName: 'Norvégiens',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
        },
        {
            field: 'french',
            headerName: 'Français',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'help',
            headerName: 'Aide',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
        },
        {
            field: 'type',
            headerName: 'Type',
            headerAlign: 'center',
            align: 'center',
            flex: 0.5,
            valueFormatter: ({ value }) => displayValueName(value)
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
                    onClick={() => handleEditWord(params.row.id)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={params.row.status === 1 ? <CloseRoundedIcon /> : <DoneRoundedIcon />}
                    label={params.row.status === 1 ? "Désactiver" : "Activer"}
                    onClick={() => {
                        axiosClient.patch('words/' + params.row.id + '/disable')
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
                        axiosClient.delete('words/' + params.row.id)
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

    const handleEditWord = (id) => {
        setOpenEdit(true)
        setId(id)
    }

    const getDatasTable = (signal = null) => {
        if (!isLoadingData)
            setIsLoadingData(true)
        axiosClient.get('/words', { signal: signal })
            .then(response => {
                if (response.data.success && response.data.data?.length > 0) {
                    setTable(response.data.data)
                    setIsLoadingData(false)
                } else {
                    setAlert('warning', "Impossible de récupérer les données")
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
            pageSizeOptions={[10, 20, 50, 100]}
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
        <AddNewWord getDatasTable={getDatasTable} />
        {openEdit &&
            <EditWord id={id} open={openEdit} setOpen={setOpenEdit} getDatasTable={getDatasTable} />
        }
    </Box>
}

export default Words;