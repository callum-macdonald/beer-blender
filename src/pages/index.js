import React, { useState, useRef, useEffect } from 'react';
import { Container, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, InputAdornment } from '@mui/material';
import Image from 'next/image';
import Head from "next/head";
import Footer from '../../components/Footer';
import BeerStats from '../../components/BeerStats';
import ClearIcon from '@mui/icons-material/Clear';
import { Analytics } from '@vercel/analytics/react';
import srmConvert from '../utils/srmConvert';

const beerDescriptionList = [
  'A nice light colored beer, with a hop-forward profile using Citra and Simcoe, and about 4.5% abv',
  'A hoppy lager, with dark malts, and some flaked rice',
  'A raspberry kettle sour, with little to no bitterness',
  'A Pliny the Elder clone',
  'A 6.5% abv Belgian pale ale, with strong bitterness',
  'An imperial stout, using only English hops'  
]


function App() {
  const [beerDescription, setBeerDescription] = useState('');
  //const [beerDescription, setBeerDescription] = useState('A NEIPA with citra, and galaxy');
  const [beerVolume, setBeerVolume] = useState(23);
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
  const [beerDescriptionDefault, setBeerDescriptionDefault] = useState(null);//() => beerDescriptionList[Math.floor(Math.random() * beerDescriptionList.length)]);
  
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
          // find number between "ABV:" and "SRM:"
          const abvTemp = estTemp.split("ABV:")[1].split("SRM:")[0].match(numberPattern)[0];
          setABV(abvTemp ? parseFloat(abvTemp).toFixed(1) : null);
          // find number between "SRM:" and "IBU:"
          const srmTemp = estTemp.split("SRM:")[1].split("IBU:")[0].match(numberPattern)[0];
          setSRM(srmTemp ? parseFloat(srmTemp).toFixed(1) : null);
          // find number between after "IBU:"
          const ibuTemp = estTemp.split("IBU:")[1].match(numberPattern)[0];
          setIBU(ibuTemp ? parseFloat(ibuTemp).toFixed(0) : null);
          scrollToResponse(statsRef);
          //console.log(genRes.split("Ingredients:")[0]);
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
            <MenuItem value="all grain">All-Grain</MenuItem>
            <MenuItem value="brew in a bag">All-Grain BIAB (Brew In A Bag)</MenuItem>
            {/* Add more options as needed */}
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

//<BeerGlass beerColor="#4E2A0C"/>
export default App;