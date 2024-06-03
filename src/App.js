import './App.css';
import { Autocomplete, TextField, Box} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import noImage from './images/noImage.png'

function App() {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true); 
      try {
        const response = await axios.get('https://raw.githubusercontent.com/extwiii/React-Node-Google-Search/master/data/sorted.json');
        setUniversities(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error)
      }
      finally {
        setLoading(false); 
      }
    };
    
    fetchUniversities();
  }, []);

  const handleChange = (event, newValue) => {
    setSelectedUniversity(newValue);
  };

  const filterOptions = (options, { inputValue }) => {
    const filteredUniversities = options?.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    return filteredUniversities.slice(0, 20);
  };

  const universityOptions = universities.map((university, index) => ({
    label: university.name,
    id: `${university.name}-${university.country}-${index}`,
    logo: university.img,
    url: university.web_page,
    country: university.country
  }))

  // console.log(universities);

  return (
    <div className="App">
      {error && <>Our website facing some issues. Please visit after some time.</>}
      {!error && <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={universityOptions}
        loading={loading}
        sx={{ width: 300 }}
        value={selectedUniversity}
        filterOptions={filterOptions}
        onChange={handleChange}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        renderInput={(params) => <TextField {...params} label="University" />}
      />}
      {selectedUniversity  && !loading && !error && (
        <Box className="university" mt={2}>
          <img src={selectedUniversity.logo ? selectedUniversity.logo : noImage} className='collage-logo' alt="College Logo" onError={(e) => { e.target.onerror = null; e.target.src = ''; }} />
          <div className='university-details'>
            <a className='university-name' href={selectedUniversity.url} rel="noopener noreferrer" target='_blank'>{selectedUniversity.label}</a>
            <span className='university-country-name'>{selectedUniversity.country}</span>
          </div>
        </Box>
      )}
    </div>
  );
}

export default App;
