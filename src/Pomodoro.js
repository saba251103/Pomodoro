import { useState, useEffect } from "react";
import { 
  Button, 
  ToggleButton, 
  ToggleButtonGroup, 
  Typography, 
  Box, 
  Slider, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Tooltip
} from "@mui/material";
import { 
  Refresh, 
  Settings, 
  CheckCircle, 
  LightMode, 
  DarkMode, 
  VolumeUp,
  Timer,
  Coffee,
  Bedtime
} from "@mui/icons-material";
import { Howl } from "howler";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Correct import paths for sound files
import defaultSound from '../src/notification.mp3';
import bellSound from '../src/bell.mp3';
import chimeSound from '../src/chime.mp3';

const PomodoroTimer = () => {
  const getStoredData = (key, defaultValue) => JSON.parse(localStorage.getItem(key)) || defaultValue;

  const [mode, setMode] = useState("pomodoro");
  const [durations, setDurations] = useState(getStoredData("durations", { pomodoro: 25 * 60, short: 5 * 60, long: 15 * 60 }));
  const [time, setTime] = useState(durations.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(getStoredData("completedPomodoros", 0));
  const [theme, setTheme] = useState(getStoredData("theme", "dark"));
  
  // Update sound paths to use imported files
  const sounds = {
    Default: defaultSound,
    Bell: bellSound,
    Chime: chimeSound,
  };

  const [selectedSound, setSelectedSound] = useState(getStoredData("sound", defaultSound));

  const notificationSound = new Howl({ src: [selectedSound] });

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0) {
      notificationSound.play();
      setIsRunning(false);
      if (mode === "pomodoro") {
        setCompletedPomodoros((prev) => {
          localStorage.setItem("completedPomodoros", JSON.stringify(prev + 1));
          return prev + 1;
        });
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, time, mode, selectedSound]);

  const handleModeChange = (event, newMode) => {
    if (newMode) {
      setMode(newMode);
      setIsRunning(false);
      setTime(durations[newMode]);
    }
  };

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

  const updateDuration = (newValue, mode) => {
    const updatedDurations = { ...durations, [mode]: newValue * 60 };
    setDurations(updatedDurations);
    localStorage.setItem("durations", JSON.stringify(updatedDurations));
    if (mode === "pomodoro") setTime(newValue * 60);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", JSON.stringify(newTheme));
  };

  const updateSound = (newSound) => {
    setSelectedSound(newSound);
    localStorage.setItem("sound", JSON.stringify(newSound));
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: theme === "dark" 
          ? "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://source.unsplash.com/1600x900/?workspace,night')" 
          : "linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url('https://source.unsplash.com/1600x900/?workspace,morning')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: theme === "dark" ? "white" : "black",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Theme Toggle Button */}
      <Tooltip title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}>
        <IconButton 
          sx={{ 
            position: "absolute", 
            top: 20, 
            right: 20, 
            zIndex: 2,
            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
            "&:hover": { 
              backgroundColor: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" 
            }
          }} 
          onClick={toggleTheme}
        >
          {theme === "dark" ? <LightMode sx={{ color: "yellow" }} /> : <DarkMode sx={{ color: "black" }} />}
        </IconButton>
      </Tooltip>

      {/* Main Container */}
      <Box 
        sx={{
          width: "80%",
          maxWidth: "1000px",
          backgroundColor: theme === "dark" ? "rgba(30,30,30,0.8)" : "rgba(240,240,240,0.8)",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        {/* Pomodoro Controls */}
        <ToggleButtonGroup 
          value={mode} 
          exclusive 
          onChange={handleModeChange} 
          sx={{ 
            backgroundColor: theme === "dark" ? "rgba(50,50,50,0.5)" : "rgba(200,200,200,0.3)", 
            borderRadius: "20px", 
            p: 1 
          }}
        >
          <ToggleButton value="pomodoro" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Timer /> Pomodoro
          </ToggleButton>
          <ToggleButton value="short" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Coffee /> Short Break
          </ToggleButton>
          <ToggleButton value="long" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Bedtime /> Long Break
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Circular Timer */}
        <Box sx={{ width: "250px", height: "250px" }}>
          <CircularProgressbar
            value={(time / durations[mode]) * 100}
            text={formatTime(time)}
            styles={buildStyles({
              textColor: theme === "dark" ? "white" : "black",
              pathColor: "#4caf50",
              trailColor: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
              textSize: "24px",
            })}
          />
        </Box>

        {/* Start/Reset Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ 
              fontSize: "1.2rem", 
              borderRadius: "30px", 
              px: 4, 
              py: 1.5,
              transition: "all 0.3s ease",
              "&:hover": { transform: "scale(1.05)" }
            }} 
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Tooltip title="Reset Timer">
            <Refresh 
              sx={{ 
                fontSize: 32, 
                cursor: "pointer", 
                color: theme === "dark" ? "white" : "black",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "rotate(180deg)" }
              }} 
              onClick={() => setTime(durations[mode])} 
            />
          </Tooltip>
          <Tooltip title="Timer Settings">
            <Settings 
              sx={{ 
                fontSize: 32, 
                cursor: "pointer", 
                color: theme === "dark" ? "white" : "black",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "rotate(45deg)" }
              }} 
              onClick={() => setShowSettings(!showSettings)} 
            />
          </Tooltip>
        </Box>

        {/* Completed Pomodoros */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle sx={{ fontSize: 30, color: "#4caf50" }} />
          <Typography variant="h6">Completed Pomodoros: {completedPomodoros}</Typography>
        </Box>

        {/* Sound Selection */}
        <Box sx={{ mt: 2 }}>
          <Typography>Notification Sound:</Typography>
          <ToggleButtonGroup 
            value={selectedSound} 
            exclusive 
            onChange={(e, newSound) => updateSound(newSound)}
            sx={{ mt: 1 }}
          >
            {Object.keys(sounds).map((key) => (
              <ToggleButton key={key} value={sounds[key]}>{key}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Settings Dialog */}
        <Dialog 
          open={showSettings} 
          onClose={() => setShowSettings(false)}
          PaperProps={{
            sx: {
              backgroundColor: theme === "dark" ? "#1e1e1e" : "#f0f0f0",
              color: theme === "dark" ? "white" : "black",
            }
          }}
        >
          <DialogTitle>Timer Settings</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              {/* Pomodoro Duration Slider */}
              <Box>
                <Typography gutterBottom>Pomodoro Duration (minutes)</Typography>
                <Slider
                  value={durations.pomodoro / 60}
                  min={10}
                  max={60}
                  step={1}
                  valueLabelDisplay="auto"
                  onChange={(e, newValue) => updateDuration(newValue, 'pomodoro')}
                />
              </Box>
              
              {/* Short Break Duration Slider */}
              <Box>
                <Typography gutterBottom>Short Break Duration (minutes)</Typography>
                <Slider
                  value={durations.short / 60}
                  min={1}
                  max={15}
                  step={1}
                  valueLabelDisplay="auto"
                  onChange={(e, newValue) => updateDuration(newValue, 'short')}
                />
              </Box>
              
              {/* Long Break Duration Slider */}
              <Box>
                <Typography gutterBottom>Long Break Duration (minutes)</Typography>
                <Slider
                  value={durations.long / 60}
                  min={10}
                  max={30}
                  step={1}
                  valueLabelDisplay="auto"
                  onChange={(e, newValue) => updateDuration(newValue, 'long')}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSettings(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default PomodoroTimer;