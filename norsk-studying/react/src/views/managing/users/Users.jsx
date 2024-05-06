import { DataGrid, frFR, GridToolbar } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import AbortControllerSignal from '../../../components/providers/AbortController';
import { useEffect, useState } from 'react';
import axiosClient from '../../../axios';

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
            field: 'role',
            headerName: 'Role',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
        },
        {
            field: 'created_at',
            headerName: 'Date création',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            type: 'date'
        }
    ]

    const getDatasTable = (signal = null) => {
        if (!isLoadingData)
            setIsLoadingData(true)
        axiosClient.get('/users', { signal: signal })
            .then(response => {
                if (response.success && response.data?.items?.length > 0) {
                    setTable(response.data.items)
                    setIsLoadingData(false)
                } else
                    setAlert('warning', "Aucun utilisateurs n'a pu être récupérés")
            }).catch(error => {
                setAlert('warning', "Aucun utilisateurs n'a pu être récupérés")
            })
    }

    useEffect(() => AbortControllerSignal([getDatasTable]), [])

    return <>
        <DataGrid
            checkboxSelection
            getRowId={(row) => row.id_gcc_cmde}
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

export default Users;