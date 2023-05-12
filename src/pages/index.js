import React, { useState, useRef, useEffect } from 'react';
import { Container, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, InputAdornment } from '@mui/material';
import Image from 'next/image';
import Footer from '../../components/Footer';
import ClearIcon from '@mui/icons-material/Clear';
import { Analytics } from '@vercel/analytics/react';

const beerDescriptionList = [
  'A nice light colored beer, with a hop-forward profile using Citra and Simcoe, and about 4.5% abv',
  'A hoppy lager, with dark malts, and some flaked rice',
  'A raspberry kettle sour, with little to no bitterness',
  'A Pliny the Elder clone',
  'A 6.5% abv Belgian pale ale, with strong bitterness',
  'An imperial stout, using only English hops'  
]

function srmConvert(srmEstimate) {
  const colorHashTable = {
    1: '#FFE699',
    2: '#FFD878',
    3: '#FFCA5A',
    4: '#FFBF42',
    5: '#FBB123',
    6: '#F8A600',
    7: '#F39C00',
    8: '#EA8F00',
    9: '#E58500',
    10: '#DE7C00',
    11: '#D77200',
    12: '#CF6900',
    13: '#CB6200',
    14: '#C35900',
    15: '#BB5100',
    16: '#B54C00',
    17: '#B04500',
    18: '#A63E00',
    19: '#A13700',
    20: '#9B3200',
    21: '#952D00',
    22: '#8E2900',
    23: '#882300',
    24: '#821E00',
    25: '#7B1A00',
    26: '#771900',
    27: '#701400',
    28: '#6A0E00',
    29: '#660D00',
    30: '#5E0B00',
    31: '#5A0A02',
    32: '#600903',
    33: '#520907',
    34: '#4C0505',
    35: '#470606',
    36: '#440607',
    37: '#3F0708',
    38: '#3B0607',
    39: '#3A070B',
    40: '#36080A',
  };


  const roundedNumber = Math.round(srmEstimate);
  // Clamp the rounded number between 1 and 30 (inclusive)
  const clampedNumber = Math.max(1, Math.min(roundedNumber, 40));
  return colorHashTable[clampedNumber];
}

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
    // This code will only run on the client side, needed to have the random default beer description
    const existingValue = sessionStorage.getItem('beerDescriptionDefault');
    if (existingValue) {
      setBeerDescriptionDefault(existingValue);
    } else {
      const initialValue = beerDescriptionList[Math.floor(Math.random() * beerDescriptionList.length)]; // Generate your random value here
      sessionStorage.setItem('beerDescriptionDefault', initialValue);
      setBeerDescriptionDefault(initialValue);
    }
  }, []);
  

  function BeerStats({ beerColor, abv, srm, ibu, statsRef }) {


    return (
      <div ref={statsRef} className="statsContainer">
        <div className="leftItem">
          <svg xmlns="http://www.w3.org/2000/svg" width="110" height="200">
            <g transform="scale(0.3)">
              <rect x="41.9167" y="87.9553" width="316" height="500.7088" style={{ fill: { beerColor } }} />
              <rect x="68" y="118" width="284" height="430" fill={beerColor} />
              <path d="M105,110q9 -40,225 10v50q-120 20,-450 -15Zq-90 -40,-225 0v-50q120 20,280 2Z" fill="#FFFFFF" stroke="#3D414A" strokeWidth="6" />
              <path d="M0,0V606.5771H398V0H0ZM289.3819,510.2375C258.8333,537.1666,131,537.1666,104.5554,510.0182L67.9448,119.2761c0-2.6406,12.3885-5.681,131.0552-5.681,102.0736,0,131.5215,3.4049,131.5215,5.681Z" style={{ fill: '#fff' }} />
              <path d="M106.1667,512.011c36.3333,22.989,135.9081,26.6777,182.8707,0L285.3333,546C253.5,574.5,143.25,578,108.6785,546Z" style={{ fill: '#eee' }} />
              <path d="M287.6667,511.2773c-28.7987,24.056-150.9984,26.6107-181.5,0" style={{ fill: 'none', stroke: '#3d414a', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '6px' }} />
              <path d="M67.9448,119.2761l39.8773,425.6074c22.9279,32.1166,152.5112,31.45,177.9141,0l44.7853-425.6074c0-2.2761-29.4479-5.681-131.5215-5.681C80.3333,113.5951,67.9448,116.6355,67.9448,119.2761Z" style={{ fill: 'none', stroke: '#3d414a', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '12px' }} />
            </g>
          </svg>
        </div>

        <div className="rightItem">
          <p>ABV: {abv}%</p>
          <p>SRM: {srm}</p>
          <p>IBU: {ibu}</p>
        </div>
      </div>
    );
  };



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
    //console.log(response);
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
    //console.log(`"beerDescription = ${beerDescription}"`);
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
    //console.log(response);
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

  //<h1 className="title">BeerBlender</h1>
  //<h3 className="subtitle">Homebrew Recipe Generator</h3>


  return (
    <Container className="Container" maxWidth="sm">
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