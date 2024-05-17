import { DataGrid, frFR, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import AbortControllerSignal from '../../../components/providers/AbortController';
import { useEffect, useState } from 'react';
import axiosClient from '../../../axios';
import { renderDate } from '../../../components/functions/date';
import { Box, Chip } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AddUser from './form/AddUser';
import EditUser from './form/EditUser';

function displayAdmin(value) {
    const label = ["Utilisateur", "Administrateur"];
    const color = ["success", "info"];

    return <Chip label={label[value]} color={color[value]} sx={{ borderRadius: '4px', fontWeight: 700 }} />
}

function Users() {
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
            field: 'last_name',
            headerName: 'Nom',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
        },
        {
            field: 'first_name',
            headerName: 'Prénom',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'email',
            headerName: 'Email',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
        },
        {
            field: 'admin',
            headerName: 'Role',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: ({ value }) => displayAdmin(value)
        },
        {
            field: 'created_at',
            headerName: 'Date création',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
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
                    onClick={() => handleEditUser(params.row.id)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={params.row.admin === 1 ? <PersonRoundedIcon /> : <AdminPanelSettingsRoundedIcon />}
                    label={params.row.admin === 1 ? "Utilisateur" : "Admin"}
                    onClick={() => {
                        axiosClient.patch('users/' + params.row.id + '/admin')
                            .then(response => {
                                if (response.data.success) {
                                    const data = response.data.data
                                    setAlert('success', "Le statut est passé à " + (data.admin ? "admin" : "utilisateur"))
                                    getDatasTable()
                                } else
                                    setAlert('error', "Le statut n'a pu être modifié")
                            })
                    }}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteRoundedIcon />}
                    label="Supprimer"
                    onClick={() => {
                        axiosClient.delete('users/' + params.row.id)
                            .then(response => {
                                if (response.data.success) {
                                    setAlert('success', "Utilisateur supprimé")
                                    getDatasTable()
                                } else
                                    setAlert('error', "L'utilisateur' n'a pu être supprimé")
                            })
                    }}
                    showInMenu
                />
            ]
        }
    ]

    const handleEditUser = (id) => {
        setOpenEdit(true)
        setId(id)
    }

    const getDatasTable = (signal = null) => {
        if (!isLoadingData)
            setIsLoadingData(true)
        axiosClient.get('/users', { signal: signal })
            .then(response => {
                if (response.data && response.data.success && response.data?.data?.length > 0) {
                    setTable(response.data.data)
                    setIsLoadingData(false)
                } else
                    setAlert('warning', "Aucun utilisateurs n'a pu être récupérés")
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
        <AddUser getDatasTable={getDatasTable} />
        {openEdit &&
            <EditUser id={id} open={openEdit} setOpen={setOpenEdit} getDatasTable={getDatasTable} />
        }
    </Box>
}

export default Users;