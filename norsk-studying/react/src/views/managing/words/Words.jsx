import { DataGrid, frFR, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import AbortControllerSignal from '../../../components/providers/AbortController';
import { useEffect, useState } from 'react';
import axiosClient from '../../../axios';
import { Chip } from '@mui/material';
import { renderDate } from '../../../components/functions/date';

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
        pageSize: 5,
    });

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
                    // icon={<EditIcon />}
                    label="Modifier"
                    onClick={() => {
                        // setUserId(params.row.id_user)
                        // LeonixApi.Get("users/" + params.row.id_user + "/form", { userType: "user" })
                        //     .then(response => {
                        //         if (response.success) {
                        //             setListInputsUpdate(response.data.fields)
                        //             handleOpenFormUpdate()
                        //         } else
                        //             setAlert('warning', "Impossible de récupérer les informations du formulaire")
                        //     })
                    }}
                    showInMenu
                />,
                <GridActionsCellItem
                    // icon={<PersonOffIcon />}
                    label="Désactiver"
                    onClick={() => {
                        // LeonixApi.Patch('users/' + params.row.id_user + '/disable')
                        //     .then(response => {
                        //         if (response.success) {
                        //             setAlert('success', "Utilisateur désactivé")
                        //             getDatasTable()
                        //         } else
                        //             setAlert('error', "L'Utilisateur n'a pu être désactivé")
                        //     })
                    }}
                    showInMenu
                />,
                <GridActionsCellItem
                    // icon={<PersonOffIcon />}
                    label="Supprimer"
                    onClick={() => {
                        // LeonixApi.Patch('users/' + params.row.id_user + '/disable')
                        //     .then(response => {
                        //         if (response.success) {
                        //             setAlert('success', "Utilisateur désactivé")
                        //             getDatasTable()
                        //         } else
                        //             setAlert('error', "L'Utilisateur n'a pu être désactivé")
                        //     })
                    }}
                    showInMenu
                />
            ]
        }
    ]

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

    return <>
        <DataGrid
            checkboxSelection
            autoHeight
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
    </>
}

export default Words;