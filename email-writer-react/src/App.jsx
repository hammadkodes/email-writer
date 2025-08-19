import { useState } from 'react'
import './App.css'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from '@mui/material'
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('')
  const [tone, setTone] = useState('')
  const [generatedReply, setGeneratedReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/email/generate`, {
        emailContent,
        tone
      });
      setGeneratedReply(response.data);
    } catch (error) {
      setError('Failed to generate reply. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Top Bar */}
      <AppBar position="static" sx={{ mb: 4, borderRadius: "0 0 12px 12px" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ✉️ Email Reply Generator
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        {/* Input Section */}
        <Card elevation={4} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Enter Email Details
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Original Email Content"
              value={emailContent || ''}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Tone (Optional)</InputLabel>
              <Select
                value={tone || ''}
                label="Tone (Optional)"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              fullWidth
              size="large"
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "✨ Generate Reply"}
            </Button>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Generated Reply Section */}
        {generatedReply && (
          <Card elevation={4} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Generated Reply
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={generatedReply || ''}
                inputProps={{ readOnly: true }}
              />
              <Box textAlign="right">
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigator.clipboard.writeText(generatedReply)}
                >
                  📋 Copy to Clipboard
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  )
}

export default App
