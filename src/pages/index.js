import React, { useState } from 'react';
import { CircularProgress, Container, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import styles from '../styles/BeerLoader.module.css';
import axios from 'axios';


function App() {
  const [beerDescription, setBeerDescription] = useState('I want a nice light colored beer, with a hop-forward profile, and about 4.5% abv');
  const [beerVolume, setBeerVolume] = useState(23);
  const [brewType, setBrewType] = useState('extract');
  const [units, setUnits] = useState('metric');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState('');

  const handleChange = (event, setState) => {
    setState(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // Call your backend API here to keep the API key secure
    const response = await generateRecipe({
      beerDescription: beerDescription,
      beerVolume: beerVolume,
      units: units,
      brewType: brewType,
    });
    setLoading(false);
    // Assuming the response contains recipe and instructions
    setRecipe(response.recipe);
    setInstructions(response.instructions);
  };

  const generateRecipe = async ({beerDescription, beerVolume, units, brewType}) => {
    try {
      const response = await axios.post('/api/brew', {
        beerDescription: beerDescription,
        beerVolume: beerVolume,
        units: units,
        brewType: brewType,
      });

      console.log(response.data)
      //const recipe = response.data.recipe;
      //alert(response.data.recipe);
      return { recipe: response.data.recipe, instructions: response.data.instructions };
    } catch (error) {
      console.error('Error generating recipe:', error.response || error);
      return { recipe: '', instructions: '' };
    }

  };

  return (
    <Container className="Container" maxWidth="sm">
      <h1 className="title">BeerBlender</h1>
      <h3 className="subtitle">Beer Recipe Generator</h3>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Beer Description"
          value={beerDescription}
          onChange={(event) => handleChange(event, setBeerDescription)}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
        <InputLabel >Measurement Units</InputLabel>
          <Select label="Measurement Units" value={units} onChange={(event) => handleChange(event, setUnits)}>
            <MenuItem value="metric">Metric</MenuItem>
            <MenuItem value="imperial">Imperial</MenuItem>
          </Select>
          
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel >Desired Beer Volume</InputLabel>
          <Select label="Desired Beer Volume" value={beerVolume} onChange={(event) => handleChange(event, setBeerVolume)}>
            <MenuItem value={4.5}>4.5 L    (1 Gal)</MenuItem>
            <MenuItem value={11.4}>11.4 L   (2.5 Gal)</MenuItem>
            <MenuItem value={23}>23 L   (5 Gal)</MenuItem>
            <MenuItem value={45.5}>45.5 L   (10 Gal)</MenuItem>
            {/* Add more options as needed */}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Brew method</InputLabel>
          <Select label="Brew method" value={brewType} onChange={(event) => handleChange(event, setBrewType)}>
            <MenuItem value="extract">Extract</MenuItem>
            <MenuItem value="partial extract">Partial Extract</MenuItem>
            <MenuItem value="all grain">All-Grain</MenuItem>
            <MenuItem value="brew in a bag">All-Grain BIAB (Brew In A Bag)</MenuItem>
            {/* Add more options as needed */}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
          Generate Recipe
        </Button>
      </form>
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <span className="beerLoader">🍺</span>
        </div>
      )}
      {recipe && (
        <div>
          <h2>Ingredients:</h2>
          <pre className="recipeSection" style={{ whiteSpace: "pre-wrap" }}>{recipe}</pre>
          <h2>Instructions:</h2>
          <pre className="instructionSection" style={{ whiteSpace: "pre-wrap" }}>{instructions}</pre>
        </div>
      )}
    </Container>
  );
}

export default App;