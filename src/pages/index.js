import React, { useState, useRef, useEffect } from 'react';
import { Container, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, InputAdornment } from '@mui/material';
import Image from 'next/image';
import Head from "next/head";
import Footer from '../../components/Footer';
import BeerStats from '../../components/BeerStats';
import ClearIcon from '@mui/icons-material/Clear';
import { Analytics } from '@vercel/analytics/react';
import srmConvert from '../utils/srmConvert';
import { FormatItalic } from '@mui/icons-material';

const beerDescriptionList = [
  'A session IPA, with citra and simcoe hops, and about 4.5% abv',
  'A hoppy lager, with dark malts, and some flaked rice',
  'A raspberry kettle sour, with little to no bitterness',
  'A Pliny the Elder clone',
  'A 6.5% abv Belgian pale ale, with strong bitterness',
  'An imperial stout, using only English hops'  
]



function App() {
  const [beerDescription, setBeerDescription] = useState('');
  const [beerVolume, setBeerVolume] = useState(5);
  const [brewType, setBrewType] = useState('all grain');
  const [units, setUnits] = useState('metric');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [estimates, setEstimates] = useState('');
  const [abv, setABV] = useState('');
  const [ibu, setIBU] = useState('');
  const [srm, setSRM] = useState('');
  const ingredientsRef = useRef(null);
  const instructionsRef = useRef(null);
  const statsRef = useRef(null);
  const [beerDescriptionDefault, setBeerDescriptionDefault] = useState(null);

  useEffect(() => {
    // This code will only run on the client side, needed to have the random default beer description not go haywire within session
    const existingValue = sessionStorage.getItem('beerDescriptionDefault');
    if (existingValue) {
      setBeerDescriptionDefault(existingValue);
    } else {
      const initialValue = beerDescriptionList[Math.floor(Math.random() * beerDescriptionList.length)]; // Generate your random value here
      sessionStorage.setItem('beerDescriptionDefault', initialValue);
      setBeerDescriptionDefault(initialValue);
    }
  }, []);
  
  const scrollToResponse = (ref) => {
    if (ref.current !== null) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleChange = (event, setState) => {
    setState(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!beerDescription.trim()) {
      setBeerDescription(beerDescriptionDefault);
    }
    // Call backend API here to keep the API key secure
    const response = await makeRecipe({
      beerDescription: beerDescription.trim() ? beerDescription : beerDescriptionDefault,
      beerVolume: beerVolume,
      units: units,
      brewType: brewType,
    });
  };

  const makeRecipe = async ({ beerDescription, beerVolume, units, brewType }) => {
    setGeneratedResponse("");
    setIngredients("");
    setInstructions("");
    setEstimates("");
    setABV("");
    setSRM("");
    setIBU("");
    setLoading(true);
    const response = await fetch("/api/brew", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        beerDescription,
        beerVolume,
        units,
        brewType,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedResponse((prev) => prev + chunkValue);
    }

    setLoading(false);

  };

  function updateData(generatedResponse) {
    useEffect(() => {
      // clean potential heading markdown which sometimes occurs
      let genRes = generatedResponse.replace(/\*\*/g, '');
      if (genRes.split("Estimates:").length > 1) {
        if (!loading) {
          const numberPattern = /[0-9]*\.?[0-9]+/g;
          // get everything after "Estimates:"
          const estTemp = genRes.split("Estimates:")[1];
          // console.log(estTemp);
          // find number between "ABV:" and "SRM:"
          const abvTemp = estTemp.split("ABV")[1].split("SRM")[0].match(numberPattern);
          setABV(abvTemp ? parseFloat(abvTemp[0]).toFixed(1) : '?');
          // find number between "SRM:" and "IBU:"
          const srmTemp = estTemp.split("SRM")[1].split("IBU")[0].match(numberPattern);
          setSRM(srmTemp ? parseFloat(srmTemp[0]).toFixed(1) : '?');
          // find number between after "IBU:"
          const ibuTemp = estTemp.split("IBU")[1].match(numberPattern);
          setIBU(ibuTemp ? parseFloat(ibuTemp[0]).toFixed(0) : '?');
          scrollToResponse(statsRef);
        }
      } else if (genRes.split("Instructions:").length > 1) {
        scrollToResponse(instructionsRef);
        setInstructions(genRes.split("Instructions:")[1].slice(0, -9));
      } else if (genRes.split("Ingredients:").length > 1 && genRes.split("Ingredients:")[1].length >= 12) {
        scrollToResponse(ingredientsRef);
        setIngredients(genRes.split("Ingredients:")[1].slice(0, -12));
      }
    }, [generatedResponse, loading, abv]);
  }

  updateData(generatedResponse);

  return (
    <Container className="Container" maxWidth="sm">
      <Head>
        <title>BeerBlender</title>
      </Head>
      <div className="logo">
        <Image priority="true" src="/BeerBlender.svg" alt="Logo" width={300} height={100} />
      </div>
      <form onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Enter Beer Description"
          placeholder={beerDescriptionDefault}
          value={beerDescription}
          onChange={(event) => handleChange(event, setBeerDescription)}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear beer description"
                  onClick={() => setBeerDescription('')}
                  disabled={loading}
                  style={{marginRight: -13, marginLeft: -15}}
                >
                <ClearIcon fontSize="small"/>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel >Measurement Units</InputLabel>
          <Select label="Measurement Units" value={units} onChange={(event) => handleChange(event, setUnits)}>
            <MenuItem value="metric">Metric</MenuItem>
            <MenuItem value="US">US</MenuItem>
          </Select>

        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel >Desired Beer Volume</InputLabel>
          <Select label="Desired Beer Volume" value={beerVolume} onChange={(event) => handleChange(event, setBeerVolume)}>
            <MenuItem value={1}>1 US gal (3.8L)</MenuItem>
            <MenuItem value={2.5}>2.5 US gal (9.5L)</MenuItem>
            <MenuItem value={5}>5 US gal (18.9L)</MenuItem>
            <MenuItem value={7.5}>7.5 US gal (28.4L)</MenuItem>
            <MenuItem value={10}>10 US gal (37.9L)</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Brew method</InputLabel>
          <Select label="Brew method" value={brewType} onChange={(event) => handleChange(event, setBrewType)}>
            <MenuItem value="extract">Extract</MenuItem>
            <MenuItem value="all grain">All-Grain</MenuItem>
            <MenuItem value="brew in a bag">All-Grain BIAB (Brew In A Bag)</MenuItem>
          </Select>
        </FormControl>
        <Button style={{ height: "50px", marginTop: "10px" }} fullWidth type="submit" variant="contained" color="primary" disabled={loading}>
          {(loading) ? (
            <span className="beerLoader">🍺</span>
          ) : (
            "Generate Recipe"
          )}
        </Button>
      </form>

      {ingredients && (
        <div>
          <h2 ref={ingredientsRef}>Ingredients:</h2>
          <pre className="ingredientsSection" style={{ whiteSpace: "pre-wrap", marginBottom: "10px" }}>{ingredients}</pre>
        </div>
      )}
      {instructions && (
        <div>
          <h2 style={{ marginTop: "-15px" }} ref={instructionsRef}>Instructions:</h2>
          <pre className="instructionSection" style={{ whiteSpace: "pre-wrap" }}>{instructions}</pre>
        </div>
      )}
      {abv && (
        <BeerStats beerColor={srmConvert(srm)} abv={abv} srm={srm} ibu={ibu} statsRef={statsRef} />
      )}
      <Footer />
      <Analytics />
    </Container>
    
  );
}

export default App;