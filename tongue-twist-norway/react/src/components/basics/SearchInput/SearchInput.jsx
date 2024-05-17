import { IconButton, InputAdornment, FormControl, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import './SearchInput.scss';

export default function SearchInput() {
    return <FormControl sx={{ width: "50ch" }} variant="outlined" size="small">
        <TextField
            label="Rechercher"
            id="search"
            size="small"
            fullWidth
            InputProps={{
                endAdornment: <InputAdornment position="end">
                    <IconButton aria-label="search icon" edge="end" >
                        <SearchIcon />
                    </IconButton>
                </InputAdornment>,
            }}
        />
    </FormControl>
}