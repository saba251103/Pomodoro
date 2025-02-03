import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  DialogActions, 
  createTheme, 
  ThemeProvider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import PomodoroTimer from "./Pomodoro";
import { ChromePicker } from 'react-color';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});

const localizer = momentLocalizer(moment);

// Predefined color palette
const COLOR_PALETTE = [
  { name: 'Blue', color: '#0070F3' },
  { name: 'Green', color: '#17C964' },
  { name: 'Red', color: '#F31260' },
  { name: 'Yellow', color: '#F5A524' },
  { name: 'Purple', color: '#7828C8' },
];

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ 
    title: "", 
    start: null, 
    end: null,
    color: COLOR_PALETTE[0].color,
    description: ""
  });

  const handleSelectSlot = (slotInfo) => {
    setNewEvent({ 
      title: "", 
      start: slotInfo.start, 
      end: slotInfo.end,
      color: COLOR_PALETTE[0].color,
      description: ""
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({ ...event });
    setIsEditing(true);
    setOpen(true);
  };

  const handleAddEvent = () => {
    if (newEvent.title) {
      if (isEditing) {
        // Update existing event
        setEvents((prevEvents) => 
          prevEvents.map((event) => 
            event === selectedEvent ? newEvent : event
          )
        );
      } else {
        // Add new event
        setEvents((prevEvents) => [...prevEvents, newEvent]);
      }
      setOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents((prevEvents) => 
        prevEvents.filter((event) => event !== selectedEvent)
      );
      setOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleColorChange = (color) => {
    setNewEvent({ ...newEvent, color: color.hex });
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderColor: event.color,
        color: 'white',
        borderRadius: '4px',
        opacity: 0.8
      }
    };
  };

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          backgroundColor: "#f4f4f4", 
          minHeight: "100vh", 
          padding: "20px",
          backgroundImage: "url('https://i.pinimg.com/736x/0f/f4/9b/0ff49b9727bee0458f5590509744b3bb.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay"
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            backgroundImage: "url('https://i.pinimg.com/736x/0f/f4/9b/0ff49b9727bee0458f5590509744b3bb.jpg')",
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            borderRadius: "12px",
            overflow: "hidden"
          }}
        >
          <Typography
            variant="h3"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
          >
            Study Planner
          </Typography>
        </Box>

        {/* Pomodoro and Calendar Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: "20px",
            justifyContent: "center"
          }}
        >
          {/* Pomodoro Timer */}
          <Paper
            elevation={6}
            sx={{
              width: { xs: "100%", md: "40%" },
              padding: "20px",
              borderRadius: "12px",
              backgroundColor: "white"
            }}
          >
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              gutterBottom 
              sx={{ 
                textAlign: "center", 
                color: theme.palette.primary.main 
              }}
            >
              Pomodoro Timer
            </Typography>
            <PomodoroTimer />
          </Paper>

          {/* Calendar */}
          <Paper
            elevation={6}
            sx={{
              width: { xs: "100%", md: "60%" },
              padding: "20px",
              borderRadius: "12px",
              backgroundColor: "white"
            }}
          >
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              gutterBottom 
              sx={{ 
                textAlign: "center", 
                color: theme.palette.primary.main 
              }}
            >
              Study Calendar
            </Typography>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              style={{ 
                height: "50vh", 
                border: "1px solid #ddd", 
                borderRadius: "10px" 
              }}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              popup
            />
          </Paper>
        </Box>

        {/* Dialog for Adding/Editing Event */}
        <Dialog 
          open={open} 
          onClose={() => setOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>{isEditing ? "Edit Event" : "Add New Event"}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Event Title"
              fullWidth
              variant="outlined"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              sx={{ marginBottom: "15px" }}
            />
            <TextField
              margin="dense"
              label="Event Description"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              sx={{ marginBottom: "15px" }}
            />
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <InputLabel>Event Color</InputLabel>
              <Select
                value={newEvent.color}
                label="Event Color"
                onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
              >
                {COLOR_PALETTE.map((colorOption) => (
                  <MenuItem key={colorOption.name} value={colorOption.color}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: '20px', 
                          height: '20px', 
                          backgroundColor: colorOption.color,
                          borderRadius: '4px'
                        }} 
                      />
                      {colorOption.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="subtitle2" sx={{ marginBottom: "10px" }}>
              Or pick a custom color:
            </Typography>
            <ChromePicker
              color={newEvent.color}
              onChange={handleColorChange}
              disableAlpha
            />
          </DialogContent>
          <DialogActions>
            {isEditing && (
              <Button 
                onClick={handleDeleteEvent} 
                color="error"
                variant="outlined"
                sx={{ marginRight: "auto" }}
              >
                Delete
              </Button>
            )}
            <Button 
              onClick={() => setOpen(false)} 
              color="secondary"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddEvent} 
              color="primary" 
              variant="contained"
            >
              {isEditing ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default MyCalendar;