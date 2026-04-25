import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
} from "@mui/material";
import PropTypes from "prop-types";

const FilterInput = (props) => {
  const { id, label, value, options, handleSelect } = props;

  return (
    <Box sx={{ width: 150 }}>
      <FormControl fullWidth>
        <InputLabel id={id}>{label}</InputLabel>
        <Select labelId={id} id={id} label={label}>
          {options.map((item) => {
            const labelId = `checkbox-list-label-${item}`;
            return (
              <ListItem key={item} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={() => handleSelect(item)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      tabIndex={-1}
                      checked={value.includes(item)}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={item} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

FilterInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.array,
  options: PropTypes.array,
  handleSelect: PropTypes.func,
};

export default FilterInput;
